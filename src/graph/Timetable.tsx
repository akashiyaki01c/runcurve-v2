import { TimeResult } from "../runcurve/RuncurveLine";
import "./Timetable.css";

export function Timetable({ result }: { result: TimeResult[] }) {
  if (result.length === 0) {
    return <></>;
  }

  return (
    <>
      <table className="timetable">
        <thead>
          <tr>
            <th>駅名</th>
            <th>番線</th>
            <th></th>
            <th>時秒</th>
            <th>距離</th>
            <th>平均速度</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2}>{result[0].fromStation.stationName}</td>
            <td rowSpan={2}>{result[0].fromStation.trackName}</td>
            <td rowSpan={2}>{result[0].fromStation.isPass ? "↓" : "◯"}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {result.map((v) => (
            <>
              <tr key={`${v.fromStation.position}-${v.toStation.position}`}>
                {/* 駅名 */}
                {/* 番線 */}
                {/* 停通 */}
                <td rowSpan={2}>{v.time.toFixed(2)} 秒</td>
                <td rowSpan={2}>
                  {v.toStation.position - v.fromStation.position} m
                </td>
                <td rowSpan={2}>
                  {(
                    (v.toStation.position - v.fromStation.position) /
                    1000 /
                    (v.time / 3600)
                  ).toFixed(2)}{" "}
                  km/h
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>{v.toStation.stationName}</td>
                <td rowSpan={2}>{v.toStation.trackName}</td>
                <td rowSpan={2}>{v.toStation.isPass ? "↓" : "◯"}</td>
              </tr>
            </>
          ))}
          <tr>
            {/* 駅名 */}
            {/* 番線 */}
            {/* 停通 */}
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
