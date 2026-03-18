import { useButton } from "../../hooks/useButton";

export function ManuallyEntryCloseButton() {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.requestManuallyEntryClose().then(() => {
          enable();
        });
      }}
    >
      今すぐ回答を締め切る
    </button>
  );
}
