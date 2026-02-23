import { ParticipantPointRankingData } from "../../../types/participantPoint";

export interface RankingOthersProps {
  list: ParticipantPointRankingData[];
}

export function RankingOthers({ list }: RankingOthersProps) {
  return (
    list.length > 0 && (
      <div className="ranking-others-container">
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
