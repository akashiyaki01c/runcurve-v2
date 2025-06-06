
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
	name: "テスト線",
	gradients: [
		{ position: 1000, value: 35 },
		{ position: 2000, value: -35 },
		{ position: 2500, value: 0 },
	],
	curves: [
		{ start: 1200, end: 1400, direction: "left", radius: 600, speed: 0 },
		{ start: 2400, end: 2600, direction: "right", radius: 600, speed: 0 },
	],
	tunnels: [
	],
	limitSpeeds: [
		{ start: 12100 - 100, end: 12100 + 20, speed: 45 },
	],
	stopPositions: [
		{ position: 0, stationName: "A駅", trackName: "1番線", isPass: false },
		{ position: 1800, stationName: "B駅", trackName: "1番線", isPass: true },
		{ position: 3000, stationName: "C駅", trackName: "1番線", isPass: false },
	],
};