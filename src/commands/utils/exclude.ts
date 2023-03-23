import { join } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { Args, Command, Flags, ux } from '@oclif/core';

export default class Following extends Command {
	static description = 'Should exclude a list from another one';

	static examples = [
		'$ digu-cli utils exclude <exclusion_list> -f <source_list>',
	];

	static args = {
		exclusionFile: Args.string({
			name: 'exclusion list',
			required: true,
			description: 'List in json format used to remove from --from list',
		}),
	};

	static flags = {
		fromFile: Flags.string({
			char: 'f',
			name: 'from',
			description: 'Source list to modify',
			required: true,
			aliases: ['f', 'from'],
		}),

		outputFile: Flags.string({
			char: 'o',
			name: 'output',
			description: 'Output filename',
			required: false,
			aliases: ['o', 'output'],
		}),
	};

	async run(): Promise<void> {
		const { args, flags } = await this.parse(Following);
		const { exclusionFile } = args;
		const { fromFile: sourceFile, outputFile } = flags;

		const exclusionPath = join(process.cwd(), exclusionFile);
		const sourcePath = join(process.cwd(), sourceFile);

		if (!existsSync(exclusionPath) || !existsSync(sourcePath)) {
			this.log(`
Some files doesn't exists:
    exclusion list exists: ${existsSync(exclusionPath)} 
    from list exists: ${existsSync(sourcePath)} 
        `);
			return;
		}

		ux.action.start('Load exclusion list');

		const exclusionFileBuffer = readFileSync(exclusionPath);
		const exclusionList = JSON.parse(
			exclusionFileBuffer.toLocaleString(),
		) as string[];

		ux.action.stop('✅ loaded!');

		ux.action.start('Load from list');

		const sourceBuffer = readFileSync(sourcePath);
		const sourceList = JSON.parse(sourceBuffer.toLocaleString()) as string[];

		ux.action.stop('✅ loaded!');

		ux.action.start("Excluding items from the 'from' list");

		const excluded = [];

		for (const item of sourceList) {
			if (!exclusionList.includes(item)) {
				excluded.push(item);
			}
		}

		ux.action.stop(`✅ ${sourceList.length - excluded.length} items excluded!`);

		ux.action.start(`Saving results (${excluded.length})!`);

		let filename = `${sourceFile.replace('.json', ' excluded.json')}`;
		if (outputFile) {
			filename = outputFile;
			if (!filename.includes('.json')) {
				filename += '.json';
			}
		}

		const json = JSON.stringify(excluded, null, 2);
		writeFileSync(filename, json, 'utf-8');

		ux.action.stop(`✅ results saved at ${filename}!`);
	}
}
