import { IpcRendererEvent } from "electron";
import { IpcEvent } from "../types/ipcEvent";
import { IpcRendererWrapper } from "./ipcRendererWrapper";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends IpcApi {}
}

type Invoke<K extends keyof IpcEvent> = (
  ...args: Parameters<IpcEvent[K]>
) => Promise<ReturnType<IpcEvent[K]>>;

type Listen<K extends keyof IpcEvent> = (
  callback: (e: IpcRendererEvent, ...args: Parameters<IpcEvent[K]>) => void,
) => () => void;

/**
 * Api interface exposed to Renderer process.
 */
export interface IpcApi {
  ipcApi: {
    mainWindow: {
      requestOpenOverlay: Invoke<"startOverlayWithUserConfirmation">;
      requestOpenOverlayWithVideoId: Invoke<"startOverlayWithUserConfirmationByVideoId">;
      requestUserSettings: Invoke<"getUserSettings">;
      requestSaveUserSettings: Invoke<"saveUserSettings">;
      requestCheckHavingDifferenceAmongUserSettings: Invoke<"hasDifferenceAmongUserSettings">;
      registerUpdatedUserSettingsListener: Listen<"tellUpdatedUserSettings">;
      requestStartDataFetch: Invoke<"startDataFetch">;
      registerMembershipsAndGiftsListener: Listen<"tellMembershipsAndGifts">;
      requestAddStock: Invoke<"addStock">;
      requestRemoveStock: Invoke<"removeStock">;
      requestInitialMainAppPage: Invoke<"getInitialMainAppPage">;
      registerMainAppPage: Listen<"tellMainAppPage">;
      requestStartLive: Invoke<"startLive">;
      requestQuitLive: Invoke<"quitLive">;
      requestUpdateFocus: Invoke<"updateFocus">;
      registerChatsListener: Listen<"tellChats">;
      requestStartAuthFlow: Invoke<"startAuthFlow">;
      registerRankingsListener: Listen<"tellRankings">;
      registerAllGoalStatus: Listen<"tellAllGoalStatus">;
      requestShowRanking: Invoke<"showRanking">;
      registerIsShownRankingListener: Listen<"tellIsShownRanking">;
      requestHideRanking: Invoke<"hideRanking">;
      requestOpenCompetition: Invoke<"openCompetition">;
      requestAbortCompetition: Invoke<"abortCompetition">;
      requestAnswerDecision: Invoke<"answerDecision">;
      requestManuallyEntryClose: Invoke<"manuallyEntryClose">;
      requestLiveLaunchProperties: Invoke<"getLiveLaunchProperties">;
      requestAccountDisconnect: Invoke<"accountDisconnect">;
    };

    overlay: {
      registerAmountOfPoint: Listen<"tellAmountOfPoint">;
      registerOverlayEvent: Listen<"tellOverlayEvent">;
      registerChatLogListener: Listen<"tellChatLog">;
      registerFocusItemListener: Listen<"tellFocusViewItem">;
      registerRankingViewListener: Listen<"tellRankingView">;
    };

    common: {
      registerLiveStatisticsListener: Listen<"tellLiveStatistics">;
      registerLiveSettingsListener: Listen<"tellLiveSettings">;
      registerCompetitionStatusListener: Listen<"tellCompetitionStatus">;
      requestSyncLiveSettings: Invoke<"requestSyncLiveSettings">;
    };
  };
}

