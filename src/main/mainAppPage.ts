import { WebContentsWrapper } from "./webContentsWrapper";
import { getWindowManager } from "./window";
import { AuthPage, LiveSelectionPage } from "../types/mainAppPage";
import { isUserAuthorized } from "./auth/google";
import { YoutubeApiService } from "./youtubeApi/service";

export const MainAppPageSwitcher = {
  auth: () => {
    const maybeWebContents = getWindowManager().getMainWindowWebContents();
    if (maybeWebContents === undefined) {
      return;
    }
    WebContentsWrapper.send(maybeWebContents, "tellMainAppPage", { type: "auth" });
  },
  /**
   * This function takes users on oauth page when account has no youtube channel.
   */
  liveSelection: async () => {
    const maybeWebContents = getWindowManager().getMainWindowWebContents();
    if (maybeWebContents === undefined) {
      return;
    }

    const maybeParamsOfLiveSelectionPage = await getChannelAndLives();

    if (maybeParamsOfLiveSelectionPage === undefined) {
      MainAppPageSwitcher.auth();
      return;
    }

    WebContentsWrapper.send(maybeWebContents, "tellMainAppPage", {
      type: "liveSelection",
      ...maybeParamsOfLiveSelectionPage,
    });
  },
  liveStandBy: () => {
    const maybeWebContents = getWindowManager().getMainWindowWebContents();
    if (maybeWebContents === undefined) {
      return;
    }
    WebContentsWrapper.send(maybeWebContents, "tellMainAppPage", { type: "liveStandBy" });
  },
  liveControlPanel: () => {
    const maybeWebContents = getWindowManager().getMainWindowWebContents();
    if (maybeWebContents === undefined) {
      return;
    }
    WebContentsWrapper.send(maybeWebContents, "tellMainAppPage", { type: "liveControlPanel" });
  },
};

export async function getInitialMainAppPage(): Promise<AuthPage | LiveSelectionPage> {
  if (!isUserAuthorized()) {
    return { type: "auth" };
  }

  const maybeParamsOfLiveSelectionPage = await getChannelAndLives();

  // Find an account that has no youtube channel, then land on oauth page.
  if (maybeParamsOfLiveSelectionPage === undefined) {
    return { type: "auth" };
  }

  return {
    type: "liveSelection",
    ...maybeParamsOfLiveSelectionPage,
  };
}

async function getChannelAndLives() {
  const maybeChannel = await YoutubeApiService.getChannelOfMine();
  if (maybeChannel === undefined) {
    return undefined;
  }
  return { channel: maybeChannel, lives: await YoutubeApiService.getNotFinishedLivesOfMine() };
}
