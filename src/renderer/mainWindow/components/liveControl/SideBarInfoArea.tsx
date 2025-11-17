import { useEffect, useState } from "react";

export function SideBarInfoArea() {
  const [chatCount, setChatCount] = useState(0);
  const [chatUU, setChatUU] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    window.ipcApi.registerChatCountListener((e, newChatCount) => {
      setChatCount((_) => newChatCount);
    });
    window.ipcApi.registerChatUUListener((e, newChatUU) => {
      setChatUU((_) => newChatUU);
    });
    window.ipcApi.registerLikeCountListener((e, newLikeCount) => {
      setLikeCount((_) => newLikeCount);
    });
  }, []);

  return (
    <div>
      <div>Like Count: {likeCount}</div>
      <div>Live View Count: 123</div>
      <div>Chat Count: {chatCount}</div>
      <div>Chat UU Count: {chatUU}</div>
    </div>
  );
}
