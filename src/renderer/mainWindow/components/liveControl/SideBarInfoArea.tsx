import { useEffect, useState } from "react";

export function SideBarInfoArea() {
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    window.ipcApi.registerChatCountListener((e, newChatCount) => {
      setChatCount((_) => newChatCount);
    });
  }, []);

  return (
    <div>
      <div>Like Count: 123</div>
      <div>Live View Count: 123</div>
      <div>Chat Count: {chatCount}</div>
      <div>Chat UU Count: 123</div>
    </div>
  );
}
