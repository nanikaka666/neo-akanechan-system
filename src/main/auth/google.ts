import { shell, WebContents } from "electron";
import http from "node:http";
import {
  OAuth2ClientOptions,
  OAuth2Client,
  GenerateAuthUrlOpts,
  CodeChallengeMethod,
  Credentials,
} from "google-auth-library";
import { URL } from "node:url";
import destroyer from "server-destroy";
// import { getCredentials, saveCredentials, store } from "./storage";
import credentialsJson from "./oauthClientCredentials.json";
import { StorageService } from "../storage/storageService";
import { getStorageService } from "../storage";
// import { webContentsSendWrapper } from "../../ipcEvent";

let authClient: OAuth2Client | undefined;

export function isUserAuthorized() {
  return authClient !== undefined;
}

/**
 * If the credentials stored, retrieve it.
 */
export async function setupAuth() {
  //   const credentials = getCredentials();
  //   if (credentials) {
  //     authClient = new OAuth2Client(OAUTH_CLIENT_OPTIONS);
  //     authClient.setCredentials(credentials);
  //     if (isExpired(credentials)) {
  //       console.log("Refresh Access Token explicitly.");
  //       try {
  //         const res = await authClient.refreshAccessToken();
  //         saveCredentials(res.credentials);
  //         console.log("After refresh token client: ", authClient);
  //       } catch (e: unknown) {
  //         console.log(e);
  //       }
  //     }
  //   }
}

const PORT = 49999;
const OAUTH_CLIENT_OPTIONS: OAuth2ClientOptions = {
  client_id: credentialsJson.clientId,
  client_secret: credentialsJson.clientSecret,
  redirectUri: `http://127.0.0.1:${PORT}/auth/receive`,
};

/**
 * Begin auth flow.
 */
export async function doAuthFlow(w: WebContents): Promise<boolean> {
  // if local scope possess client instance, auth flow already finished.
  if (authClient) {
    return true;
  }

  // if the auth credentials already stored, return immediately OAuth2Client.
  //   const credentials = getCredentials();
  //   if (credentials) {
  //     console.log("NOw", new Date().getTime());
  //     const client = new OAuth2Client(OAUTH_CLIENT_OPTIONS);
  //     client.setCredentials(credentials);
  //     authClient = client;
  //     return authClient;
  //   }

  const client = new OAuth2Client(OAUTH_CLIENT_OPTIONS);

  const codeVerifierResult = await client.generateCodeVerifierAsync();
  console.log(codeVerifierResult);

  const state = crypto.randomUUID();
  console.log(`state: ${state}`);

  const genOptions: GenerateAuthUrlOpts = {
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube"],
    state: state,
    code_challenge_method: CodeChallengeMethod.S256,
    code_challenge: codeVerifierResult.codeChallenge,
  };

  const authUrl = client.generateAuthUrl(genOptions);
  console.log(`authUrl: ${authUrl}`);

  return new Promise((resolve, reject) => {
    const server = http
      .createServer(async (request, response) => {
        try {
          if (request.url === undefined) {
            reject(new Error("url not found."));
          } else if (request.url.indexOf("/auth/receive") > -1) {
            const q = new URL(request.url, `http://127.0.0.1:${PORT}`).searchParams;
            console.log(`query: `, q);

            const res = {
              state: q.get("state"),
              code: q.get("code"),
              scope: q.get("scope"),
            };

            console.log(res);

            // check state
            if (state !== res.state) {
              throw new Error(`State doesn't match.`);
            }

            const token = await client.getToken({
              code: res.code!,
              codeVerifier: codeVerifierResult.codeVerifier,
            });

            console.log(token);

            // store to storage
            getStorageService().registerAuthCredentials(token.tokens);

            // tell to renderer
            // webContentsSendWrapper(w, "tellCredentials", token.tokens);

            // set credentials to OAuth2Client
            client.setCredentials(token.tokens);

            // Return 200 OK to authentication server on Google.
            response.end(`Authentication successful!!`);
            server.destroy();

            // todo: mainWindow.focus for convenient

            authClient = client;
            resolve(true);
          } else {
            reject(new Error("url pattern is unexpected."));
          }
        } catch (e: unknown) {
          // Return 200 OK to authentication server on Google.
          response.end(`Authentication failure!!`);
          server.destroy();
          reject(e);
        }
      })
      .listen(PORT, () => {
        shell.openExternal(authUrl);
      });
    destroyer(server);
  });
}

export async function revokeCredentials(w: WebContents) {
  if (!authClient) {
    return true;
  }
  try {
    const res = await authClient.revokeCredentials();
    if (res.status !== 200) {
      console.log(res);
      return false;
    }
    authClient = undefined;
    // store.delete("credentials");
    // webContentsSendWrapper(w, "tellCredentials", undefined);
    return true;
  } catch (e: unknown) {
    console.log(e);
  }
}

export async function getAccessToken() {
  if (!authClient) {
    return undefined;
  }
  return (await authClient.getAccessToken()).token;
}
