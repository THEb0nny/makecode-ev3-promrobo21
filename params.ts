namespace custom {

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

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyLineFollowParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden="true"
    //% weight="99"
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
    //% weight="98"
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
    //% weight="97"
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
    //% weight="96"
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
    //% weight="95"
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

namespace custom {

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
    //% block="speed = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp"
    //% block.loc.ru="скорость = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp"
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
    //% block="speed = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp| leftKd = $newLeftKd| rightKd = $newRightKd|| leftN = $newLeftN| rightN = $newLeftN"
    //% block.loc.ru="скорость = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp| leftKd = $newLeftKd| rightKd = $newRightKd|| leftN = $newLeftN| rightN = $newLeftN"
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
    //% block="speed = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp| leftKi = $newLeftKi| rightKi = $newRightKi| leftKd = $newLeftKd| rightKd = $newRightKd|| leftN = $newLeftN| rightN = $newLeftN"
    //% block.loc.ru="скорость = $newSpeed\\%| leftKp = $newLeftKp| rightKp = $newRightKp| leftKi = $newLeftKi| rightKi = $newRightKi| leftKd = $newLeftKd| rightKd = $newRightKd|| leftN = $newLeftN| rightN = $newLeftN"
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