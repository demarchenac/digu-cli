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
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { messageQueue } from "../../../utils/messages";

const { save, ...igFlags } = flags.ig;
const sep = " dicu-cli-leftover ";

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
      description:
        "This flag avoid unfollowing accounts that your profile has marked as favorite",
    }),
  };

  async ensureCredentials(
    credentials: OptionalCredentials
  ): Promise<Credentials> {
    return await guards.credentials(credentials);
  }

  loadUsers(filename: string, { user }: { user: string }): string[] | null {
    if (filename.includes(sep)) {
      const today = new Date();
      const todayInfo = {
        year: today.getFullYear(),
        month: (today.getMonth() + 1).toString().padStart(2, "0"),
        date: today.getDate().toString().padStart(2, "0"),
      };
      const todayFormatted = `${todayInfo.year}-${todayInfo.month}-${todayInfo.date}`;

      const timestamp = new Date(filename.split(sep)[1].replace(".json", ""));
      const timestampInfo = {
        year: timestamp.getFullYear(),
        month: (timestamp.getMonth() + 1).toString().padStart(2, "0"),
        date: timestamp.getDate().toString().padStart(2, "0"),
      };
      const timestampFormatted = `${timestampInfo.year}-${timestampInfo.month}-${timestampInfo.date}`;

      if (todayFormatted === timestampFormatted) {
        this.log(
          `❌ We've already reached the suggested removal limit for @${user}'s account.
\tYou could try providing a different account

ℹ️ If you wish to continue just rename the file or remove '${sep}' from the filename.
          `
        );
        return null;
      }
    }

    if (!filename.includes(".json")) {
      this.log(
        `❌ The user list should be in JSON format, the provided (${filename}) isn't a JSON file`
      );
      return null;
    }

    const filePath = join(process.cwd(), filename);

    if (!existsSync(filePath)) {
      this.log(
        `❌ The provided file doesn't exists, full file path: ${filePath}`
      );
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
  ): Promise<string[] | null> {
    const dailyLimit = 150;
    const hourlyLimit = 50;

    const total = users.length > dailyLimit ? dailyLimit : users.length;
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
    while (userIndex < users.length && userIndex < dailyLimit) {
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
      await page.waitForTimeout((60 / hourlyLimit) * 60 * 1000);
      userIndex++;
    }

    progressBar.stop();
    if (userIndex === dailyLimit) {
      this.log(
        `⚠️ Your account should only unfollow up to ${dailyLimit} accounts on a daily basis`
      );
      this.log(
        `\t The last account that was going to be unfollowed was: ${users[userIndex]}`
      );
      return users.slice(userIndex);
    } else {
      this.log("✅ All accounts without errors have been unfollowed!");
      return null;
    }
  }

  saveRemainingUsers(filename: string, users: string[]) {
    const timestamp = new Date().toISOString();
    let newFilename = filename.replace(".json", `${sep}${timestamp}.json`);

    if (filename.includes(" dicu-cli-leftover ")) {
      newFilename =
        filename.split(" dicu-cli-leftover ")[1] + `${sep}${timestamp}.json`;
    }

    const filePath = join(process.cwd(), newFilename);

    const json = JSON.stringify(users, null, 2);
    this.log(
      `\tℹ️ The remaining users to unfollow were saved in ${newFilename}`
    );

    // save leftovers & erase original file.
    writeFileSync(filePath, json, "utf-8");
    unlinkSync(join(process.cwd(), filename));
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Followers);
    const { viewBrowser, keepFavorites } = flags;

    const credentials = await this.ensureCredentials(flags);

    const users = this.loadUsers(args.usersFile, { user: credentials.user });

    if (!users) {
      this.log("The user list to remove couldn't be loaded");
      return;
    }

    const browser = await chromium.launch({ headless: !viewBrowser });
    const page = await browser.newPage();

    await this.login(page, credentials);
    const leftover = await this.unfollowUsers(page, { users, keepFavorites });

    await browser.close();

    if (leftover) {
      this.saveRemainingUsers(args.usersFile, leftover);
    }
  }
}
