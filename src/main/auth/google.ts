import { shell } from "electron";
import http from "node:http";
import {
  OAuth2ClientOptions,
  OAuth2Client,
  GenerateAuthUrlOpts,
  CodeChallengeMethod,
} from "google-auth-library";
import { GaxiosError } from "gaxios";
import { URL } from "node:url";
import destroyer from "server-destroy";
import { getStorageService } from "../storage";
import { isDevMode } from "../environment";

let authClient: OAuth2Client | undefined;

export function isUserAuthorized() {
  return authClient !== undefined;
}

/**
 * If the credentials stored, retrieve it.
 */
export async function setupAuth() {
  const credentials = getStorageService().getAuthCredentials();
  if (credentials) {
    authClient = new OAuth2Client(await getOauthClientOptions());
    authClient.setCredentials(credentials);
  }
}

const PORT = 49999;

async function getOauthClientOptions(): Promise<OAuth2ClientOptions> {
  const credentialsJson = isDevMode()
    ? await import("./oauthClientCredentialsDev.json")
    : await import("./oauthClientCredentialsProd.json");

  return {
    client_id: credentialsJson.clientId,
    client_secret: credentialsJson.clientSecret,
    redirectUri: `http://127.0.0.1:${PORT}/auth/receive`,
  };
}

/**
 * Begin auth flow.
 */
export async function doAuthFlow(): Promise<boolean> {
  // if local scope possess client instance, auth flow already finished.
  if (authClient) {
    return true;
  }

  const client = new OAuth2Client(await getOauthClientOptions());

  const codeVerifierResult = await client.generateCodeVerifierAsync();

  const state = crypto.randomUUID();

  const genOptions: GenerateAuthUrlOpts = {
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube"],
    state: state,
    code_challenge_method: CodeChallengeMethod.S256,
    code_challenge: codeVerifierResult.codeChallenge,
  };

  const authUrl = client.generateAuthUrl(genOptions);

  return new Promise((resolve, reject) => {
    const server = http
      .createServer(async (request, response) => {
        try {
          if (request.url === undefined) {
            reject(new Error("url not found."));
          } else if (request.url.indexOf("/auth/receive") > -1) {
            const q = new URL(request.url, `http://127.0.0.1:${PORT}`).searchParams;

            const res = {
              state: q.get("state"),
              code: q.get("code"),
              scope: q.get("scope"),
            };

            // check state
            if (state !== res.state) {
              throw new Error(`State doesn't match.`);
            }

            const token = await client.getToken({
              code: res.code!,
              codeVerifier: codeVerifierResult.codeVerifier,
            });

            // store to storage
            getStorageService().registerAuthCredentials(token.tokens);

            // set credentials to OAuth2Client
            client.setCredentials(token.tokens);

            // Return 200 OK to authentication server on Google.
            response.end(`Authentication successful!!`);
            server.destroy();

            authClient = client;
            resolve(true);
          } else {
            reject(new Error("url pattern is unexpected."));
          }
        } catch (e: unknown) {
          // Return 200 OK to authentication server on Google.
          response.end(`Authentication failure!!`);
          server.destroy();
          console.log(e);
          resolve(false);
        }
      })
      .listen(PORT, () => {
        shell.openExternal(authUrl);
      });
    destroyer(server);
  });
}

export async function revokeCredentials() {
  if (!authClient) {
    return;
  }
  getStorageService().deleteAuthCredentials();
  const res = await authClient.revokeCredentials();
  if (res.status !== 200) {
    throw new Error(`Revoke credentials failed. ${await res.json()}`);
  }
  authClient = undefined;
  return;
}

/**
 * Get Access Token.
 *
 * It is valid in at least 5 minutes.
 */
export async function getAccessToken() {
  if (!authClient) {
    throw new Error("Auth Client not initialized.");
  }
  try {
    const res = (await authClient.getAccessToken()).token;
    if (!res) {
      throw new Error("Access Token not available.");
    }
    return res;
  } catch (e: unknown) {
    // Note: A oauth client which be in test mode has reflesh tokens with expire term.
    // if used expired reflesh token then it looks like return GaxiosError with 400 status code.
    // to handle such cases, call revoke function and restart auth flow.
    if (e instanceof GaxiosError && e.status === 400) {
      await revokeCredentials();
    }
    throw e;
  }
}
