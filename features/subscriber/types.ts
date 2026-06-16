export type SubscribeResult =
  | { status: "subscribed" }
  | { status: "already_subscribed" }
  | { status: "invalid_email" }
  | { status: "rate_limited" }
  | { status: "error"; message: string };
