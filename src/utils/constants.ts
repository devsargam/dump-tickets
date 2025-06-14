export const SECONDS_IN_HOUR = 60 * 60;
export const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
export const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;

export const LINEAR = {
  OAUTH_ID: process.env.NEXT_PUBLIC_LINEAR_OAUTH_ID,
  OAUTH_URL: "https://linear.app/oauth/authorize",
  TOKEN_URL: "https://api.linear.app/oauth/token",
  SCOPES: ["admin", "write"],
  NEW_TOKEN_URL: "https://linear.app/settings/api",
  TOKEN_SECTION_HEADER: "Personal API keys",
  GRAPHQL_ENDPOINT: "https://api.linear.app/graphql",
  IP_ORIGINS: [
    "35.231.147.226",
    "35.243.134.228",
    "34.38.87.206",
    "34.140.253.14",
  ],
  STORAGE_KEY: "linear-context",
  APP_URL: "https://linear.app",
  GITHUB_LABEL: "linear",
  GITHUB_LABEL_COLOR: "#4941DA",
  WEBHOOK_EVENTS: ["Issue", "Comment", "IssueLabel"],
  TICKET_STATES: {
    todo: "Todo",
    done: "Done",
    canceled: "Canceled",
  },
  PUBLIC_QUERY_HEADERS: {
    "public-file-urls-expire-in": SECONDS_IN_YEAR.toString(),
  },
};
