import { useState } from "react";

export function AbortButton() {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestAbortCompetition().then(() => {
          setDisabled((_) => false);
        });
      }}
      disabled={disabled}
    >
      コンペを中止する
    </button>
  );
}
