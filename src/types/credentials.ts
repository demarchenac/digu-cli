type optionalString = string | undefined;

export interface OptionalCredentials {
  user: optionalString;
  password: optionalString;
}

export interface Credentials {
  user: string;
  password: string;
}
