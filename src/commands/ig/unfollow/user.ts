import { Args, Command, Flags } from '@oclif/core';
import type { Page } from 'playwright';
import { chromium } from 'playwright';
import { flags } from '../../../flags';
import { navigation } from '../../../utils';
import { guards } from '../../../guards';
import type {
	Credentials,
	OptionalCredentials,
} from '../../../types/credentials';
import { LoginError } from '../../../utils/instagram';

const { save: _save, ...igFlags } = flags.ig;

export default class Followers extends Command {
	static description =
		'Should unfollow the specified @user from the account provided.';

	static examples = [
		`$ digu-cli ig unfollow user <@userToUnfollow> (this way the CLI will ask relevant info it may need)`,
		`$ digu-cli ig unfollow user <@userToUnfollow> -u <username> -p <password>`,
	];

	static args = {
		userToUnfollow: Args.string({
			name: 'user to unfollow',
			required: true,
			description: 'the user tag that must be unfollowed',
		}),
	};

	static flags = {
		...igFlags,
		keepFavorites: Flags.boolean({
			default: false,
			required: false,
			aliases: ['keep-favorites'],
		}),
	};

	async ensureCredentials(
		credentials: OptionalCredentials,
	): Promise<Credentials> {
		const enforcedCredentials = await guards.credentials(credentials);
		return enforcedCredentials;
	}

	async login(page: Page, credentials: Credentials): Promise<void> {
		try {
			await navigation.instagram.login(page, credentials);
		} catch (error_) {
			const error = error_ as LoginError;
			this.log(`❌ Error: ${error.message}`);
			if (error.type === 'login_error') {
				throw error;
			}
		}
	}

	async unfollowUser(
		page: Page,
		{ user, keepFavorites = false }: { user: string; keepFavorites: boolean },
	): Promise<void> {
		await navigation.instagram.unfollowUser(page, {
			user,
			keepFavorites,
			cacheMessagesToQueue: false,
		});
	}

	async run(): Promise<void> {
		try {
			const { args, flags } = await this.parse(Followers);
			const { viewBrowser, keepFavorites } = flags;

			const credentials = await this.ensureCredentials(flags);

			const browser = await chromium.launch({ headless: !viewBrowser });
			const page = await browser.newPage();

			await this.login(page, credentials);
			await this.unfollowUser(page, {
				user: args.userToUnfollow,
				keepFavorites,
			});

			await browser.close();
		} catch (error) {
			console.error(error);
		}
	}
}
