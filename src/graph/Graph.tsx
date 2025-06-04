import { Curve, Route } from "../model/Route";
import { NotchType, RuncurveResult } from "../model/Runcurve";

export function Graph({
  data,
  route,
}: {
  data: RuncurveResult[];
  route: Route;
}) {
  const xScale = 0.3;
  const yScale = 5;
  const start = data[0]?.runcurveArray[0]?.distance || 0;
  const maxSpeed = 120;

  const length =
    data[data.length - 1]?.runcurveArray[
      data[data.length - 1]?.runcurveArray.length - 1
    ]?.distance - data[0]?.runcurveArray[0]?.distance || 0;

  return (
    <>
      <svg
        viewBox={`0 0 ${length * xScale} ${maxSpeed * yScale + 200}`}
        width={length * xScale}
        height={maxSpeed * yScale + 200}
      >
        {/* 縦軸 */}
        {/* {[...Array(length + 1).keys()].map((v) =>
          (v + start) % 200 === 0 ? (
            <line
              key={`x-line-${v}`}
              stroke="#abf"
              x1={v * xScale}
              x2={v * xScale}
              y1={0}
              y2={maxSpeed * yScale}
            />
          ) : (v + start) % 20 === 0 ? (
            <line
              key={`x-line-${v}`}
              stroke="#abf"
              x1={v * xScale}
              x2={v * xScale}
              y1={0}
              y2={maxSpeed * yScale}
              strokeWidth={0.5}
            />
          ) : (
            <></>
          )
        )} */}
        {/* {[...Array(length + 1).keys()].map((v) =>
          (v + start) % 1000 === 0 ? (
            <text
              key={`x-text-${v}`}
              x={v * xScale}
              y={maxSpeed * yScale + 30}
              fontSize={30}
              textAnchor="middle"
            >
              {Math.abs((v + start) / 1000)}
            </text>
          ) : (v + start) % 100 === 0 ? (
            <text
              key={`x-text-${v}`}
              x={v * xScale}
              y={maxSpeed * yScale + 25}
              fontSize={17.5}
              textAnchor="middle"
            >
              {Math.abs(((v + start) / 100) % 10)}
            </text>
          ) : (
            <></>
          )
        )} */}
        {/* 横軸 */}
        {[...Array(maxSpeed + 1).keys()].map((v) =>
          v % 10 === 0 ? (
            <line
              key={`y-line-${v}`}
              stroke="#abf"
              x1={0}
              x2={length * xScale}
              y1={v * yScale}
              y2={v * yScale}
            />
          ) : (
            <line
              key={`y-line-${v}`}
              stroke="#abf"
              x1={0}
              x2={length * xScale}
              y1={v * yScale}
              y2={v * yScale}
              strokeWidth={0.5}
            />
          )
        )}
        {/* 駅の縦線 */}
        {route.stopPositions.map((v) => (
          <>
            <line
              key={`y-sta-line-${v}`}
              stroke="black"
              fill="none"
              x1={(v.position - start) * xScale}
              y1={0}
              x2={(v.position - start) * xScale}
              y2={maxSpeed * yScale}
              strokeWidth={2}
            />
            <text
              key={`y-sta-text-${v}`}
              x={(v.position - start) * xScale + 10}
              y={0}
              writingMode={"tb"}
            >
              {v.stationName}
            </text>
          </>
        ))}
        {/* 時間線 */}
        {data.map((v) => (
          <polyline
            key={`graph-polyline-time-${v.runcurveArray[0]?.distance}`}
            stroke="red"
            fill="none"
            points={splitTime(v, route)
              .runcurveArray.filter((_, i) => i % 1 === 0)
              .map((v) => {
                return { ...v, time: v.time % 120 };
              })
              .map(
                (v) =>
                  `${(v.distance - start) * xScale},${
                    (maxSpeed - v.time) * yScale
                  }`
              )
              .join(" ")}
            strokeWidth={2}
          />
        ))}
        {/* 速度線 */}
        {data.map((v) => (
          <polyline
            key={`graph-polyline-speed-${v.runcurveArray[0]?.distance}`}
            stroke="blue"
            fill="none"
            points={v.runcurveArray
              .filter((_, i) => i % 1 === 0)
              .map(
                (v) =>
                  `${(v.distance - start) * xScale},${
                    (maxSpeed - v.speed) * yScale
                  }`
              )
              .join(" ")}
            strokeWidth={2}
          />
        ))}
        {/* ノッチ */}
        {data
          .flatMap((v) => v.notches)
          .map((v) => (
            <text
              key={`notch-${v[0]}-${v[1]}`}
              x={(v[0] - start) * xScale}
              y={(maxSpeed - 5) * yScale}
              textAnchor="middle"
            >
              {getNotchText(v[1])}
            </text>
          ))}
        {/* 制限速度 */}
        {route.limitSpeeds.map((v) => (
          <polyline
            key={`limitspeed-${v.start}-${v.end}-${v.speed}`}
            stroke="black"
            fill="none"
            points={`${(v.start - start) * xScale},${
              (maxSpeed - v.speed - 2) * yScale
            } ${(v.start - start) * xScale},${(maxSpeed - v.speed) * yScale} ${
              (v.end - start) * xScale
            },${(maxSpeed - v.speed) * yScale} ${(v.end - start) * xScale},${
              (maxSpeed - v.speed - 2) * yScale
            }`}
          />
        ))}
        {/* 曲線 */}
        {route.curves.map((v) => (
          <>
            <polyline
              key={`curve-line-${v.start}-${v.end}-${v.speed}`}
              stroke="black"
              fill="none"
              points={`${(v.start - start) * xScale},${
                (maxSpeed + 15) * yScale
              } ${(v.start - start) * xScale},${
                (maxSpeed + 15 + 3 * (v.direction === "right" ? 1 : -1)) *
                yScale
              } ${(v.end - start) * xScale},${
                (maxSpeed + 15 + 3 * (v.direction === "right" ? 1 : -1)) *
                yScale
              } ${(v.end - start) * xScale},${(maxSpeed + 15) * yScale}`}
            />
            <text
              key={`curve-text-${v.start}-${v.end}-${v.speed}`}
              x={((v.start - start + (v.end - start)) / 2) * xScale}
              y={
                (maxSpeed + 16.5 + 5 * (v.direction === "right" ? 1 : -1)) *
                yScale
              }
              textAnchor="middle"
            >
              {v.radius}
            </text>
          </>
        ))}
        {pairwiseSplit([new Curve(), ...route.curves]).map((v) => (
          <>
            <polyline
              key={`curve-between-${v[0].end}-${v[1]}`}
              stroke="black"
              fill="none"
              points={`${(v[0].end - start) * xScale},${
                (maxSpeed + 15) * yScale
              } ${(v[1].start - start) * xScale},${(maxSpeed + 15) * yScale}`}
            />
          </>
        ))}
        {/* 勾配 */}
        {route.gradients.map((v) => (
          <>
            <line
              key={`gradient-line-${v.position}`}
              stroke="black"
              fill="none"
              x1={(v.position - start) * xScale}
              x2={(v.position - start) * xScale}
              y1={(maxSpeed + 25) * yScale}
              y2={(maxSpeed + 35) * yScale}
            ></line>
            {v.value > 0 ? (
              <text
                key={`gradient-text-${v.position}`}
                x={(v.position - start) * xScale}
                y={(maxSpeed + 29) * yScale}
                textAnchor="start"
              >
                {v.value}
              </text>
            ) : (
              <></>
            )}
            {v.value < 0 ? (
              <text
                key={`gradient-text-${v.position}`}
                x={(v.position - start) * xScale}
                y={(maxSpeed + 34) * yScale}
                textAnchor="start"
              >
                {-v.value}
              </text>
            ) : (
              <></>
            )}
            {v.value === 0 ? (
              <text
                key={`gradient-text-${v.position}`}
                x={(v.position - start) * xScale}
                y={(maxSpeed + 31.5) * yScale}
                textAnchor="start"
              >
                L
              </text>
            ) : (
              <></>
            )}
          </>
        ))}
        <line
          stroke="black"
          fill="none"
          x1={0}
          x2={length * xScale}
          y1={(maxSpeed + 25) * yScale}
          y2={(maxSpeed + 25) * yScale}
        />
        <line
          stroke="black"
          fill="none"
          x1={0}
          x2={length * xScale}
          y1={(maxSpeed + 35) * yScale}
          y2={(maxSpeed + 35) * yScale}
        />
      </svg>
    </>
  );

  function getNotchText(text: NotchType) {
    switch (text) {
      case "Brake":
        return "B";
      case "Constant":
        return "T";
      case "Power":
        return "P";
      case "NotchOff":
        return "O";
    }
  }

  function pairwiseSplit<T>(arr: T[]) {
    if (arr.length < 2) {
      return [];
    }
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
      result.push([arr[i], arr[i + 1]]);
    }
    return result;
  }

  function splitTime(result: RuncurveResult, route: Route): RuncurveResult {
    const start = result.runcurveArray[0]?.distance;
    const end = result.runcurveArray[result.runcurveArray.length - 1]?.distance;

    const splitDistances = route.stopPositions
      .map((v) => v.position)
      .filter((v) => start < v && v < end);
    for (const distance of splitDistances) {
      const index = result.runcurveArray.findIndex(
        (v) => v.distance === distance
      );
      const offset = result.runcurveArray[index].time;
      for (let i = index; i < result.runcurveArray.length; i++) {
        result.runcurveArray[i].time -= offset;
      }
    }

    return result;
  }
}
