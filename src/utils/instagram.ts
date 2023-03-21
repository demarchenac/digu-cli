import { ux } from "@oclif/core";
import { Page } from "playwright";
import type { Credentials } from "../types/credentials";

export async function login(page: Page, { user, password }: Credentials) {
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
      throw error;
    }
  } finally {
    await page.waitForTimeout(3000);
    ux.action.stop("✅ Logged in!");
  }
}

export async function goToMyProfile(page: Page, { user }: { user: string }) {
  await page
    .getByRole("link", { name: `${user}'s profile picture Profile` })
    .click();
  await page.waitForTimeout(3000);
}

export async function focusProfileDialog(
  page: Page,
  { dialog }: { dialog: "followers" | "following" }
) {
  // Show followers
  await page.getByText(dialog).click();
  await page.waitForTimeout(3000);

  // we'll focus the first profile in order to scroll the container to the end
  await page.getByRole("dialog").getByRole("link").first().focus();
  await page.waitForTimeout(3000);
}

export async function scrapeDialogLinks(page: Page) {
  const dialogLinksInnerText = await page
    .getByRole("dialog")
    .getByRole("link")
    .allInnerTexts();

  const dialogLinkContents = dialogLinksInnerText
    .filter((innerText) => innerText.trim().length > 0)
    .map((innerText) => innerText.replace("\nVerified", ""));

  return dialogLinkContents;
}

export async function goToUserProfile(
  page: Page,
  { userToSearch }: { userToSearch: string }
) {
  ux.action.start(`Going to @${userToSearch}'s profile`);

  await page.getByRole("link").getByText("search").click();
  await page.waitForTimeout(3 * 1000);
  await page.getByPlaceholder("search").fill(userToSearch);
  await page.waitForTimeout(10 * 1000);
  await page.getByText(userToSearch, { exact: true }).click();
  await page.waitForTimeout(10 * 1000);

  ux.action.stop(`✅ viewing @${userToSearch}'s profile`);
}

export async function unfollowCurrentProfile(page: Page) {
  ux.action.start("Unfollowing account");

  await page.getByRole("button").getByText("Following").click();
  await page.waitForTimeout(3 * 1000);
  await page.getByRole("dialog").first().getByText("unfollow").click();
  await page.waitForTimeout(5 * 1000);

  ux.action.stop("✅ Account unfollowed!");
}

export async function unfollowUser(page: Page, { user }: { user: string }) {
  await goToUserProfile(page, { userToSearch: user });
  await unfollowCurrentProfile(page);
}