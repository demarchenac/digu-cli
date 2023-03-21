import { writeFileSync } from "fs";
import { Command, ux } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";
import { flags } from "../../../flags";
import { navigation, scrape } from "../../../utils";
import { guards } from "../../../guards";
import type {
  Credentials,
  OptionalCredentials,
} from "../../../types/credentials";

export default class Followers extends Command {
  static description =
    "Should fetch a list of the accounts that are following the provided user";

  static examples = [
    `$ digu-cli ig list followers (this way the clit will ask relevant info it may need)`,
    `$ digu-cli ig list followers -u <username> -p <password> -s`,
  ];

  static args = {};

  static flags = flags.list;

  async ensureCredentials(
    credentials: OptionalCredentials
  ): Promise<Credentials> {
    return await guards.credentials(credentials);
  }

  async login(page: Page, credentials: Credentials): Promise<void> {
    try {
      await navigation.instagram.login(page, credentials);
    } catch (err) {
      const error = err as Error;
      this.log(error.message);
    }
  }

  async scrapeFollowerCount(
    page: Page,
    { user }: { user: string }
  ): Promise<number> {
    ux.action.start(`How many followers does @${user} has?`);

    // go to profile
    await navigation.instagram.goToProfile(page, { user });

    // get follower count
    const followersTextContent = await page
      .getByText("followers")
      .textContent();

    const followerCount = parseInt(
      (followersTextContent ?? "0").replace(" followers", "").replace(",", "")
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
    await navigation.instagram.goToProfile(page, { user });

    // scrape followers!
    await navigation.instagram.focusProfileDialog(page, {
      dialog: "followers",
    });

    let followers = await scrape.instagram.profileDialogLinks(page);

    progressBar.update(followers.length);

    let previousCount = 0;
    let stuckCount = 0;

    // we'll scroll until we can get all of the account followers user tags.
    // or until we're 'stuck' (meaning no more accounts are loading).
    while (followers.length < followerCount && stuckCount < 5) {
      await page.keyboard.press("End");
      await page.waitForTimeout(5000);

      previousCount = followers.length;
      followers = await scrape.instagram.profileDialogLinks(page);

      progressBar.update(followers.length);

      if (previousCount === followers.length) {
        stuckCount++;
      }
    }

    progressBar.stop();

    if (stuckCount >= 5) {
      this.log(
        `\tA discrepancy was found, we only found ${followers.length} followers instead of ${followerCount}!`
      );
    }

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

    const followerCount = await this.scrapeFollowerCount(page, { user });

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
