
/**
 * 路線データを表す
 */
export class Route {
	/** 路線名 */
	name: string = "";
	gradients: Gradient[] = [];
	curves: Curve[] = [];
	tunnels: Tunnel[] = [];
	limitSpeeds: LimitSpeed[] = [];
	stopPositions: StopPosition[] = [];
}

/** 勾配データ */
export class Gradient {
	/** 勾配変更点 */
	position: number = 0;
	/** 勾配度 [‰] 上りが正,下りが負 */
	value: number = 0;
}

/** 曲線データ */
export class Curve {
	/** 曲線起点 */
	start: number = 0;
	/** 曲線終点 */
	end: number = 0;
	/** 曲線半径 [m] */
	radius: number = 0;
	/** 曲線方向 */
	direction: "left" | "right" = "left";
	/** 制限速度 [km/h] */
	speed: number = 0;
}

/** トンネルデータ */
export class Tunnel {
	/** トンネル名 */
	name: string = "";
	/** トンネル開始地点 */
	start: number = 0;
	/** トンネル終了地点 */
	end: number = 0;
	/** トンネル種別 */
	type: "single" | "double" = "double";
}

/** 制限速度データ */
export class LimitSpeed {
	/** 制限速度開始地点 */
	start: number = 0;
	/** 制限速度終了地点 */
	end: number = 0;
	/** 制限速度 [km/h] */
	speed: number = 0;
}

/** 停止位置データ */
export class StopPosition {
	/** 停止位置 */
	position: number = 0;
	/** 駅名 */
	stationName: string = "";
	/** 番線名 */
	trackName: string = "";
	/** 通過するか */
	isPass: boolean = false;
}

export const TestRoute: Route = {
	name: "西神線",
	gradients: [
		{ position: 455, value: -24.0 },
		{ position: 1455, value: 0.0 },
		{ position: 1791, value: -29.939 },
		{ position: 4415, value: 2 },
		{ position: 5080, value: -16 },
		{ position: 5450, value: -5 },
		{ position: 5650, value: 2 }
	],
	curves: [
		{ start: 60, end: 80, direction: "left", radius: 1500, speed: 0 },
		{ start: 140, end: 225, direction: "left", radius: 1000, speed: 0 },
		{ start: 590, end: 820, direction: "left", radius: 601, speed: 0 },
		{ start: 1400, end: 1510, direction: "left", radius: 797, speed: 0 },
		{ start: 1930, end: 2230, direction: "left", radius: 821, speed: 0 },
		{ start: 2530, end: 2600, direction: "left", radius: 30001, speed: 0 },
		{ start: 3219, end: 3570, direction: "left", radius: 998, speed: 0 },
		{ start: 3896, end: 3940, direction: "left", radius: 500, speed: 0 },
		{ start: 4240, end: 4300, direction: "left", radius: 400, speed: 0 },
		{ start: 4620, end: 4640, direction: "left", radius: 1200, speed: 0 },
		{ start: 4710, end: 4730, direction: "left", radius: 1200, speed: 0 },
		{ start: 4980, end: 5330, direction: "left", radius: 297, speed: 0 },
		{ start: 5610, end: 5630, direction: "left", radius: 300, speed: 0 },
	],
	tunnels: [
		/* { name: "落合隧道", start: 300, end: 1573, type: "double" },
		{ name: "トンネル部", start: 1841, end: 5771, type: "double" }, */

		/* { name: "トンネル部", start: 0, end: 5000, type: "double" }, */
	],
	limitSpeeds: [
		/* { start: 0, end: 605, speed: 45 },
		{ start: 1716-100, end: 1716, speed: 45 },
		{ start: 4627-100, end: 4627, speed: 45 },
		{ start: 4129, end: 5861, speed: 60 }, */

		/* { start: 672, end: 742, speed: 60 },
		{ start: 742, end: 864, speed: 45 },
		{ start: 864, end: 988, speed: 25 },
		{ start: 988, end: 1013, speed: 15 } */
		/* [672, 741, 60],
	[742, 863, 45],
	[863, 987, 25],
	[988, 1012, 15] */

		{ start: 1250, end: 1470, speed: 100 },
		{ start: 1470, end: 1730, speed: 70 },
		{ start: 1730, end: 1870, speed: 50 },
		{ start: 1870, end: 2000, speed: 30 },
	],
	stopPositions: [
		/* { position: 151, stationName: "名谷", trackName: "1番線", isPass: false },
		{ position: 1716, stationName: "妙法寺", trackName: "1番線", isPass: false },
		{ position: 4627, stationName: "板宿", trackName: "1番線", isPass: false },
		{ position: 5813, stationName: "新長田", trackName: "1番線", isPass: false } */

		{ position: 0, stationName: "福島", trackName: "1番線", isPass: false },
		{ position: 2000, stationName: "梅田", trackName: "1番線", isPass: false }
	],
};