import { useState } from "react";

export function UnfocusButton() {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDisabled((_) => true);
        window.ipcApi.requestUpdateFocus(undefined);
      }}
    >
      フォーカスを外す
    </button>
  );
}
