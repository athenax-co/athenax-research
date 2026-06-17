export type SubscribeResult =
  | { status: "subscribed" }
  | { status: "already_subscribed" }
  | { status: "invalid_email" }
  | { status: "rate_limited" }
  | { status: "error"; message: string };

export type UnsubscribeResult =
  | { status: "unsubscribed" }
  | { status: "invalid_token" }
  | { status: "error"; message: string };
