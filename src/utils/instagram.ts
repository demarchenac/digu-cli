import { ux } from '@oclif/core';
import { Page } from 'playwright';
import type { Credentials } from '../types/credentials';
import { messageQueue } from './messages';

export async function login(page: Page, { user, password }: Credentials) {
	ux.action.start(`Log into @${user}'s account`);

	await page.goto('https://www.instagram.com');
	await page.waitForTimeout(3000);

	await page.getByLabel('Phone number, username, or email').fill(user);
	await page.waitForTimeout(3000);

	await page.getByLabel('Password').fill(password);
	await page.waitForTimeout(3000);

	await page.getByText('Log in', { exact: true }).click();

	try {
		await page.waitForTimeout(10_000);
		// dont save login info
		await page.getByText('Not now').click();
		await page.waitForTimeout(10_000);

		// skip notifications alert
		await page.getByText('Not now').click();
	} catch (error_) {
		const error = error_ as Error;
		if (!error.message.includes("waiting for getByText('Not now')")) {
			throw error;
		}
	} finally {
		await page.waitForTimeout(3000);
		ux.action.stop('✅ Logged in!');
	}
}

export async function goToMyProfile(page: Page, { user }: { user: string }) {
	await page
		.getByRole('link', { name: `${user}'s profile picture Profile` })
		.click();
	await page.waitForTimeout(3000);
}

export async function focusProfileDialog(
	page: Page,
	{ dialog }: { dialog: 'followers' | 'following' },
) {
	// Show followers
	await page.getByText(dialog).click();
	await page.waitForTimeout(3000);

	// we'll focus the first profile in order to scroll the container to the end
	await page.getByRole('dialog').getByRole('link').first().focus();
	await page.waitForTimeout(3000);
}

export async function scrapeDialogLinks(page: Page) {
	const dialogLinksInnerText = await page
		.getByRole('dialog')
		.getByRole('link')
		.allInnerTexts();

	const dialogLinkContents = dialogLinksInnerText
		.filter((innerText) => innerText.trim().length > 0)
		.map((innerText) => innerText.replace('\nVerified', ''));

	return dialogLinkContents;
}

export async function goToUserProfile(
	page: Page,
	{
		userToSearch,
		logMessages = true,
	}: { userToSearch: string; logMessages: boolean },
) {
	if (logMessages) {
		ux.action.start(`Going to @${userToSearch}'s profile`);
	}

	await page.getByRole('link').getByText('search').click();
	await page.waitForTimeout(3 * 1000);
	await page.getByPlaceholder('search').fill(userToSearch);
	await page.waitForTimeout(10 * 1000);
	await page.getByRole('link').getByText(userToSearch, { exact: true }).click();
	await page.waitForTimeout(10 * 1000);

	const isSidebarOpen = await page.getByPlaceholder('search').isVisible();
	if (isSidebarOpen) {
		await page.getByRole('link').getByLabel('search').click();
		await page.waitForTimeout(3 * 1000);
	}

	if (logMessages) {
		ux.action.stop(`✅ viewing @${userToSearch}'s profile`);
	}
}

async function isDialogCloseButtonVisible(page: Page) {
	const isButtonVisible = await page
		.getByRole('dialog')
		.getByRole('button')
		.getByRole('img', { name: 'Close', exact: true })
		.isVisible();

	return isButtonVisible;
}

async function closeDialog(page: Page) {
	await page
		.getByRole('dialog')
		.getByRole('button')
		.getByRole('img', { name: 'Close', exact: true })
		.click();

	await page.waitForTimeout(3 * 1000);
}

export async function unfollowCurrentProfile(
	page: Page,
	{
		user,
		keepFavorites = false,
		cacheMessagesToQueue = false, // messages should be hidden and errors should be passed to messageQueue.
	}: { user: string; keepFavorites: boolean; cacheMessagesToQueue: boolean },
) {
	if (!cacheMessagesToQueue) {
		ux.action.start(`Unfollowing @${user}'s account`);
	}

	const followingLocator = await page
		.getByRole('button')
		.getByText('Following');

	const isFollowing = (await followingLocator.count()) === 1;

	if (!isFollowing) {
		if (cacheMessagesToQueue) {
			messageQueue.addMessage(`❌ you're not following @${user}'s account`);
		} else {
			ux.action.stop(`❌ you're not following @${user}'s account`);
		}

		return;
	}

	await followingLocator.click();
	await page.waitForTimeout(3 * 1000);

	if (keepFavorites) {
		const isMarkedAsFavorite = await page
			.getByRole('dialog')
			.getByText('Remove from favorites')
			.isVisible();

		if (isMarkedAsFavorite) {
			await closeDialog(page);

			if (cacheMessagesToQueue) {
				messageQueue.addMessage(`❌ @${user}'s account is marked as favorite!`);
			} else {
				ux.action.stop(`❌ @${user}'s account is marked as favorite!`);
			}

			return;
		}
	}

	await page.getByRole('dialog').first().getByText('unfollow').click();
	await page.waitForTimeout(3 * 1000);

	const dialogIsStillOpen = await isDialogCloseButtonVisible(page);
	if (dialogIsStillOpen) {
		await closeDialog(page);
	}

	await page.waitForTimeout(2 * 1000);

	if (!cacheMessagesToQueue) {
		ux.action.stop(`✅ @${user}'s account has been unfollowed!`);
	}
}

export async function unfollowUser(
	page: Page,
	{
		user,
		keepFavorites = false,
		cacheMessagesToQueue = false,
	}: { user: string; keepFavorites: boolean; cacheMessagesToQueue: boolean },
) {
	await goToUserProfile(page, {
		userToSearch: user,
		logMessages: !cacheMessagesToQueue,
	});
	await unfollowCurrentProfile(page, {
		user,
		keepFavorites,
		cacheMessagesToQueue,
	});
}
