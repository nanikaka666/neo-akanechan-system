import { useState } from "react";

export function AuthFlow() {
  const [disable, setDisable] = useState(false);

  return (
    <div>
      Auth Flow
      <button
        onClick={(e) => {
          e.preventDefault();
          setDisable(true);
          window.ipcApi.requestStartAuthFlow().then(() => setDisable((_) => false));
        }}
        disabled={disable}
      >
        Start Auth
      </button>
    </div>
  );
}
