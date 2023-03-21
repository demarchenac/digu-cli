import { writeFileSync } from "fs";
import { Command, ux } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";
import { flags } from "../../../flags";
import { guards } from "../../../guards";
import { navigation, scrape } from "../../../utils";
import type {
  Credentials,
  OptionalCredentials,
} from "../../../types/credentials";

export default class Following extends Command {
  static description =
    "Should fetch a list of the accounts that the provided user follows";

  static examples = [
    `$ digu-cli ig list following (this way the clit will ask relevant info it may need)`,
    `$ digu-cli ig list following -u <username> -p <password> -s`,
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

  async scrapeFollowingCount(
    page: Page,
    { user }: { user: string }
  ): Promise<number> {
    ux.action.start(`How many accounts does @${user} follow?`);

    // go to profile
    await navigation.instagram.goToProfile(page, { user });

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
    await navigation.instagram.goToProfile(page, { user });

    // scrape followers!
    // Show followers
    await navigation.instagram.focusProfileDialog(page, {
      dialog: "following",
    });

    let following = await scrape.instagram.profileDialogLinks(page);

    progressBar.update(following.length);

    let previousCount = 0;
    let stuckCount = 0;

    // we'll scroll until we can get all of the account followers user tags.
    // or until we're 'stuck' (meaning no more accounts are loading).
    while (following.length < followingCount && stuckCount < 5) {
      await page.keyboard.press("End");
      await page.waitForTimeout(5000);

      previousCount = following.length;
      following = await scrape.instagram.profileDialogLinks(page);

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

    const followingCount = await this.scrapeFollowingCount(page, { user });

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
