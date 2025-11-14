export function StandByAnnouncement({ prepareCompletion }: { prepareCompletion: () => void }) {
  return (
    <div>
      <div>配信スタンバイ中</div>
      <div>「hogehoge」のウィンドウをOBS上でキャプチャしてください</div>
      <div>準備ができたら「OK」を押してください</div>
      <button onClick={prepareCompletion}>OK</button>
    </div>
  );
}
