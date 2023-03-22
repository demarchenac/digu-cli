import { Args, Command, Flags, ux } from "@oclif/core";
import type { Page } from "playwright";
import { chromium } from "playwright";
import { flags } from "../../../flags";
import { navigation } from "../../../utils";
import { guards } from "../../../guards";
import type {
  Credentials,
  OptionalCredentials,
} from "../../../types/credentials";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { messageQueue } from "../../../utils/messages";

const { save, ...igFlags } = flags.ig;

export default class Followers extends Command {
  static description =
    "Should unfollow the specified @users from the unfollow list at the from the account provided.";

  static examples = [
    `$ digu-cli ig unfollow list <JSON file with a list of @users to unfollow> (this way the CLI will ask relevant info it may need)`,
    `$ digu-cli ig unfollow list <JSON file with a list of @users to unfollow> -u <username> -p <password>`,
  ];

  static args = {
    usersFile: Args.string({
      name: "filename of users list",
      required: true,
      description: "Json file containing a list of @users",
    }),
  };

  static flags = {
    ...igFlags,
    keepFavorites: Flags.boolean({
      default: false,
      required: false,
      aliases: ["keep-favorites"],
    }),
  };

  async ensureCredentials(
    credentials: OptionalCredentials
  ): Promise<Credentials> {
    return await guards.credentials(credentials);
  }

  loadUsers(filename: string): string[] | null {
    const filePath = join(process.cwd(), filename);

    if (!existsSync(filePath)) {
      this.log(`The provided file doesn't exists, full file path: ${filePath}`);
      return null;
    }

    const fileBuffer = readFileSync(filePath);
    const users = JSON.parse(fileBuffer.toLocaleString()) as string[];

    return users;
  }

  async login(page: Page, credentials: Credentials): Promise<void> {
    try {
      await navigation.instagram.login(page, credentials);
    } catch (err) {
      const error = err as Error;
      this.log(error.message);
    }
  }

  async unfollowUsers(
    page: Page,
    {
      users,
      keepFavorites = false,
    }: { users: string[]; keepFavorites: boolean }
  ) {
    const total = users.length > 150 ? 150 : users.length;
    const progressBar = ux.progress({
      format: "Unfollowing {toUnfollow} | {bar} | {value}/{total} unfollows",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
    });

    // workaround to log lines when a progress bar is currently being rendered.
    progressBar.on("redraw-pre", () => {
      const lastMessageRequested = messageQueue.getLastMessageRequested();
      const lastMessage = messageQueue.getLastMessage();

      if (lastMessageRequested !== lastMessage && lastMessage !== null) {
        const resetLineCommand = "\r\x1b[K";
        process.stdout.write(`${resetLineCommand}${lastMessage}\n`);
      }
    });

    progressBar.start(total, 0, { toUnfollow: `@`, value: 0, total });

    let userIndex = 0;
    // we cannot unfollow more than 150 accounts on a daily basis
    // source: https://thepreviewapp.com/instagram-limits/#maximum-following-limit
    while (userIndex < users.length && userIndex < 150) {
      const user = users[userIndex];
      const userCount = userIndex + 1;

      progressBar.update(userCount, {
        toUnfollow: `@${user}`,
        value: 0,
        total: users.length,
      });

      await navigation.instagram.unfollowUser(page, {
        user,
        keepFavorites,
        cacheMessagesToQueue: true,
      });
      // in order to unfollow 50 accounts this timeout is needed, if we don't
      // follow this limitation, Instagram could ban the user's account, since
      // an user account should only unfollow up to 60 accounts hourly.
      // source: https://thepreviewapp.com/instagram-limits/#maximum-following-limit
      await page.waitForTimeout(1.2 * 60 * 1000);
      userIndex++;
    }

    progressBar.stop();
    if (userIndex === 150) {
      this.log(
        "⚠️ Your account should only unfollow up to 150 accounts on a daily basis"
      );
      this.log(
        `\t The last account that was going to be unfollowed was: ${users[userIndex]}`
      );
    } else {
      this.log("✅ All accounts without errors have been unfollowed!");
    }
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Followers);
    const { viewBrowser, keepFavorites } = flags;

    const credentials = await this.ensureCredentials(flags);

    const users = this.loadUsers(args.usersFile);

    if (!users) {
      this.log("The user list to remove couldn't be loaded");
      return;
    }

    const browser = await chromium.launch({ headless: !viewBrowser });
    const page = await browser.newPage();

    await this.login(page, credentials);
    await this.unfollowUsers(page, { users, keepFavorites });

    await browser.close();
  }
}
