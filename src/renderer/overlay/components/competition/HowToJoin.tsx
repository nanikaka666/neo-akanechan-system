interface HowToJoinProps {
  closedAt: Date;
}

export function HowToJoin({ closedAt }: HowToJoinProps) {
  return (
    <div className="how-to-join-container">
      <div className="how-to-join">
        <div className="join-method">
          <div className="header">参加方法</div>
          <div>
            <div>
              正解だと思う選択肢を選び、チャット欄にスラッシュ(/)をつけて書き込んでください。
            </div>
            <div>
              例えば、選択肢Aの場合<span className="example">「/A」</span>or
              <span className="example">「/a」</span>です。
            </div>
          </div>
        </div>
        <div className="close-time">
          <div className="header">締切時間</div>
          <div>{closedAt.toLocaleString().split(" ")[1]}</div>
        </div>
      </div>
    </div>
  );
}
