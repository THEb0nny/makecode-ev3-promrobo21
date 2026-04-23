namespace params {

    // Интерфейс перадачи параметров для алгоритма движения по линии с ускорениями и замедлениями
    export interface RampLineFollow {
        vStart?: number;
        vMax?: number;
        vFinish?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newMinStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newMinFihishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetRampLineFollow2SensorParams"
    //% block="set line follow params at start v = $newMinStartV\\% max = $newMaxV\\% final = $newMinFihishV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="установить параметры движения по линии при начальной v = $newMinStartV\\% макс = $newMaxV\\% конечной = $newMinFihishV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function setRampLineFollow2SensorParams(newMinStartV: number, newMaxV: number, newMinFihishV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number) {
        if (newMinStartV) motions.rampLineFollowToDistance2SensorStartV = newMinStartV;
        if (newMaxV) motions.rampLineFollowToDistance2SensorMaxV = newMaxV;
        if (newMinFihishV) motions.rampLineFollowToDistance2SensorFinishV = newMinFihishV;
        if (newKp) motions.rampLineFollowToDistance2SensorKp = newKp;
        if (newKi) motions.rampLineFollowToDistance2SensorKi = newKi;
        if (newKd) motions.rampLineFollowToDistance2SensorKd = newKd;
        if (newKf) motions.rampLineFollowToDistance2SensorKf = newKf;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="RampLineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowEmptyParams(): RampLineFollow {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     */
    //% blockId="RampLineFollowThreeParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finally $newFinishV\\%"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowThreeParams(newStartV: number, newMaxV: number, newFinishV: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     */
    //% blockId="RampLineFollowFourParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowFourParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowSixParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowSixParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number, newKd?: number, newKf?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp,
            Kd: newKd,
            Kf: newKf
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowAllParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowAllParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            Kf: newKf
        };
    }

    // Интерфейс перадачи параметров для алгоритма движения по линии с ускорениями и замедлениями до перекрёстка
    export interface RampLineFollowToCross {
        vStart?: number;
        vMax?: number;
        vAfterDist?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

}