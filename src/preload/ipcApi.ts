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
      auth: {
        requestStartAuthFlow: Invoke<"startAuthFlow">;
        requestAccountDisconnect: Invoke<"accountDisconnect">;
      };
      userSettings: {
        requestUserSettings: Invoke<"getUserSettings">;
        requestSaveUserSettings: Invoke<"saveUserSettings">;
        requestCheckHavingDifferenceAmongUserSettings: Invoke<"hasDifferenceAmongUserSettings">;
        registerUpdatedUserSettingsListener: Listen<"tellUpdatedUserSettings">;
      };
      ranking: {
        registerRankingsListener: Listen<"tellRankings">;
        requestShowRanking: Invoke<"showRanking">;
        registerIsShownRankingListener: Listen<"tellIsShownRanking">;
        requestHideRanking: Invoke<"hideRanking">;
      };
      competition: {
        requestOpenCompetition: Invoke<"openCompetition">;
        requestAbortCompetition: Invoke<"abortCompetition">;
        requestAnswerDecision: Invoke<"answerDecision">;
        requestManuallyEntryClose: Invoke<"manuallyEntryClose">;
      };
      commentViewer: {
        registerChatsListener: Listen<"tellChats">;
        registerMembershipsAndGiftsListener: Listen<"tellMembershipsAndGifts">;
        requestAddStock: Invoke<"addStock">;
        requestRemoveStock: Invoke<"removeStock">;
        requestUpdateFocus: Invoke<"updateFocus">;
      };
      goal: {
        registerAllGoalStatus: Listen<"tellAllGoalStatus">;
      };
      mainAppPage: {
        requestInitialMainAppPage: Invoke<"getInitialMainAppPage">;
        registerMainAppPage: Listen<"tellMainAppPage">;
        requestTransitToLiveStandBy: Invoke<"transitToLiveStandBy">;
        requestTransitToLiveStandByByVideoId: Invoke<"transitToLiveStandByByVideoId">;
        requestStartLive: Invoke<"startLive">;
        requestQuitLive: Invoke<"quitLive">;
      };
      createOverlayWindow: {
        requestCreateOverlayWindow: Invoke<"createOverlayWindow">;
        requestCreateOverlayWindowForPreview: Invoke<"createOverlayWindowForPreview">;
      };
      requestStartDataFetch: Invoke<"startDataFetch">;
      requestLiveLaunchProperties: Invoke<"getLiveLaunchProperties">;
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
      auth: {
        requestStartAuthFlow: () => IpcRendererWrapper.invoke("startAuthFlow"),
        requestAccountDisconnect: () => IpcRendererWrapper.invoke("accountDisconnect"),
      },
      userSettings: {
        requestUserSettings: () => IpcRendererWrapper.invoke("getUserSettings"),
        requestSaveUserSettings: (userSettings) =>
          IpcRendererWrapper.invoke("saveUserSettings", userSettings),
        requestCheckHavingDifferenceAmongUserSettings: (settingsA, settingsB) =>
          IpcRendererWrapper.invoke("hasDifferenceAmongUserSettings", settingsA, settingsB),
        registerUpdatedUserSettingsListener: (callback) =>
          IpcRendererWrapper.on("tellUpdatedUserSettings", callback),
      },
      ranking: {
        registerRankingsListener: (callback) => IpcRendererWrapper.on("tellRankings", callback),
        requestShowRanking: (ranking) => IpcRendererWrapper.invoke("showRanking", ranking),
        registerIsShownRankingListener: (callback) =>
          IpcRendererWrapper.on("tellIsShownRanking", callback),
        requestHideRanking: () => IpcRendererWrapper.invoke("hideRanking"),
      },
      competition: {
        requestOpenCompetition: (question, options, acceptTimeMinutes) =>
          IpcRendererWrapper.invoke("openCompetition", question, options, acceptTimeMinutes),
        requestAbortCompetition: () => IpcRendererWrapper.invoke("abortCompetition"),
        requestAnswerDecision: (answer, optionStr) =>
          IpcRendererWrapper.invoke("answerDecision", answer, optionStr),
        requestManuallyEntryClose: () => IpcRendererWrapper.invoke("manuallyEntryClose"),
      },
      commentViewer: {
        registerChatsListener: (callback) => IpcRendererWrapper.on("tellChats", callback),
        registerMembershipsAndGiftsListener: (callback) =>
          IpcRendererWrapper.on("tellMembershipsAndGifts", callback),
        requestAddStock: (stock) => IpcRendererWrapper.invoke("addStock", stock),
        requestRemoveStock: (stock) => IpcRendererWrapper.invoke("removeStock", stock),
        requestUpdateFocus: (focus) => IpcRendererWrapper.invoke("updateFocus", focus),
      },
      goal: {
        registerAllGoalStatus: (callback) => IpcRendererWrapper.on("tellAllGoalStatus", callback),
      },
      mainAppPage: {
        requestInitialMainAppPage: () => IpcRendererWrapper.invoke("getInitialMainAppPage"),
        registerMainAppPage: (callback) => IpcRendererWrapper.on("tellMainAppPage", callback),
        requestTransitToLiveStandBy: (channel, live) =>
          IpcRendererWrapper.invoke("transitToLiveStandBy", channel, live),
        requestTransitToLiveStandByByVideoId: (inputVideoId) =>
          IpcRendererWrapper.invoke("transitToLiveStandByByVideoId", inputVideoId),
        requestStartLive: () => IpcRendererWrapper.invoke("startLive"),
        requestQuitLive: (liveLaunchProperties) =>
          IpcRendererWrapper.invoke("quitLive", liveLaunchProperties),
      },
      createOverlayWindow: {
        requestCreateOverlayWindow: () => IpcRendererWrapper.invoke("createOverlayWindow"),
        requestCreateOverlayWindowForPreview: () =>
          IpcRendererWrapper.invoke("createOverlayWindowForPreview"),
      },
      requestStartDataFetch: () => IpcRendererWrapper.invoke("startDataFetch"),
      requestLiveLaunchProperties: () => IpcRendererWrapper.invoke("getLiveLaunchProperties"),
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