export const IpcApi: IpcApi = {
  ipcApi: {
    mainWindow: {
      requestOpenOverlay: (channel, live) =>
        IpcRendererWrapper.invoke("startOverlayWithUserConfirmation", channel, live),
      requestOpenOverlayWithVideoId: (inputVideoId) =>
        IpcRendererWrapper.invoke("startOverlayWithUserConfirmationByVideoId", inputVideoId),
      requestUserSettings: () => IpcRendererWrapper.invoke("getUserSettings"),
      requestSaveUserSettings: (userSettings) =>
        IpcRendererWrapper.invoke("saveUserSettings", userSettings),
      requestCheckHavingDifferenceAmongUserSettings: (settingsA, settingsB) =>
        IpcRendererWrapper.invoke("hasDifferenceAmongUserSettings", settingsA, settingsB),
      registerUpdatedUserSettingsListener: (callback) =>
        IpcRendererWrapper.on("tellUpdatedUserSettings", callback),
      requestStartDataFetch: () => IpcRendererWrapper.invoke("startDataFetch"),
      registerMembershipsAndGiftsListener: (callback) =>
        IpcRendererWrapper.on("tellMembershipsAndGifts", callback),
      requestAddStock: (stock) => IpcRendererWrapper.invoke("addStock", stock),
      requestRemoveStock: (stock) => IpcRendererWrapper.invoke("removeStock", stock),
      requestInitialMainAppPage: () => IpcRendererWrapper.invoke("getInitialMainAppPage"),
      registerMainAppPage: (callback) => IpcRendererWrapper.on("tellMainAppPage", callback),
      requestStartLive: () => IpcRendererWrapper.invoke("startLive"),
      requestQuitLive: (liveLaunchProperties) =>
        IpcRendererWrapper.invoke("quitLive", liveLaunchProperties),
      requestUpdateFocus: (focus) => IpcRendererWrapper.invoke("updateFocus", focus),
      registerChatsListener: (callback) => IpcRendererWrapper.on("tellChats", callback),
      requestStartAuthFlow: () => IpcRendererWrapper.invoke("startAuthFlow"),
      registerRankingsListener: (callback) => IpcRendererWrapper.on("tellRankings", callback),
      registerAllGoalStatus: (callback) => IpcRendererWrapper.on("tellAllGoalStatus", callback),
      requestShowRanking: (ranking) => IpcRendererWrapper.invoke("showRanking", ranking),
      registerIsShownRankingListener: (callback) =>
        IpcRendererWrapper.on("tellIsShownRanking", callback),
      requestHideRanking: () => IpcRendererWrapper.invoke("hideRanking"),
      requestOpenCompetition: (question, options, acceptTimeMinutes) =>
        IpcRendererWrapper.invoke("openCompetition", question, options, acceptTimeMinutes),
      requestAbortCompetition: () => IpcRendererWrapper.invoke("abortCompetition"),
      requestAnswerDecision: (answer, optionStr) =>
        IpcRendererWrapper.invoke("answerDecision", answer, optionStr),
      requestManuallyEntryClose: () => IpcRendererWrapper.invoke("manuallyEntryClose"),
      requestLiveLaunchProperties: () => IpcRendererWrapper.invoke("getLiveLaunchProperties"),
      requestAccountDisconnect: () => IpcRendererWrapper.invoke("accountDisconnect"),
    },

    overlay: {
      registerAmountOfPoint: (callback) => IpcRendererWrapper.on("tellAmountOfPoint", callback),
      registerOverlayEvent: (callback) => IpcRendererWrapper.on("tellOverlayEvent", callback),
      registerChatLogListener: (callback) => IpcRendererWrapper.on("tellChatLog", callback),
      registerFocusItemListener: (callback) => IpcRendererWrapper.on("tellFocusViewItem", callback),
      registerRankingViewListener: (callback) => IpcRendererWrapper.on("tellRankingView", callback),
    },

    common: {
      registerLiveStatisticsListener: (callback) =>
        IpcRendererWrapper.on("tellLiveStatistics", callback),
      registerLiveSettingsListener: (callback) =>
        IpcRendererWrapper.on("tellLiveSettings", callback),
      registerCompetitionStatusListener: (callback) =>
        IpcRendererWrapper.on("tellCompetitionStatus", callback),
      requestSyncLiveSettings: () => IpcRendererWrapper.invoke("requestSyncLiveSettings"),
    },
  },
};
