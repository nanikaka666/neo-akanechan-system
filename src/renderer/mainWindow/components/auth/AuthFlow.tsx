import { useButton } from "../hooks/useButton";

export function AuthFlow() {
  const [disabled, disable, enable] = useButton();

  return (
    <div>
      Auth Flow
      <button
        onClick={(e) => {
          e.preventDefault();
          disable();
          window.ipcApi.mainWindow.requestStartAuthFlow().then(() => enable());
        }}
        disabled={disabled}
      >
        Start Auth
      </button>
    </div>
  );
}
