import { ParticipantPointRankingData } from "../../../types/participantPoint";

export interface RankingProps {
  first: ParticipantPointRankingData;
  second?: ParticipantPointRankingData;
  third?: ParticipantPointRankingData;
  updatedAt: Date;
}

export function Ranking({ first, second, third, updatedAt }: RankingProps) {
  return (
    <div className="ranking-view-container">
      <div className="date">{updatedAt.toLocaleString()} 時点</div>
      <div className="ranking-view">
        <div>Ranking</div>
        <div>
          <div>
            <div>1st</div>
            <div className="author">
              <img src={first.participantPoint.author.profileImageUrl} />
              <div>{first.participantPoint.author.name}</div>
            </div>
            <div>{first.participantPoint.point}</div>
          </div>
          {second && (
            <div>
              <div>2nd</div>
              <div className="author">
                <img src={second.participantPoint.author.profileImageUrl} />
                <div>{second.participantPoint.author.name}</div>
              </div>
              <div>{second.participantPoint.point}</div>
            </div>
          )}
          {third && (
            <div>
              <div>3rd</div>
              <div className="author">
                <img src={third.participantPoint.author.profileImageUrl} />
                <div>{third.participantPoint.author.name}</div>
              </div>
              <div>{third.participantPoint.point}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
