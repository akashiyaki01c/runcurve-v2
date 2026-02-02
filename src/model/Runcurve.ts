/** ランカーブの算出結果 */
export class RuncurveResult {
	notches: NotchOperate[] = [];
	runcurveArray: Runcurve[] = [];
}

/** ランカーブの距離ごとの算出結果 */
export class Runcurve {
	distance: number = 0;
	speed: number = 0;
	time: number = 0;
}

/** ノッチの操作履歴 */
export class NotchOperate {
	distance: number = 0;
	type: NotchType = "NotchOff";
	detail?: string;
}

/** ノッチの種類 */
export type NotchType = "Power" | "Brake" | "NotchOff" | "Constant";