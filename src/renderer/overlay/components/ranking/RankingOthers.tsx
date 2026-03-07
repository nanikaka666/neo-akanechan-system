import { ParticipantPointRankingData } from "../../../../types/participantPoint";

export interface RankingOthersProps {
  list: ParticipantPointRankingData[];
  updatedAt: Date;
}

export function RankingOthers({ list, updatedAt }: RankingOthersProps) {
  return (
    list.length > 0 && (
      <div className="ranking-others-container" key={updatedAt.getTime()}>
        <ul className="ranking-others-list">
          {list.map((item) => {
            return (
              <li key={item.rank}>
                <div>#{item.rank}</div>
                <div>
                  <img src={item.participantPoint.author.profileImageUrl} />
                  <span>{item.participantPoint.author.name}</span>
                </div>
                <div>{item.participantPoint.point}</div>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
}
