import { LimitSpeed, Route, TestRoute } from "../model/Route";
import { NotchType, RuncurveResult } from "../model/Runcurve";
import { ForceInterpolation, TestVehicle, Vehicle } from "../model/Vehicle";
import { GetCurveRadius, GetGradient, GetTunnel } from "./RouteData";

// 惰行時、1m先の速度を求める
export function getNotchOffNextSpeed(currentSpeed: number, vehicle: Vehicle, radius: number, gradient: number, tunnel: number) {
	// force: kgf/t
	let force = -ForceInterpolation(vehicle.runningResist, currentSpeed) /
		(vehicle.trainWeight);
	force -= tunnel + gradient;
	if (radius != 0)
		force -= 800 / radius;

	let acceleration = force / 30.9;
	return Math.sqrt((currentSpeed / 3.6) ** 2 + (2 * acceleration / 3.6)) * 3.6;
}

// 加速時、1m先の速度を求める
export function getAccelNextSpeed(currentSpeed: number, vehicle: Vehicle, radius: number, gradient: number, tunnel: number) {
	// force: kgf/t
	let force = (ForceInterpolation(vehicle.accelerationForce, currentSpeed) - ForceInterpolation(vehicle.runningResist, currentSpeed)) /
		(vehicle.trainWeight);
	force -= tunnel + gradient;
	if (radius != 0)
		force -= 800 / radius;

	let acceleration = force / 30.9;
	return Math.sqrt((currentSpeed / 3.6) ** 2 + (2 * acceleration / 3.6)) * 3.6;
}

// 減速した際の1m前の速度を求める関数
// currentSpeed: 現在の速度
// tractiveForces: 1km/hごとの引張力
// runningResistance: 1km/hごとの走行抵抗
// radius: 曲線半径
// gradient: 勾配
// tunnel: トンネル種別
// => 速度(km/h)
export function getDecelBeforeSpeed(currentSpeed: number, vehicle: Vehicle, radius: number, gradient: number, tunnel: number) {
	// force: kgf/t
	let force = -ForceInterpolation(vehicle.runningResist, currentSpeed) /
		(vehicle.trainWeight);
	force += tunnel + gradient + (ForceInterpolation(vehicle.decelerationForce, currentSpeed)) /
		(vehicle.trainWeight);
	if (radius != 0)
		force += 800 / radius;

	let acceleration = force / 30.9;
	return Math.sqrt((currentSpeed / 3.6) ** 2 + (2 * acceleration / 3.6)) * 3.6;
}

