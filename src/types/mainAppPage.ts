import { YoutubeLive } from "./youtubeLive";
import { Channel } from "./youtubeChannel";
import { LiveLaunchProperties } from "./liveLaunchProperties";

/**
 * AuthPage
 *
 * User need to agree at OAuth flow to get tokens.
 */
export interface AuthPage {
  type: "auth";
}

/**
 * LiveSelectionPage
 *
 * User selects a live which they has to be attached to this app.
 */
export interface LiveSelectionPage {
  type: "liveSelection";
  channel: Channel;
  lives: YoutubeLive[];
}

/**
 * LiveStandByPage
 *
 * aka this is cushion page before start LiveControlPanel.
 * During be in this page, all emitters doesn't start data fetching.
 * The purpose of this cushion is taking time which collaborates with OBS.
 */
export interface LiveStandByPage {
  type: "liveStandBy";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * InLivePage
 *
 * This app runs LiveControlPanel and overlay window.
 */
export interface InLivePage {
  type: "inLive";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * The page status in where user is.
 */
export type MainAppPage = AuthPage | LiveSelectionPage | LiveStandByPage | InLivePage;
