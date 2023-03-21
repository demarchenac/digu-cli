import { writeFileSync } from "fs";
import { Args, Command, Flags, ux } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";

type optionalString = string | undefined;

export default class Followers extends Command {
  static description =
    "Should fetch a list of the accounts that the provided user follows";

  static examples = [
    `$ digu-cli ig list followers (this way the clit will ask relevant info it may need)`,
    `$ digu-cli ig list followers -u <username> -p <password> -s`,
  ];

  static args = {};

  static flags = {
    user: Flags.string({
      char: "u",
      aliases: ["u", "username"],
      description: "User's account.",
      required: false,
    }),
    password: Flags.string({
      char: "p",
      aliases: ["p", "password"],
      description: "User's password.",
      required: false,
    }),
    save: Flags.boolean({
      char: "s",
      aliases: ["s", "save-results"],
      description: "Whether or not this list should be saved.",
      required: false,
      default: false,
    }),
    viewBrowser: Flags.boolean({
      char: "v",
      aliases: ["v", "view-browser"],
      description: "Wether or not the browser should open in a headless manner",
      required: false,
      default: false,
    }),
  };

  async ensureCredentials(credentials: {
    user: optionalString;
    password: optionalString;
  }): Promise<{ user: string; password: string }> {
    let { user, password } = credentials;

    if (!user) {
      user = await ux.prompt("Account username");
    }

    if (!password) {
      password = await ux.prompt("Account password", { type: "hide" });
    }

    return { user, password };
  }

  async login(
    page: Page,
    { user, password }: { user: string; password: string }
  ): Promise<void> {
    ux.action.start(`Log into @${user}'s account`);

    await page.goto("https://www.instagram.com");
    await page.waitForTimeout(3000);

    await page.getByLabel("Phone number, username, or email").fill(user);
    await page.waitForTimeout(3000);

    await page.getByLabel("Password").fill(password);
    await page.waitForTimeout(3000);

    await page.getByText("Log in", { exact: true }).click();

    try {
      await page.waitForTimeout(10000);

      // dont save login info
      await page.getByText("Not now").click();
      await page.waitForTimeout(10000);

      // skip notifications alert
      await page.getByText("Not now").click();
    } catch (err) {
      const error = err as Error;
      if (!error.message.includes("waiting for getByText('Not now')")) {
        this.log(error.message);
        throw error;
      }
    } finally {
      ux.action.stop("✅ Logged in!");
    }
  }

  async scrapeFollowerCount(
    page: Page,
    { user }: { user: string }
  ): Promise<number> {
    ux.action.start(`How many followers does @${user} has?`);

    // go to profile
    await page
      .getByRole("link", { name: `${user}'s profile picture Profile` })
      .click();
    await page.waitForTimeout(3000);

    // get follower count
    const followersTextContent = await page
      .getByText("followers")
      .textContent();

    const followerCount = parseInt(
      (followersTextContent ?? "0").replace(" followers", "")
    );

    ux.action.stop(`✅ ${followerCount} followers!`);
    return followerCount;
  }

  async scrapeFollowers(
    page: Page,
    { user, followerCount }: { user: string; followerCount: number }
  ): Promise<string[]> {
    const progressBar = ux.progress({
      format: "Scrapping followers | {bar} | {value}/{total} accounts",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
    });

    progressBar.start(followerCount, 0, {
      value: 0,
      total: followerCount,
    });

    // go to profile
    await page
      .getByRole("link", { name: `${user}'s profile picture Profile` })
      .click();
    await page.waitForTimeout(3000);

    // scrape followers!
    // Show followers
    await page.getByText("followers").click();
    await page.waitForTimeout(3000);

    // we'll scroll until we can get all of the account followers user tags.
    let followers = await page
      .getByRole("dialog")
      .getByRole("link")
      .allInnerTexts();

    followers = followers.filter((follower) => follower.trim().length > 0);

    progressBar.update(followers.length);

    // we'll focus the first profile in order to scroll the container to the end
    await page.getByRole("dialog").getByRole("link").first().focus();
    await page.waitForTimeout(3000);

    while (followers.length < followerCount) {
      await page.keyboard.press("End");
      await page.waitForTimeout(5000);
      followers = await page
        .getByRole("dialog")
        .getByRole("link")
        .allInnerTexts();

      followers = followers.filter((innerText) => innerText.trim().length > 0);

      progressBar.update(followers.length);
    }

    progressBar.stop();

    return followers;
  }

  save({ user, followers }: { user: string; followers: string[] }) {
    ux.action.start(`Saving @${user} followers`);
    const json = JSON.stringify({ followers }, null, 2);
    const filename = `${user} followers.json`;
    writeFileSync(filename, json, "utf-8");
    ux.action.stop(`✅ ${filename} was saved!`);
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Followers);
    const { save, viewBrowser } = flags;

    const credentials = await this.ensureCredentials(flags);
    const { user } = credentials;

    const browser = await chromium.launch({ headless: !viewBrowser });
    const page = await browser.newPage();

    await this.login(page, credentials);
    await page.waitForTimeout(3000);
    const followerCount = await this.scrapeFollowerCount(page, { user });
    await page.waitForTimeout(3000);
    const followers = await this.scrapeFollowers(page, { user, followerCount });

    await browser.close();

    if (save) {
      this.save({ user, followers });
    } else {
      this.log(
        `@${user} followers were not saved! If you wish to save them don't forget to add the -s flag!`
      );
    }
  }
}