/** ランカーブ生成 */
export function GetRuncurveSpeed(route: Route, vehicle: Vehicle, startPos: number, endPos: number, maxSpeed: number): [number[], [number, NotchType][]] {
	const limitMarginSpeed = 2;

	const length = endPos - startPos;
	// 制限速度配列
	const limitSpeedArray = getLimitSpeedArray(route, vehicle, startPos, endPos, maxSpeed);
	const curveArray = GetCurveRadius(route, vehicle, startPos, endPos);
	const gradientArray = GetGradient(route, vehicle, startPos, endPos);
	const tunnelArray = GetTunnel(route, vehicle, startPos, endPos);
	console.log(curveArray);

	// ブレーキパターン配列
	const brakePatternArray = getLimitSpeedBrakePatternArray(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray);
	const speedArray: number[] = [...Array(endPos - startPos)].map(_ => 0);

	const notchOperate: [number, NotchType][] = [];

	let speed = 0;
	let notchType: NotchType = "Power";
	notchOperate.push([startPos, "Power"]);

	for (let i = 0; i < length; i++) {
		// 運転シミュレータ
		switch (notchType) {
			case "Power": {
				if (i % 10 === 0 && get10sLaterNotchOffSpeed(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed) > (limitSpeedArray[i] - limitMarginSpeed)) {
					// 速度が惰行で10s後に目標速度を超える時
					notchType = "NotchOff";
					notchOperate.push([i + startPos, "NotchOff"]);
				}
				if (speed > (limitSpeedArray[i] - limitMarginSpeed)) {
					// 速度が目標速度に達した
					if (getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]) > speed) {
						notchType = "Constant";
						notchOperate.push([i + startPos, "Constant"]);
					} else {
						notchType = "NotchOff";
						notchOperate.push([i + startPos, "NotchOff"]);
					}
				}
				if (getBrakePatternDistance(brakePatternArray, speed, i) != -1) {
					if (3.6 * ((getBrakePatternDistance(brakePatternArray, speed, i) - i) / speed) < 5) {
						// ブレーキパターンが10s後に接近(近似)
						notchType = "NotchOff";
						notchOperate.push([i + startPos, "NotchOff"]);
					}
				}
				break;
			}
			case "NotchOff": {
				if (getBrakePatternDistance(brakePatternArray, speed, i) != -1) {
					if (3.6 * ((getBrakePatternDistance(brakePatternArray, speed, i) - i) / speed) < 5) {
						break;
					}
				}
				if (i % 10 === 0) {
					const powerSpeed = get10sLaterPowerSpeed(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
					if (powerSpeed < (limitSpeedArray[i] - limitMarginSpeed)) {
						const laterSpeed = get10sLaterPowerSpeed(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
						const laterDistance = get10sLaterPowerDistance(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
						if (laterSpeed !== 0 && laterSpeed < (limitSpeedArray[i] - limitMarginSpeed) && getBrakePatternDistance(brakePatternArray, laterSpeed, laterDistance) == -1) {
							notchType = "Power";
							notchOperate.push([i + startPos, "Power"]);
						}
						if (laterSpeed !== 0 && laterSpeed < (limitSpeedArray[i] - limitMarginSpeed) && (3.6 * getBrakePatternDistance(brakePatternArray, laterSpeed, laterDistance) / laterSpeed) > 5) {
							notchType = "Power";
							notchOperate.push([i + startPos, "Power"]);
						}
					}
				}
				if (speed > (limitSpeedArray[i] - 4) && getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]) > speed) {
					notchType = "Constant";
					notchOperate.push([i + startPos, "Constant"]);
				}
				if (brakePatternArray[i] !== -1 && speed > brakePatternArray[i]) {
					notchType = "Brake";
					notchOperate.push([i + startPos, "Brake"]);
				}
				break;
			}
			case "Constant": {
				const powerSpeed = get10sLaterPowerSpeed(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
				if (powerSpeed < (limitSpeedArray[i] - limitMarginSpeed)) {
					const laterSpeed = get10sLaterPowerSpeed(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
					const laterDistance = get10sLaterPowerDistance(route, vehicle, startPos, endPos, limitSpeedArray, curveArray, gradientArray, tunnelArray, i, speed);
					if (laterSpeed !== 0 && laterSpeed < (limitSpeedArray[i] - limitMarginSpeed) && getBrakePatternDistance(brakePatternArray, laterSpeed, laterDistance) == -1) {
						notchType = "Power";
						notchOperate.push([i + startPos, "Power"]);
					}
					if (laterSpeed !== 0 && laterSpeed < (limitSpeedArray[i] - limitMarginSpeed) && (3.6 * getBrakePatternDistance(brakePatternArray, laterSpeed, laterDistance) / laterSpeed) > 5) {
						notchType = "Power";
						notchOperate.push([i + startPos, "Power"]);
					}
				}
				if (speed > (limitSpeedArray[i] - limitMarginSpeed)) {
					// 速度が目標速度に達した
					if (getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]) > speed) {
						// no-op
					} else {
						notchType = "NotchOff";
						notchOperate.push([i + startPos, "NotchOff"]);
					}
				}
				if (brakePatternArray[i] !== -1 && speed > brakePatternArray[i]) {
					notchType = "Brake";
					notchOperate.push([i + startPos, "Brake"]);
				}
				break;
			}
			case "Brake": {
				if (brakePatternArray.length !== brakePatternArray.length - 1
					&& brakePatternArray[i + 1] > getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i])) {
					notchType = "NotchOff";
					notchOperate.push([i + startPos, "NotchOff"]);
				}
			}
		}

		switch (notchType) {
			case "Power":
				speed = getAccelNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]);
				speedArray[i] = speed;
				break;
			case "NotchOff":
				speed = getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]);
				speedArray[i] = speed;
				break;
			case "Constant":
				if (getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]) < speed) {
					notchType = "NotchOff";
					notchOperate.push([i + startPos, "NotchOff"]);
					speed = getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]);
					speedArray[i] = speed;
				} else {
					speedArray[i] = speed;
				}
				break;
			case "Brake":
				if (brakePatternArray[i] == -1) {
					// 速度が目標速度に達した
					if (getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]) > speed) {
						notchType = "Constant";
						notchOperate.push([i + startPos, "Constant"]);
					} else {
						notchType = "NotchOff";
						notchOperate.push([i + startPos, "NotchOff"]);
						speed = getNotchOffNextSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]);
					}

					speedArray[i] = speed;
					break;
				}
				speed = brakePatternArray[i];
				speedArray[i] = speed;
				break;
		}
	}

	console.log(notchOperate);

	return [speedArray, notchOperate];
}

