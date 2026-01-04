import { useState } from "react";

export function AuthFlow() {
  const [disable, setDisable] = useState(false);

  return (
    <div>
      Auth Flow
      <button
        onClick={(e) => {
          e.preventDefault();
          window.ipcApi.requestStartAuthFlow().then((res) => console.log(`Start auth: ${res}`));
          setDisable(true);
        }}
        disabled={disable}
      >
        Start Auth
      </button>
    </div>
  );
}
