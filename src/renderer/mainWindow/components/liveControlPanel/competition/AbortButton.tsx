import { useButton } from "../../../hooks/useButton";

export function AbortButton() {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.competition.requestAbortCompetition().then(() => {
          enable();
        });
      }}
      disabled={disabled}
    >
      コンペを中止する
    </button>
  );
}
