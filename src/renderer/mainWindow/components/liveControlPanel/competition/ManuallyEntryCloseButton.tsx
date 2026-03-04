import { useState } from "react";

export function ManuallyEntryCloseButton() {
  const [disabled, setDisabled] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestManuallyEntryClose().then(() => {
          setDisabled((_) => false);
        });
      }}
    >
      今すぐ回答を締め切る
    </button>
  );
}
