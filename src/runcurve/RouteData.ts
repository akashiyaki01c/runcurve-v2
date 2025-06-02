import { Route } from "../model/Route";
import { Vehicle } from "../model/Vehicle";

/** 路線上の1mごとの曲線半径を求める関数 */
export function GetCurveRadius(route: Route, vehicle: Vehicle, start: number, end: number) {
	const result: number[] = [...Array(end - start)].map(_ => 0);

	for (const curve of route.curves) {
		// 曲線がstart-endの範囲外
		if (end < curve.start) continue;
		if (curve.end < start) continue;

		const curveStart = (start < curve.start ? curve.start : start) - start;
		const curveEnd = (curve.end < end ? curve.end : end) - start;

		for (let i = curveStart; i < curveEnd; i++) {
			result[i] = curve.radius;
		}
	}

	return result;
}

/** 路線上の1mごとの勾配値を求める関数 */
export function GetGradient(route: Route, vehicle: Vehicle, start: number, end: number) {
	const gradients = route.gradients.sort((a, b) => a.position - b.position);
	const result: number[] = [...Array(end - start)].map(_ => 0);

	for (const gradient of gradients) {
		if (end < gradient.position) continue;
		const gradientPosition = (start < gradient.position ? gradient.position : start) - start;

		for (let i = gradientPosition; i < result.length; i++) {
			result[i] = gradient.value;
		}
	}

	return result;
}

/** 路線上の1mごとの曲線半径を求める関数 */
export function GetTunnel(route: Route, vehicle: Vehicle, start: number, end: number) {
	const result: number[] = [...Array(end - start)].map(_ => 0);

	for (const tunnel of route.tunnels) {
		// 曲線がstart-endの範囲外
		if (end < tunnel.start) continue;
		if (tunnel.end < start) continue;

		const curveStart = (start < tunnel.start ? tunnel.start : start) - start;
		const curveEnd = (tunnel.end < end ? tunnel.end : end) - start;

		for (let i = curveStart; i < curveEnd; i++) {
			result[i] = tunnel.type == "double" ? 1 : 2;
		}
	}
	return result;
}