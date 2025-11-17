import { useEffect, useState } from "react";

export function SideBarInfoArea() {
  const [chatCount, setChatCount] = useState(0);
  const [chatUU, setChatUU] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liveViewCount, setLiveViewCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0); // need initial value.

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
    window.ipcApi.registerLiveViewCountListener((e, newLiveViewCount) => {
      setLiveViewCount((_) => newLiveViewCount);
    });
    window.ipcApi.registerSubscriberCountListener((e, newSubscriberCount) => {
      setSubscriberCount((_) => newSubscriberCount);
    });
  }, []);

  return (
    <div>
      <div>Like Count (MAX): {likeCount}</div>
      <div>Live View Count (MAX): {liveViewCount}</div>
      <div>Chat Count: {chatCount}</div>
      <div>Chat UU Count: {chatUU}</div>
      <div>Subscriber Count: {subscriberCount}</div>
    </div>
  );
}
