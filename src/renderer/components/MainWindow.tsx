import { ChangeEvent, MouseEvent, useState } from "react";
import { ChannelId } from "youtube-live-scraper";

export function MainWindow() {
  const [input, setInput] = useState("");

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput((_) => e.target.value);
  }

  async function onClick(e: MouseEvent) {
    e.preventDefault();
    console.log(`Submitted! ${input}`);

    try {
      const res = await window.ipcApi.requestChannelTitleMatchTo(new ChannelId(input));
      console.log(`Returned: ${res ? res.title : undefined}`);
    } catch {
      console.log("damedeshita");
    }
    setInput((_) => "");
  }

  return (
    <div>
      Input ChannelId: <input type="text" value={input} onChange={onChange}></input>
      <button onClick={onClick} disabled={input === ""}>
        Submit
      </button>
    </div>
  );
}
