import { ParticipantPointRankingData } from "../../../../types/participantPoint";

export interface RankingProps {
  first: ParticipantPointRankingData;
  second?: ParticipantPointRankingData;
  third?: ParticipantPointRankingData;
  updatedAt: Date;
}

export function RankingLeaders({ first, second, third, updatedAt }: RankingProps) {
  return (
    <div className="ranking-leaders font-noto" key={updatedAt.getTime()}>
      <div className="leader-board">
        <div className="date">{updatedAt.toLocaleString()} 時点</div>
        <div className="title font-noto-bold">配信参加ポイントランキング</div>
        <div className="table ">
          <div className="row rank-1 font-noto-bold">
            <div className="rank">1位</div>
            <div className="author">
              <img src={first.participantPoint.author.profileImageUrl} />
              <div className="name">{first.participantPoint.author.name}</div>
            </div>
            <div className="point">{first.participantPoint.point}</div>
          </div>
          {second && (
            <div className="row rank-2">
              <div className="rank">2位</div>
              <div className="author">
                <img src={second.participantPoint.author.profileImageUrl} />
                <div className="name">{second.participantPoint.author.name}</div>
              </div>
              <div className="point">{second.participantPoint.point}</div>
            </div>
          )}
          {third && (
            <div className="row rank-3">
              <div className="rank">3位</div>
              <div className="author">
                <img src={third.participantPoint.author.profileImageUrl} />
                <div className="name">{third.participantPoint.author.name}</div>
              </div>
              <div className="point">{third.participantPoint.point}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
