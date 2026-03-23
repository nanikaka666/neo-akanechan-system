import { useState } from "react";
import { useButton } from "../../hooks/useButton";

export function OpenOverlayWindowForm() {
  const [isChecked, setIsChecked] = useState(false);
  const [disabled, disable, enable] = useButton();

  return (
    <div>
      <label>
        プレビュー
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        ></input>
      </label>
      <button
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          disable();
          if (isChecked) {
            window.ipcApi.mainWindow.createOverlayWindow.requestCreateOverlayWindowForPreview();
          } else {
            window.ipcApi.mainWindow.createOverlayWindow.requestCreateOverlayWindow();
          }
        }}
      >
        オーバーレイを開く
      </button>
    </div>
  );
}
