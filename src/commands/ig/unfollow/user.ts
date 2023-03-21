import { Args, Command } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";
import { flags } from "../../../flags";
import { navigation } from "../../../utils";
import { guards } from "../../../guards";
import type {
  Credentials,
  OptionalCredentials,
} from "../../../types/credentials";

const { save, ...igFlags } = flags.ig;

export default class Followers extends Command {
  static description =
    "Should fetch a list of the accounts that are following the provided user";

  static examples = [
    `$ digu-cli ig unfollow user <@userToUnfollow> (this way the CLI will ask relevant info it may need)`,
    `$ digu-cli ig unfollow user <@userToUnfollow> -u <username> -p <password>`,
  ];

  static args = {
    userToUnfollow: Args.string({
      name: "user to unfollow",
      required: true,
      description: "the user tag that must be unfollowed",
    }),
  };

  static flags = igFlags;

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

  async unfollowUser(page: Page, { user }: { user: string }) {
    return await navigation.instagram.unfollowUser(page, { user });
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Followers);
    const { viewBrowser } = flags;

    const credentials = await this.ensureCredentials(flags);

    const browser = await chromium.launch({ headless: !viewBrowser });
    const page = await browser.newPage();

    await this.login(page, credentials);
    await this.unfollowUser(page, { user: args.userToUnfollow });

    await browser.close();
  }
}
