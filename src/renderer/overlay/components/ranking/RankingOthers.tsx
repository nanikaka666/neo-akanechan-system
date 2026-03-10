import { ParticipantPointRankingData } from "../../../../types/participantPoint";

export interface RankingOthersProps {
  list: ParticipantPointRankingData[];
  updatedAt: Date;
}

export function RankingOthers({ list, updatedAt }: RankingOthersProps) {
  return (
    list.length > 0 && (
      <div className="ranking-others-container">
        <div className="ranking-others font-noto-bold" key={updatedAt.getTime()}>
          <ul className="list">
            {list.map((item) => {
              return (
                <li className="row" key={item.rank}>
                  <div className="rank font-noto-bold">#{item.rank}</div>
                  <div className="author">
                    <img src={item.participantPoint.author.profileImageUrl} />
                    <div className="name">{item.participantPoint.author.name}</div>
                  </div>
                  <div className="point">{item.participantPoint.point}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )
  );
}
