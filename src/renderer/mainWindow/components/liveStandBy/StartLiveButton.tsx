import { useState } from "react";

export function StartLiveButton() {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestStartLive();
      }}
      disabled={disabled}
    >
      ライブを開始する
    </button>
  );
}
