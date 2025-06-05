
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
		{ position: -10264, value: 0.0 },
		{ position: -8964, value: -34.0 },
		{ position: -8173, value: 0.0 },
		{ position: -7852, value: 30.0 },
		{ position: -6952, value: 0.0 },
		{ position: -6402, value: -20.0 },
		{ position: -6131, value: -30.0 },
		{ position: -5155, value: 0.0 },
		{ position: -4673, value: 27.0 },
		{ position: -3496, value: 0.0 },
		{ position: -3140, value: 27.0 },
		{ position: -2497, value: -2.0 },
		{ position: -1895, value: 0.0 },
		{ position: -1230, value: -20.0 },
		{ position: -990, value: 0.0 },
		{ position: 455, value: -24.0 },
		{ position: 1455, value: 0.0 },
		{ position: 1791, value: -29.939 },
		{ position: 4415, value: 2 },
		{ position: 5080, value: -16 },
		{ position: 5450, value: -5 },
		{ position: 5650, value: 2 },
		{ position: 6140, value: -7 },
		{ position: 6376, value: -2 },
		{ position: 6832, value: 2 },
		{ position: 7000, value: 26 },
		{ position: 7215, value: -2 },
		{ position: 7400, value: 5 },
		{ position: 7680, value: -15 },
		{ position: 7855, value: -2 },
		{ position: 8125, value: 2 },
		{ position: 8483, value: -5 },
		{ position: 8980, value: 2 },
		{ position: 9255, value: 30 },
		{ position: 9519, value: -5 },
		{ position: 9975, value: -2 },
		{ position: 10340, value: 33 },
		{ position: 10885, value: -27 },
		{ position: 11075, value: -2 },
		{ position: 11362, value: -33 },
		{ position: 11538, value: -20 },
		{ position: 11720, value: -17 },
		{ position: 11870, value: 2 },
		{ position: 12227, value: 29 },
		{ position: 12500, value: 2 },
		{ position: 12700, value: 33 },
		{ position: 12920, value: 34 },
		{ position: 13051, value: 5 },
		{ position: 13275, value: 0 },
		{ position: 13380 + 111, value: 5 },
		{ position: 13380 + 307, value: 33.3 },
		{ position: 13380 + 6854, value: 9 },
		{ position: 13380 + 7477, value: 0 },
		{ position: 13380 + 7658, value: 5 },
	],
	curves: [
		{ start: 60, end: 80, direction: "right", radius: 1500, speed: 0 },
		{ start: 140, end: 225, direction: "right", radius: 1000, speed: 0 },
		{ start: 590, end: 820, direction: "right", radius: 601, speed: 0 },
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
		{ start: 5705, end: 5725, direction: "left", radius: 500, speed: 0 },
		{ start: 5797, end: 5819, direction: "left", radius: 500, speed: 0 },
		{ start: 5867, end: 5908, direction: "left", radius: 1855, speed: 0 },
		{ start: 6272, end: 6614, direction: "left", radius: 367, speed: 0 },
		{ start: 6614, end: 6734, direction: "left", radius: 597, speed: 0 },
		{ start: 6734, end: 6783, direction: "left", radius: 256, speed: 0 },
		{ start: 6973, end: 7160, direction: "left", radius: 165, speed: 0 },
		{ start: 7321, end: 7417, direction: "left", radius: 3500, speed: 0 },
		{ start: 7623, end: 7646, direction: "left", radius: 1600, speed: 0 },
		{ start: 8006, end: 8033, direction: "left", radius: 3000, speed: 0 },
		{ start: 8260, end: 8260, direction: "left", radius: 1900, speed: 0 },
		{ start: 8601, end: 8622, direction: "left", radius: 3000, speed: 0 },
		{ start: 9053, end: 9133, direction: "left", radius: 700, speed: 0 },
		{ start: 9290, end: 9360, direction: "left", radius: 550, speed: 0 },
		{ start: 9840, end: 9920, direction: "left", radius: 420, speed: 0 },
		{ start: 10110, end: 10130, direction: "left", radius: 1200, speed: 0 },
		{ start: 10205, end: 10290, direction: "left", radius: 1200, speed: 0 },
		{ start: 10480, end: 10610, direction: "left", radius: 422, speed: 0 },
		{ start: 10990, end: 11010, direction: "left", radius: 2000, speed: 0 },
		{ start: 11110, end: 11170, direction: "left", radius: 500, speed: 0 },
		{ start: 11260, end: 11290, direction: "left", radius: 650, speed: 0 },
		{ start: 11525, end: 11590, direction: "left", radius: 418, speed: 0 },
		{ start: 11910, end: 11944, direction: "left", radius: 230, speed: 0 },
		{ start: 12180, end: 12280, direction: "left", radius: 150, speed: 0 },
		{ start: 12400, end: 12500, direction: "left", radius: 1203, speed: 0 },
		{ start: 12720, end: 12820, direction: "left", radius: 553, speed: 0 },
		{ start: 13030, end: 13070, direction: "left", radius: 1500, speed: 0 },
		{ start: 13270, end: 13300, direction: "left", radius: 5530, speed: 0 },

		{ start: 13380 + 250, end: 13380 + 906, direction: "left", radius: 800, speed: 0 },
		{ start: 13380 + 2279, end: 13380 + 2743, direction: "left", radius: 2000, speed: 0 },
		{ start: 13380 + 6200, end: 13380 + 7137, direction: "left", radius: 600, speed: 0 },
	],
	tunnels: [
		{ name: "落合隧道", start: 300, end: 1573, type: "double" },
		{ name: "トンネル部", start: 1841, end: 5771, type: "double" },
	],
	limitSpeeds: [

		{ start: -9194, end: 151, speed: 90 },
		{ start: 151, end: 20972, speed: 75 },

		{ start: -3793, end: -3525, speed: 60 },
		{ start: -3525, end: -3288, speed: 45 },
		
		{ start: -1700, end: -1100, speed: 75 },

		{ start: -650, end: -208, speed: 75 },
		{ start: -208, end: 22, speed: 45 },
		{ start: 22, end: 151, speed: 25 },

		{ start: 151, end: 605, speed: 45 },
		{ start: 4129, end: 5861, speed: 60 },

		{ start: 6551, end: 6900, speed: 60 },
		{ start: 6900, end: 7402, speed: 45 },
		{ start: 9677, end: 10150, speed: 60 },
		{ start: 11700, end: 12050, speed: 60 },
		{ start: 12050, end: 12411, speed: 45 },
		{ start: 12879, end: 13465, speed: 45 },
		{ start: 13366, end: 13416, speed: 25 },

		{ start: 13380 + 7000, end: 13380 + 7180, speed: 60 },
		{ start: 13380 + 7180, end: 13380 + 7430, speed: 45 },
		{ start: 13380 + 7430, end: 13380 + 7580, speed: 25 },
		{ start: 13380 + 7580, end: 13380 + 7700, speed: 15 },

		{ start: -6647 - 100, end: -6647 + 20, speed: 45 },
		{ start: -4984 - 100, end: -4984 + 20, speed: 45 },
		{ start: -3313 - 100, end: -3313 + 20, speed: 45 },
		{ start: -1645 - 100, end: -1645 + 20, speed: 45 },
		{ start: 1716 - 100, end: 1716 + 20, speed: 45 },
		{ start: 4627 - 100, end: 4627 + 20, speed: 45 },
		{ start: 7365 - 100, end: 7365 + 20, speed: 45 },
		{ start: 8179 - 100, end: 8179 + 20, speed: 45 },
		{ start: 9115 - 100, end: 9115 + 20, speed: 45 },
		{ start: 11280 - 100, end: 11280 + 20, speed: 45 },
		{ start: 12100 - 100, end: 12100 + 20, speed: 45 },
	],
	stopPositions: [
		{ position: -9194, stationName: "西神中央", trackName: "2番線", isPass: false },
		{ position: -6647, stationName: "西神南", trackName: "1番線", isPass: true },
		{ position: -4984, stationName: "伊川谷", trackName: "1番線", isPass: true },
		{ position: -3313, stationName: "学園都市", trackName: "1番線", isPass: false },
		{ position: -1645, stationName: "総合運動公園", trackName: "1番線", isPass: true },
		{ position: 151, stationName: "名谷", trackName: "1番線", isPass: false },
		{ position: 1716, stationName: "妙法寺", trackName: "1番線", isPass: true },
		{ position: 4627, stationName: "板宿", trackName: "1番線", isPass: true },
		{ position: 5813, stationName: "新長田", trackName: "1番線", isPass: false },
		{ position: 7365, stationName: "長田", trackName: "1番線", isPass: true },
		{ position: 8179, stationName: "上沢", trackName: "1番線", isPass: true },
		{ position: 9115, stationName: "湊川公園", trackName: "1番線", isPass: false },
		{ position: 10140, stationName: "大倉山", trackName: "1番線", isPass: true },
		{ position: 11280, stationName: "県庁前", trackName: "1番線", isPass: true },
		{ position: 12100, stationName: "三宮", trackName: "1番線", isPass: false },
		{ position: 13416, stationName: "新神戸", trackName: "1番線", isPass: false },
		{ position: 20972, stationName: "谷上", trackName: "4番線", isPass: false },
	],
};