export function GetRuncurveTime(speedArray: number[]) {
	const result = [...Array(speedArray.length)].map(_ => 0);
	let currentTime = 0;

	for (let i = 0; i < result.length; i++) {
		if (speedArray[i] == 0) {
			result[i] = currentTime;
			continue;
		}
		currentTime += (3.6) / speedArray[i];
		result[i] = currentTime;
	}

	return result;
}

export function GetRuncurveSpeedAndTime(route: Route, vehicle: Vehicle, startPos: number, endPos: number, maxSpeed: number): RuncurveResult {
	const speed = GetRuncurveSpeed(route, vehicle, startPos, endPos, maxSpeed);
	const time = GetRuncurveTime(speed[0]);
	const result = {
		notches: speed[1],
		runcurveArray: [...Array(speed[0].length)].map(_ => { return { distance: 0, speed: 0, time: 0 } })
	} satisfies RuncurveResult;
	for (let i = 0; i < result.runcurveArray.length; i++) {
		result.runcurveArray[i] = { distance: i + startPos, speed: speed[0][i], time: time[i] };
	}
	return result;
}

// 制限速度の1mごとの配列
function getLimitSpeedArray(route: Route, _vehicle: Vehicle, startPos: number, endPos: number, maxSpeed: number) {
	const result: number[] = [...Array(endPos - startPos)].map(_ => maxSpeed);

	for (const limitSpeed of route.limitSpeeds) {
		// 制限速度がstart-endの範囲外
		if (endPos < limitSpeed.start) continue;
		if (limitSpeed.end < startPos) continue;

		const curveStart = (startPos < limitSpeed.start ? limitSpeed.start : startPos) - startPos;
		const curveEnd = (limitSpeed.end < endPos ? limitSpeed.end : endPos) - startPos;

		for (let i = curveStart; i < curveEnd; i++) {
			result[i] = limitSpeed.speed;
		}
	}
	return result;
}

// 制限速度への減速パターン配列
function getLimitSpeedBrakePatternArray(route: Route, vehicle: Vehicle, startPos: number, endPos: number, limitSpeedArray: number[], curveArray: number[], gradientArray: number[], tunnelArray: number[]) {
	const result: number[] = [...Array(endPos - startPos)].map(_ => -1);
	const limitSpeeds = [...route.limitSpeeds, { start: endPos - 1, end: endPos, speed: 0 } satisfies LimitSpeed];
	const limitMarginSpeed = 2;

	for (const limitSpeed of limitSpeeds) {
		if (limitSpeed.start < startPos || endPos < limitSpeed.start) continue;
		let i = limitSpeed.start - startPos; // 開始地点
		let speed = Math.max(limitSpeed.speed - limitMarginSpeed, 0); // 初期速度

		result[i] = Math.max(limitSpeed.speed - limitMarginSpeed, 0);

		while (true) {
			if (i <= 0) break;
			if (speed >= limitSpeedArray[i]) break;

			i--;
			speed = getDecelBeforeSpeed(speed, vehicle, curveArray[i], gradientArray[i], tunnelArray[i]);
			if (result[i] == -1) {
				result[i] = speed;
			} else {
				if (result[i] > speed) {
					result[i] = speed;
				}
			}
		}
	}

	return result;
}

