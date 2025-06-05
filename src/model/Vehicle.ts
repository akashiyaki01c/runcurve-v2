/** 車両データ */
export class Vehicle {
    /** 車両名 */
    name: string = "";
    /** 最高速度 */
    maxSpeed: number = 0;
    /** 編成両数 */
    numberOfCars: number = 0;
    /** 編成長 */
    trainLength: number = 0;
    /** 編成重量 */
    trainWeight: number = 0;
    /** 編成定員 */
    capacity: number = 0;
    /** 1人あたり重量 [kg] */
    humanWeight: number = 0;
    /** 乗車率 [%] */
    occupancyRate: number = 0;
    /** ユニット数 */
    unitCount: number = 0;

    /** 起動加速度 [km/h/s] */
    startupAcceleration: number = 0;
    /** 減速度 [km/h/s] */
    deceleration: number = 0;
    /** 定トルク領域終了速度[km/h] */
    fixedTorqueSpeed: number = 0;
    /** 定出力領域終了速度[km/h] */
    constantPowerSpeed: number = 0;
    /** M車の両数 */
    mCars: number = 0;
    /** T車の両数 */
    tCars: number = 0;
    /** M車の重量 [t] */
    mWeight: number = 0;
    /** T車の重量 [t] */
    tWeight: number = 0;
    /** 定出力領域の定数 */
    coefficient0: number = 0;
    /** 特性領域の定数 */
    coefficient1: number = 0;

    /** 加速時の引張力データ */
    accelerationForce: VelocityForceTable = new VelocityForceTable;
    /** 減速時の引張力データ */
    decelerationForce: VelocityForceTable = new VelocityForceTable;
    /** 走行抵抗データ */
    runningResist: VelocityForceTable = new VelocityForceTable;
}

/** 速度-引張力の表 */
export class VelocityForceTable {
    /** 速度[km/h], 引張力[N] の配列 */
    value: [number, number][] = [];
}
/** 速度-引張力の表を補間する */
export function ForceInterpolation(data: VelocityForceTable, speed: number) {
    for (let i = 0; i < data.value.length - 1; i++) {
        const [x1, y1] = data.value[i];
        const [x2, y2] = data.value[i + 1];

        if (x1 <= speed && speed <= x2) {
            // 線形補間
            const t = (speed - x1) / (x2 - x1);
            return y1 + t * (y2 - y1);
        }
    }
    return data.value[data.value.length - 1][1]
}

export const TestVehicle: Vehicle = {
    name: "6000形",
    maxSpeed: 100,
    numberOfCars: 6,
    trainLength: 19.5 * 6,
    trainWeight: 184.4,
    capacity: 808,
    humanWeight: 55,
    occupancyRate: 100,
    unitCount: 3,

    startupAcceleration: 2.5,
    fixedTorqueSpeed: 60,
    constantPowerSpeed: 80,
    mCars: 3,
    tCars: 3,
    mWeight: 42.1,
    tWeight: 33.4,
    coefficient0: 1,
    coefficient1: 2,

    deceleration: 2.5,

    accelerationForce: {
        /* value: defaultTractiveForce(3, 30, 70, 100, 3, 3, 33.4, 42.1, 1, 2) */
        value: defaultTractiveForce(2.5, 60, 80, 100, 3, 3, 33.4, 42.1, 1, 2)
    },
    decelerationForce: {
        value: [
            [0, (2.5 / 3.6) * (184.4) * 1000 / 9.807]
        ]
    },
    runningResist: {
        value: defaultRunningResistance(3, 3, 33.4, 42.1, 100)
    }
};

// デフォルトの走行抵抗を返す関数
// mCars/tCars: M車/T車の両数
// mWeight/tWeight: M車/T車の重量[t]
// maxSpeed: 最高速度[km/h]
// => 1km/h刻みの編成走行抵抗[kgf]
function defaultRunningResistance(mCars: number, tCars: number, mWeight: number, tWeight: number, maxSpeed: number): [number, number][] {
    let result: [number, number][] = [];
    for (let i = 0; i < maxSpeed; i++) {
        let motorCarResistance = (1.65 + 0.0247 * i) * (mCars * mWeight);
        let trailerCarResistance = (0.78 + 0.028 * i) * (tCars * tWeight);
        let airResistance = (0.028 + 0.0078 * (mCars + tCars - 1) * i ** 2);
        result.push([i, (motorCarResistance + trailerCarResistance + airResistance)]);
    }
    // 出発抵抗を考慮
    result[0][1] += 3 * (mCars * mWeight + tCars * tWeight);
    result[1][1] += 2 * (mCars * mWeight + tCars * tWeight);
    result[2][1] += 1 * (mCars * mWeight + tCars * tWeight);

    return result;
}

// デフォルトの引張力曲線を返す関数(VVVF車)
// : cref https://sites.google.com/view/fwchbve/top/bveデータ公開以外/車両データ作成/性能の作り方vvvf編その1引張力計算
// startupAcceleration: 起動加速度[km/h/s]
// fixedTorqueSpeed: 定トルク領域終了速度[km/h]
// constantPowerSpeed: 定出力領域終了速度[km/h]
// maxSpeed: 最高速度[km/h]
// mCars/tCars: M車/T車の両数
// mWeight/tWeight: M車/T車の重量 [t]
// coefficient0/coefficient1: 定出力領域/特性領域の定数
// => 1km/h刻みの編成引張力曲線[kgf]
function defaultTractiveForce(
    startupAcceleration: number,
    fixedTorqueSpeed: number,
    constantPowerSpeed: number,
    maxSpeed: number,
    mCars: number, tCars: number, mWeight: number, tWeight: number,
    coefficient0: number, coefficient1: number
) {
    let result: [number, number][] = []; // kgf

    { // 定トルク領域 [0..fixedTorqueSpeed)
        // 編成重量[kg] * 起動加速度[m/s^2] / 9.807 = F[kgf]
        let fixedTorque = (startupAcceleration / 3.6) * (mCars * mWeight + tCars * tWeight) * 1000 / 9.807;
        for (let i = 0; i < fixedTorqueSpeed; i++) {
            result.push([i, fixedTorque]);
        }
    }

    { // 定出力領域 [fixedTorqueSpeed..constantPowerSpeed)
        let constant = fixedTorqueSpeed ** coefficient0 * result[result.length - 1][1];
        for (let i = fixedTorqueSpeed; i < constantPowerSpeed; i++) {
            result.push([i, constant / i ** coefficient0]);
        }
    }

    { // 特性領域 [constantPowerSpeed..maxSpeed)
        let constant = constantPowerSpeed ** coefficient1 * result[result.length - 1][1];
        for (let i = constantPowerSpeed; i < maxSpeed; i++) {
            result.push([i, constant / i ** coefficient1]);
        }
    }

    return result;
}

export function SetForceData(vehicle: Vehicle): Vehicle {
    vehicle.accelerationForce = {
        value: defaultTractiveForce(
            vehicle.startupAcceleration,
            vehicle.fixedTorqueSpeed,
            vehicle.constantPowerSpeed,
            vehicle.maxSpeed,
            vehicle.mCars,
            vehicle.tCars,
            vehicle.mWeight,
            vehicle.tWeight,
            vehicle.coefficient0,
            vehicle.coefficient1)
    }
    vehicle.decelerationForce = { value: [[0, (vehicle.deceleration / 3.6) * vehicle.trainWeight * 1000 / 9.807]] }
    vehicle.runningResist = { value: defaultRunningResistance(vehicle.mCars, vehicle.tCars, vehicle.mWeight, vehicle.tWeight, vehicle.maxSpeed) }
    return vehicle
}