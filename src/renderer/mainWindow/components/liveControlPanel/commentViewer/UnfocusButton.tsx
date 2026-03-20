import { useButton } from "../../../hooks/useButton";

export function UnfocusButton() {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.mainWindow.requestUpdateFocus(undefined).then(() => enable());
      }}
    >
      フォーカスを外す
    </button>
  );
}
