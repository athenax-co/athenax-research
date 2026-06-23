import posthog from "posthog-js";
import "posthog-js/dist/dead-clicks-autocapture";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  capture_pageview: false,
  capture_pageleave: false,
  autocapture: true,
  disable_session_recording: true,
  person_profiles: "identified_only",
  persistence: "localStorage+cookie",
  loaded: (ph) => {
    if (process.env.NODE_ENV === "development") ph.debug();
  },
});
