import { yesNoDialogOnMainWindow } from "../../../dialog";
import { getLiveManager } from "../../../liveManager";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForCompetition() {
  IpcMainWrapper.handle("openCompetition", (_, question, options, acceptTimeMinutes) => {
    getLiveManager().actionOpenCompetition(question, options, acceptTimeMinutes);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("abortCompetition", async () => {
    const res = await yesNoDialogOnMainWindow(`本当にコンペを終了しますか？`);
    if (!res) {
      return false;
    }
    getLiveManager().actionAbortCompetition();
    return true;
  });

  IpcMainWrapper.handle("answerDecision", async (_, answer, optionStr) => {
    const res = await yesNoDialogOnMainWindow(
      `コンペの正解を確定します`,
      `${answer}: ${optionStr}`,
    );
    if (!res) {
      return false;
    }
    getLiveManager().actionAnswerDecision(answer);
    return true;
  });

  IpcMainWrapper.handle("manuallyEntryClose", async () => {
    const res = await yesNoDialogOnMainWindow(`コンペの参加を締め切ります`);
    if (!res) {
      return false;
    }
    getLiveManager().actionManuallyEntryClose();
    return true;
  });
}
