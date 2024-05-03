namespace params {

    // Интерфейс перадачи параметров для алгоритма движения по линии
    export interface LineFollowInterface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    // Интерфейс перадачи параметров для алгоритма позиционирования на линии
    export interface LinePositioningInterface {
        maxSpeed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    // export let lineFollow2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    // export let lineFollow2SensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    // export let lineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    // export let lineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    // export let lineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    /*
    if (!newSpeed && !newKp && !newKi && !newKd && !newN) {
        return null;
    } else if (newSpeed && !newKp && !newKi && !newKd && !newN) {
        return { speed: newSpeed };
    } else if (newSpeed && newKp && !newKi && !newKd && !newN) {
        return { speed: newSpeed, Kp: newKp };
    } else if (newSpeed && newKp && newKi && !newKd && !newN) {
        return { speed: newSpeed, Kp: newKp, Ki: newKi };
    } else if (newSpeed && newKp && newKi && newKd && !newN) {
        return { speed: newSpeed, Kp: newKp, Ki: newKi, Kd: newKd };
    }
    return { speed: newSpeed, Kp: newKp, Ki: newKi, Kd: newKd, N: newN };
    */

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetLineFollowParams"
    //% block="speed = $newSpeed\\%|| Kp = $newKp| Ki = $newKi| Kd = $newKd| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%|| Kp = $newKp| Ki = $newKi| Kd = $newKd| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="99"
    //% group="Параметры линии"
    export function SetLineFollowParams(newSpeed: number, newKp?: number, newKi?: number, newKd?: number, newN?: number) {
        if (newSpeed) motions.lineFollow2SensorSpeed = newSpeed;
        if (newKp) motions.lineFollow2SensorKp = newSpeed;
        if (newKi) motions.lineFollow2SensorKi = newSpeed;
        if (newKd) motions.lineFollow2SensorKd = newSpeed;
        if (newN) motions.lineFollow2SensorN = newSpeed;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyLineFollowParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden="true"
    //% weight="98"
    //% group="Параметры линии"
    export function SetEmptyLineFollowParams(): LineFollowInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     */
    //% blockId="SetOneLineFollowParams"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% weight="97"
    //% group="Параметры линии"
    export function SetOneLineFollowParams(newSpeed?: number): LineFollowInterface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="SetTwoLineFollowParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="96"
    //% group="Параметры линии"
    export function SetTwoLineFollowParams(newSpeed?: number, newKp?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetFourLineFollowParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="95"
    //% group="Параметры линии"
    export function SetFourLineFollowParams(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Kd: newKd,
            N: newN
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetAllLineFollowParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="94"
    //% group="Параметры линии"
    export function SetAllLineFollowParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            N: newN
        };
    }

}

namespace params {

    // Интерфейс перадачи параметров для алгоритма выравнивания на линии
    export interface LineAlignmentInterface {
        maxSpeed?: number;
        leftKp?: number;
        rightKp?: number;
        leftKi?: number;
        rightKi?: number;
        leftKd?: number;
        rightKd?: number;
        leftN?: number;
        rightN?: number;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyLineAlignmentParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden="true"
    //% weight="99"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetEmptyLineAlignmentParams(): LineAlignmentInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     */
    //% blockId="SetOneLineAlignmentParams"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% weight="98"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetOneLineAlignmentParams(newSpeed?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="SetTwoLineSetThreeLineAlignmentParamsAlignmentParams"
    //% block="speed = $newSpeed\\%| left Kp = $newLeftKp| right Kp = $newRightKp"
    //% block.loc.ru="скорость = $newSpeed\\%| левая Kp = $newLeftKp| правая Kp = $newRightKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="97"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetThreeLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed,
            leftKp: newLeftKp,
            rightKp: newRightKp
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetSevenLineAlignmentParams"
    //% block="speed = $newSpeed\\%| left side Kp = $newLeftKp| Kd = $newLeftKd| N = $newLeftN| right Kp = $newRightKp| Kd = $newRightKd| N = $newLeftN"
    //% block.loc.ru="скорость = $newSpeed\\%| левая сторона Kp = $newLeftKp| Kd = $newLeftKd| N = $newLeftN| правая Kp = $newRightKp| Kd = $newRightKd| N = $newLeftN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="96"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetSevenLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed,
            leftKp: newLeftKp,
            rightKp: newRightKp,
            leftKd: newLeftKd,
            rightKd: newRightKd,
            leftN: newLeftN,
            rightN: newRightN
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetAllLineAlignmentParams"
    //% block="speed = $newSpeed\\%| left side Kp = $newLeftKp| Ki = $newLeftKi| Kd = $newLeftKd| N = $newLeftN| right Kp = $newRightKp| Ki = $newRightKi| Kd = $newRightKd| N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%| левая сторона Kp = $newLeftKp| Ki = $newLeftKi| Kd = $newLeftKd| N = $newLeftN| правая Kp = $newRightKp| Ki = $newRightKi| Kd = $newRightKd| N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="95"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetAllLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKi?: number, newRightKi?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed,
            leftKp: newLeftKp,
            rightKp: newRightKp,
            leftKi: newLeftKi,
            rightKi: newLeftKi,
            leftKd: newLeftKd,
            rightKd: newRightKd,
            leftN: newLeftN,
            rightN: newRightN
        };
    }

}