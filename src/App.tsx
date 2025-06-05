import { useState } from "react";

import "./App.css";
import {
  Curve,
  Gradient,
  LimitSpeed,
  Route,
  StopPosition,
  TestRoute,
} from "./model/Route";
import { SetForceData, TestVehicle, Vehicle } from "./model/Vehicle";
import { RuncurveResult } from "./model/Runcurve";
import { Graph } from "./graph/Graph";
import { GetRuncurveLine, GetRuncurveLineTime } from "./runcurve/RuncurveLine";
import { Timetable } from "./graph/Timetable";

function App() {
  const [route, setRoute] = useState(new Route());
  const [vehicle, setVehicle] = useState(new Vehicle());

  const [runcurve, setRuncurve] = useState([] as RuncurveResult[]);

  // const runcurve = GetRuncurveSpeedAndTime(props.route, props.vehicle, 151, 1716, 75);

  return (
    <>
      <div className="flex w-[100%]">
        <div className="flex-1/2 w-[50cqw]">
          {/* 路線エディタ */}
          <h2 className="text-3xl">路線設定</h2>
          <button
            onClick={() => {
              setRoute(TestRoute);
            }}
          >
            テストデータを読み込む
          </button>
          <div>
            <label>
              路線名
              <input
                type="text"
                value={route.name}
                onChange={(v) => {
                  route.name = v.target.value;
                  setRoute({ ...route });
                }}
                className="w-32 border-slate-900 border-1 rounded-xs m-1"
              />
            </label>
          </div>
          <div>
            <h3 className="text-2xl">勾配設定</h3>
            <div className="overflow-y-scroll h-[30vh] p-1 m-2 border-1 border-slate-500">
              <table>
                <thead>
                  <tr>
                    <th>位置(m)</th>
                    <th>勾配(‰)</th>
                  </tr>
                </thead>
                <tbody>
                  {route.gradients
                    /* .sort((a, b) => a.position - b.position) */
                    .map((v, i) => (
                      <tr key={v.position} className="p-1">
                        <td>
                          <input
                            type="number"
                            value={v.position}
                            onChange={(e) => {
                              v.position = Number(e.target.value) || 0;
                              setRoute({ ...route });
                            }}
                            className="w-24 border-slate-900 border-1 rounded-xs m-1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={v.value}
                            onChange={(e) => {
                              v.value = Number(e.target.value) || 0;
                              setRoute({ ...route });
                            }}
                            className="w-24 border-slate-900 border-1 rounded-xs m-1"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              route.gradients = route.gradients.filter(
                                (_, _i) => _i !== i
                              );
                              setRoute({ ...route });
                            }}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td>
                      <button
                        onClick={() => {
                          route.gradients.push(new Gradient());
                          setRoute({ ...route });
                        }}
                      >
                        追加
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3 className="text-2xl">曲線設定</h3>
            <div className="overflow-y-scroll h-[30vh] p-1 m-2 border-1 border-slate-500">
              <table>
                <thead>
                  <tr>
                    <th>開始位置(m)</th>
                    <th>終了位置(m)</th>
                    <th>曲線半径(m)</th>
                  </tr>
                </thead>
                <tbody>
                  {route.curves.map((v, i) => (
                    <tr key={v.start} className="p-1">
                      <td>
                        <input
                          type="number"
                          value={v.start}
                          onChange={(e) => {
                            v.start = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={v.end}
                          onChange={(e) => {
                            v.end = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={v.radius}
                          onChange={(e) => {
                            v.radius = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            route.curves = route.curves.filter(
                              (_, _i) => _i !== i
                            );
                            setRoute({ ...route });
                          }}
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <td>
                        <button
                          onClick={() => {
                            route.curves.push(new Curve());
                            setRoute({ ...route });
                          }}
                        >
                          追加
                        </button>
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3 className="text-2xl">速度制限設定</h3>
            <div className="overflow-y-scroll h-[30vh] p-1 m-2 border-1 border-slate-500">
              <table>
                <thead>
                  <tr>
                    <th>開始位置(m)</th>
                    <th>終了位置(m)</th>
                    <th>速度(km/h)</th>
                  </tr>
                </thead>
                <tbody>
                  {route.limitSpeeds.map((v, i) => (
                    <tr key={v.start} className="p-1">
                      <td>
                        <input
                          type="number"
                          value={v.start}
                          onChange={(e) => {
                            v.start = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={v.end}
                          onChange={(e) => {
                            v.end = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={v.speed}
                          onChange={(e) => {
                            v.speed = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <td>
                          <button
                            onClick={() => {
                              route.limitSpeeds = route.limitSpeeds.filter(
                                (_, _i) => _i !== i
                              );
                              setRoute({ ...route });
                            }}
                          >
                            削除
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <td>
                        <button
                          onClick={() => {
                            route.limitSpeeds.push(new LimitSpeed());
                            setRoute({ ...route });
                          }}
                        >
                          追加
                        </button>
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl">駅設定</h3>
            <div className="overflow-y-scroll h-[30vh] p-1 m-2 border-1 border-slate-500">
              <table>
                <thead>
                  <tr>
                    <th>停車位置(m)</th>
                    <th>駅名</th>
                    <th>駅番線</th>
                    <th>通過フラグ</th>
                  </tr>
                </thead>
                <tbody>
                  {route.stopPositions.map((v, i) => (
                    <tr key={v.position} className="p-1">
                      <td>
                        <input
                          type="number"
                          value={v.position}
                          onChange={(e) => {
                            v.position = Number(e.target.value) || 0;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={v.stationName}
                          onChange={(e) => {
                            v.stationName = e.target.value || "";
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={v.trackName}
                          onChange={(e) => {
                            v.trackName = e.target.value || "";
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={v.isPass}
                          onChange={(e) => {
                            v.isPass = e.target.checked;
                            setRoute({ ...route });
                          }}
                          className="w-24 border-slate-900 border-1 rounded-xs m-1"
                        />
                      </td>
                      <td>
                        <td>
                          <button
                            onClick={() => {
                              route.stopPositions = route.stopPositions.filter(
                                (_, _i) => _i !== i
                              );
                              setRoute({ ...route });
                            }}
                          >
                            削除
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <td>
                        <button
                          onClick={() => {
                            route.stopPositions.push(new StopPosition());
                            setRoute({ ...route });
                          }}
                        >
                          追加
                        </button>
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-2xl">JSON入出力</h3>
            <div className="w-[100%]">
              <textarea
                value={JSON.stringify(route)}
                onChange={(v) => {
                  const value = JSON.parse(v.target.value) || {};
                  setRoute({ ...route, ...value });
                }}
                className="border-slate-900 border-1 rounded-xs m-1 w-[90%] h-[10ric]"
              />
            </div>
          </div>
        </div>
        <div className="h-100% border-r-1 border-slate-900"></div>
        <div className="flex-1/2">
          {/* 車両エディタ */}
          <h2 className="text-3xl">車両設定</h2>
          <button
            onClick={() => {
              setVehicle(TestVehicle);
            }}
          >
            テストデータを読み込む
          </button>
          <div>
            <label>
              車両名
              <input
                type="text"
                value={vehicle.name}
                onChange={(v) => {
                  vehicle.name = v.target.value;
                  setVehicle({ ...vehicle });
                }}
                className="w-32 border-slate-900 border-1 rounded-xs m-1"
              />
            </label>
          </div>
          <div>
            <label>
              最高速度
              <input
                type="text"
                value={vehicle.maxSpeed}
                onChange={(v) => {
                  vehicle.maxSpeed = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h
            </label>
          </div>
          <div>
            <label>
              編成両数
              <input
                type="text"
                value={vehicle.numberOfCars}
                onChange={(v) => {
                  vehicle.numberOfCars = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              両
            </label>
          </div>
          <div>
            <label>
              編成長
              <input
                type="text"
                value={vehicle.trainLength}
                onChange={(v) => {
                  vehicle.trainLength = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              m
            </label>
          </div>
          <div>
            <label>
              編成重量
              <input
                type="text"
                value={vehicle.trainWeight}
                onChange={(v) => {
                  vehicle.trainWeight = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              t
            </label>
          </div>
          <div>
            <label>
              編成定員
              <input
                type="text"
                value={vehicle.capacity}
                onChange={(v) => {
                  vehicle.capacity = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              人
            </label>
          </div>
          <div>
            <label>
              1人あたり乗客重量
              <input
                type="text"
                value={vehicle.humanWeight}
                onChange={(v) => {
                  vehicle.humanWeight = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              kg
            </label>
          </div>
          <div>
            <label>
              乗車効率
              <input
                type="text"
                value={vehicle.occupancyRate}
                onChange={(v) => {
                  vehicle.occupancyRate = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              %
            </label>
          </div>
          <div>
            <label>
              起動加速度
              <input
                type="text"
                value={vehicle.startupAcceleration}
                onChange={(v) => {
                  vehicle.startupAcceleration = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h/s
            </label>
          </div>
          <div>
            <label>
              減速度
              <input
                type="text"
                value={vehicle.deceleration}
                onChange={(v) => {
                  vehicle.deceleration = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h/s
            </label>
          </div>
          <div>
            <label>
              定トルク領域終了速度
              <input
                type="text"
                value={vehicle.fixedTorqueSpeed}
                onChange={(v) => {
                  vehicle.fixedTorqueSpeed = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h
            </label>
          </div>
          <div>
            <label>
              定出力領域終了領域
              <input
                type="text"
                value={vehicle.constantPowerSpeed}
                onChange={(v) => {
                  vehicle.constantPowerSpeed = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h
            </label>
          </div>
          <div>
            <label>
              M車の両数
              <input
                type="text"
                value={vehicle.mCars}
                onChange={(v) => {
                  vehicle.mCars = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              両
            </label>
          </div>
          <div>
            <label>
              T車の両数
              <input
                type="text"
                value={vehicle.tCars}
                onChange={(v) => {
                  vehicle.tCars = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              両
            </label>
          </div>
          <div>
            <label>
              M車の重量
              <input
                type="text"
                value={vehicle.mWeight}
                onChange={(v) => {
                  vehicle.mWeight = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              t
            </label>
          </div>
          <div>
            <label>
              T車の重量
              <input
                type="text"
                value={vehicle.tWeight}
                onChange={(v) => {
                  vehicle.tWeight = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
              km/h
            </label>
          </div>
          <div>
            <label>
              定出力領域の定数
              <input
                type="text"
                value={vehicle.coefficient0}
                onChange={(v) => {
                  vehicle.coefficient0 = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
            </label>
          </div>
          <div>
            <label>
              特性領域の定数
              <input
                type="text"
                value={vehicle.coefficient1}
                onChange={(v) => {
                  vehicle.coefficient1 = Number(v.target.value) || 0;
                  setVehicle({ ...vehicle });
                }}
                className="w-24 border-slate-900 border-1 rounded-xs m-1"
              />
            </label>
          </div>
          <div>
            <h3 className="text-2xl">JSON入出力</h3>
            <div className="w-[100%]">
              <textarea
                value={JSON.stringify(vehicle)}
                onChange={(v) => {
                  const value = JSON.parse(v.target.value) || {};
                  setVehicle({ ...vehicle, ...value });
                }}
                className="border-slate-900 border-1 rounded-xs m-1 w-[90%] h-[10ric]"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <button
          onClick={(_) =>
            setRuncurve(GetRuncurveLine(route, SetForceData(vehicle), 100))
          }
        >
          計算実行
        </button>
      </div>
      <div>
        <div className="overflow-scroll border-1 border-black p-2">
          <Graph data={runcurve} route={route} />
        </div>
        <div className="p-2 flex justify-center">
          <Timetable result={GetRuncurveLineTime(route, vehicle, runcurve)} />
        </div>
      </div>
    </>
  );
}

export default App;
