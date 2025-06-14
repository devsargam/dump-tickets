import { LINEAR } from "./constants";

export const getLinearAuthURL = (verificationCode: string): string => {
  // Specify OAuth app and scopes
  console.log(window.location.origin);
  const params = {
    client_id: LINEAR.OAUTH_ID,
    redirect_uri: window.location.origin,
    scope: LINEAR.SCOPES.join(","),
    state: verificationCode,
    response_type: "code",
    prompt: "consent",
  };

  // Combine params in a URL-friendly string
  const authURL = Object.keys(params).reduce(
    // @ts-ignore
    (url, param, i) => `${url}${i == 0 ? "?" : "&"}${param}=${params[param]}`,
    LINEAR.OAUTH_URL
  );

  return authURL;
};

export const exchangeLinearToken = async (
  refreshToken: string
): Promise<{ access_token?: string }> => {
  const redirectURI = window.location.origin;

  const response = await fetch("/api/linear/token", {
    method: "POST",
    body: JSON.stringify({ refreshToken, redirectURI }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};
