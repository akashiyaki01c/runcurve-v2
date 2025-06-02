import { useState } from "react";

import "./App.css";
import { TestRoute } from "./model/Route";
import { TestVehicle } from "./model/Vehicle";
import { RuncurveResult } from "./model/Runcurve";
import { Graph } from "./graph/Graph";
import { GetRuncurveLine } from "./runcurve/RuncurveLine";

function App() {
  const [route, setRoute] = useState(TestRoute);
  const [vehicle, setVehicle] = useState(TestVehicle);

  const [runcurve, setRuncurve] = useState([] as RuncurveResult[]);

  // const runcurve = GetRuncurveSpeedAndTime(props.route, props.vehicle, 151, 1716, 75);

  return (
    <>
      <div className="flex">
        <div className="flex-1/2">
          {/* 路線エディタ */}
          <h2 className="text-3xl">路線設定</h2>
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
            <table>
              <thead>
                <tr>
                  <th>位置(m)</th>
                  <th>勾配(‰)</th>
                </tr>
              </thead>
              <tbody>
                {route.gradients
                  .sort((a, b) => a.position - b.position)
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
              </tbody>
            </table>
            <h3 className="text-2xl">曲線設定</h3>
            <table>
              <thead>
                <tr>
                  <th>開始位置(m)</th>
                  <th>終了位置(m)</th>
                  <th>曲線半径(m)</th>
                </tr>
              </thead>
              <tbody>
                {route.curves.map((v) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-2xl">速度制限設定</h3>
            <table>
              <thead>
                <tr>
                  <th>開始位置(m)</th>
                  <th>終了位置(m)</th>
                  <th>速度(km/h)</th>
                </tr>
              </thead>
              <tbody>
                {route.limitSpeeds.map((v) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="h-100% border-r-1 border-slate-900"></div>
        <div className="flex-1/2">
          {/* 車両エディタ */}
          <h2 className="text-3xl">車両設定</h2>
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
        </div>
      </div>
      <hr />
      <div>
        <button
          onClick={(_) =>
            setRuncurve(
              GetRuncurveLine(
                route,
                vehicle,
                100
              )
            )
          }
        >
          計算実行
        </button>
      </div>
      <div className=" overflow-scroll border-1 border-black">
        <Graph data={runcurve} route={route} />
      </div>
    </>
  );
}

export default App;
