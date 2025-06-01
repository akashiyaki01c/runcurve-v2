export class RuncurveResult {
	notches: [number, NotchType][] = [];
	runcurveArray: Runcurve[] = [];
}

export class Runcurve {
	distance: number = 0;
	speed: number = 0;
	time: number = 0;
}

export type NotchType = "Power" | "Brake" | "NotchOff" | "Constant";