import { Route, StopPosition } from "../model/Route";
import { RuncurveResult } from "../model/Runcurve";
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

export function GetRuncurveLineTime(route: Route, vehicle: Vehicle, runcurve: RuncurveResult[]): TimeResult[] {
	const result = [];

	for (const rc of runcurve) {
		result.push(...splitTime(rc, route));
	}

	console.log(result);

	return result.sort((a, b) => a.fromStation.position - b.fromStation.position);

	function splitTime(runcurve: RuncurveResult, route: Route) {
		const result = [];

		const start = runcurve.runcurveArray[0]?.distance;
		const end = runcurve.runcurveArray[runcurve.runcurveArray.length - 1]?.distance;

		const splitDistances = route.stopPositions
			.filter((v) => start <= v.position - 1 && v.position <= end + 1);
		if (splitDistances.length < 2) {
			return [{
				fromStation: route.stopPositions.find(v => v.position === start)!,
				toStation: route.stopPositions.find(v => v.position === end + 1)!,
				time: runcurve.runcurveArray[runcurve.runcurveArray.length - 1]?.time!
			}];
		}
		result.push({
			fromStation: route.stopPositions.find(v => v.position === start)!,
			toStation: splitDistances[0],
			time: runcurve.runcurveArray.find(v => v.distance === splitDistances[0].position)?.time!
		});
		for (let i = 1; i < splitDistances.length; i++) {
			const before = splitDistances[i - 1];
			const current = splitDistances[i];

			const beforeTime = runcurve.runcurveArray.find(
				(v) => v.distance === before.position
			);
			const currentTime = runcurve.runcurveArray.find(
				(v) => v.distance === current.position - 1
			);

			result.push({
				fromStation: before,
				toStation: current,
				time: (currentTime?.time || 0) - (beforeTime?.time || 0)
			});
		}

		return result;
	}
}

export type TimeResult = {
	fromStation: StopPosition;
	toStation: StopPosition;
	time: number;
};