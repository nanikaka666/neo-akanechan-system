import { useCurrentTime } from "../../../hooks/useCurrentTime";

const DayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fill2Digits(x: number) {
  return x < 10 ? `0${x}` : `${x}`;
}

export function Clock() {
  const now = useCurrentTime();
  const hour = fill2Digits(now.getHours());
  const minute = fill2Digits(now.getMinutes());
  const second = fill2Digits(now.getSeconds());

  const month = now.getMonth();
  const day = now.getDate();
  const dayOfWeek = DayOfWeek[now.getDay()];

  return (
    <div className="clock-container">
      <div className="clock font-oswald">
        <div className="day">
          {month}/{day} ({dayOfWeek})
        </div>
        <div className="time">
          <p className="number">{hour}</p>
          <p className="separator">:</p>
          <p className="number">{minute}</p>
          <p className="separator">:</p>
          <p className="number">{second}</p>
        </div>
      </div>
    </div>
  );
}
