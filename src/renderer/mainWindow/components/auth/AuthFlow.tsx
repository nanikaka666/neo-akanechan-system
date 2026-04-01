import { useButton } from "../../hooks/useButton";

export function AuthFlow() {
  const [disabled, disable, enable] = useButton();

  return (
    <div className="auth-flow-container ">
      <h1>Youtubeアカウントと連携</h1>
      <div className="description">
        Youtubeチャンネルを開設しているGoogleアカウントで連携してください。
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          disable();
          window.ipcApi.mainWindow.auth.requestStartAuthFlow().then(() => enable());
        }}
        disabled={disabled}
      >
        連携する
      </button>
    </div>
  );
}
