import { Route } from "../model/Route";
import { Vehicle } from "../model/Vehicle";
import { GetRuncurveSpeedAndTime } from "./GetRuncurveSpeed";

export function GetRuncurveLine(route: Route, vehicle: Vehicle, maxSpeed: number) {
	const result = [];

	for (const stas of pairwiseSplit(route.stopPositions.filter(v => !v.isPass))) {
		const start = stas[0].position;
		const end = stas[1].position;
		result.push(GetRuncurveSpeedAndTime(route, vehicle, start, end, maxSpeed));
	}
	return result;

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
}