// 惰行で10秒間走った時の速度
function get10sLaterNotchOffSpeed(_route: Route, vehicle: Vehicle, _startPos: number, _endPos: number, limitSpeedArray: number[], curveArray: number[], gradientArray: number[], tunnelArray: number[], index: number, currentSpeed: number) {
	const speedHistory = [currentSpeed];
	if (currentSpeed == 0) {
		return 0;
	}
	while (true) {
		if (limitSpeedArray.length <= index) {
			return 0;
		}
		currentSpeed = getNotchOffNextSpeed(currentSpeed, vehicle, curveArray[index], gradientArray[index], tunnelArray[index]);
		speedHistory.push(currentSpeed);

		if (speedHistory.reduce((p, v) => p + (3.6 / v), 0) > 10) {
			return currentSpeed;
		}
		index++;
	}
}

// 力行で10秒間走った時の速度
function get10sLaterPowerSpeed(_route: Route, vehicle: Vehicle, _startPos: number, _endPos: number, limitSpeedArray: number[], curveArray: number[], gradientArray: number[], tunnelArray: number[], index: number, currentSpeed: number) {
	const speedHistory = [currentSpeed];
	if (currentSpeed == 0) {
		return 0;
	}
	while (true) {
		if (limitSpeedArray.length <= index) {
			return 0;
		}
		currentSpeed = getAccelNextSpeed(currentSpeed, vehicle, curveArray[index], gradientArray[index], tunnelArray[index]);
		speedHistory.push(currentSpeed);

		if (speedHistory.reduce((p, v) => p + (3.6 / v), 0) > 5) {
			return currentSpeed;
		}
		index++;
	}
}

// 力行で10秒間走った時の距離
function get10sLaterPowerDistance(_route: Route, vehicle: Vehicle, _startPos: number, _endPos: number, limitSpeedArray: number[], curveArray: number[], gradientArray: number[], tunnelArray: number[], index: number, currentSpeed: number) {
	const speedHistory = [currentSpeed];
	if (currentSpeed == 0) {
		return 0;
	}
	while (true) {
		if (limitSpeedArray.length <= index) {
			return 0;
		}
		currentSpeed = getNotchOffNextSpeed(currentSpeed, vehicle, curveArray[index], gradientArray[index], tunnelArray[index]);
		speedHistory.push(currentSpeed);

		if (speedHistory.reduce((p, v) => p + (3.6 / v), 0) > 5) {
			return index;
		}
		index++;
	}
}

// 惰行で10秒間走った時の距離
function get10sLaterNotchOffDistance(_route: Route, vehicle: Vehicle, _startPos: number, _endPos: number, limitSpeedArray: number[], curveArray: number[], gradientArray: number[], tunnelArray: number[], index: number, currentSpeed: number) {
	const speedHistory = [currentSpeed];
	if (currentSpeed == 0) {
		return 0;
	}
	while (true) {
		if (limitSpeedArray.length <= index) {
			return 0;
		}
		currentSpeed = getNotchOffNextSpeed(currentSpeed, vehicle, curveArray[index], gradientArray[index], tunnelArray[index]);
		speedHistory.push(currentSpeed);

		if (speedHistory.reduce((p, v) => p + (3.6 / v), 0) > 10) {
			return index;
		}
		index++;
	}
}

// ブレーキパターンが接触する距離
function getBrakePatternDistance(brakePatternArray: number[], currentSpeed: number, index: number) {
	for (; index < brakePatternArray.length - 1; index++) {
		if (brakePatternArray[index] == -1)
			break;
		if (brakePatternArray[index + 1] == -1)
			break;
		if (brakePatternArray[index + 1] < currentSpeed && currentSpeed < brakePatternArray[index]) {
			return index;
		}
	}
	return -1;
}

export function TEST_FUNC() {
	const route = TestRoute;
	const vehicle = TestVehicle;

	const _runcurve = GetRuncurveSpeed(route, vehicle, 0, 1000, 75);
}