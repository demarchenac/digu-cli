import { ux } from "@oclif/core";
import type { Credentials, OptionalCredentials } from "../types/credentials";

export async function ensureCredentials(
  credentials: OptionalCredentials
): Promise<Credentials> {
  let { user, password } = credentials;

  if (!user) {
    user = await ux.prompt("Account username");
  }

  if (!password) {
    password = await ux.prompt("Account password", { type: "hide" });
  }

  return { user, password };
}
