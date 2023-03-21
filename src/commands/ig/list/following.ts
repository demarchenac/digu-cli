import { writeFileSync } from "fs";
import { Args, Command, Flags, ux } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";

type optionalString = string | undefined;

export default class Following extends Command {
  static description =
    "Should fetch a list of the accounts that the provided user follows";

  static examples = [
    `$ digu-cli ig list following (this way the clit will ask relevant info it may need)`,
    `$ digu-cli ig list following -u <username> -p <password> -s`,
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

  async scrapeFollowingCount(
    page: Page,
    { user }: { user: string }
  ): Promise<number> {
    ux.action.start(`How many accounts does @${user} follow?`);

    // go to profile
    await page
      .getByRole("link", { name: `${user}'s profile picture Profile` })
      .click();
    await page.waitForTimeout(3000);

    // get follower count
    const followingTextContent = await page
      .getByText("following")
      .textContent();

    const followingCount = parseInt(
      (followingTextContent ?? "0").replace(" following", "").replace(",", "")
    );

    ux.action.stop(`✅ ${followingCount} accounts!`);
    return followingCount;
  }

  async scrapeFollowing(
    page: Page,
    { user, followingCount }: { user: string; followingCount: number }
  ): Promise<string[]> {
    const progressBar = ux.progress({
      format: "Scrapping followed accounts | {bar} | {value}/{total} accounts",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
    });

    progressBar.start(followingCount, 0, {
      value: 0,
      total: followingCount,
    });

    // go to profile
    await page
      .getByRole("link", { name: `${user}'s profile picture Profile` })
      .click();
    await page.waitForTimeout(3000);

    // scrape followers!
    // Show followers
    await page.getByText("following").click();
    await page.waitForTimeout(3000);

    // we'll scroll until we can get all of the account followers user tags.
    let following = await page
      .getByRole("dialog")
      .getByRole("link")
      .allInnerTexts();

    following = following.filter((followed) => followed.trim().length > 0);

    progressBar.update(following.length);

    // we'll focus the first profile in order to scroll the container to the end
    await page.getByRole("dialog").getByRole("link").first().focus();
    await page.waitForTimeout(3000);

    let previousCount = 0;

    let stuckCount = 0;

    while (following.length < followingCount && stuckCount < 5) {
      await page.keyboard.press("End");
      await page.waitForTimeout(5000);
      previousCount = following.length;
      following = await page
        .getByRole("dialog")
        .getByRole("link")
        .allInnerTexts();

      following = following
        .filter((innerText) => innerText.trim().length > 0)
        .map((innerText) => innerText.replace("\nVerified", ""));

      progressBar.update(following.length);

      if (previousCount === following.length) {
        stuckCount++;
      }
    }

    progressBar.stop();

    if (stuckCount >= 5) {
      this.log(
        `\tA discrepancy was found, we only found ${following.length} followed accounts instead of ${followingCount}!`
      );
    }

    return following;
  }

  save({ user, following }: { user: string; following: string[] }) {
    ux.action.start(`Saving @${user} followed accounts ${following.length}`);
    const json = JSON.stringify({ following }, null, 2);
    const filename = `${user} following.json`;
    writeFileSync(filename, json, "utf-8");
    ux.action.stop(`✅ ${filename} was saved!`);
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Following);
    const { save, viewBrowser } = flags;

    const credentials = await this.ensureCredentials(flags);
    const { user } = credentials;

    const browser = await chromium.launch({ headless: !viewBrowser });
    const page = await browser.newPage();

    await this.login(page, credentials);
    await page.waitForTimeout(3000);
    const followingCount = await this.scrapeFollowingCount(page, { user });
    await page.waitForTimeout(3000);
    const following = await this.scrapeFollowing(page, {
      user,
      followingCount,
    });

    await browser.close();

    if (save) {
      this.save({ user, following });
    } else {
      this.log(
        `@${user} following accounts were not saved! If you wish to save them don't forget to add the -s flag!`
      );
    }
  }
}
