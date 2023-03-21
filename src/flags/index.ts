import { Flags } from "@oclif/core";

export const flags = {
  list: {
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
  },
};
