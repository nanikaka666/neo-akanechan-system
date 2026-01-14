import { Channel, LiveLaunchProperties, YoutubeLive } from "./ipcEvent";

/**
 * User doesn't authorized.
 */
export interface AuthPage {
  type: "auth";
}

/**
 * Represents page which user selects a live from registered channels.
 */
export interface LiveSelectionPage {
  type: "liveSelection";
  channel: Channel;
  lives: YoutubeLive[];
}

/**
 * Represents page which user selected a live and does preparing.
 *
 * in this status, the emitters are not started.
 */
export interface LiveStandByPage {
  type: "liveStandBy";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * Reperesents page which user start streaming.
 */
export interface InLivePage {
  type: "inLive";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * Represents MainApp status where user is in.
 */
export type MainAppPage = AuthPage | LiveSelectionPage | LiveStandByPage | InLivePage;
