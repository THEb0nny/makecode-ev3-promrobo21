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
     * @param newSpeed скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetLineFollowParams"
    //% block="speed = $newSpeed\\%||Kp = $newKp|Ki = $newKi|Kd = $newKd|N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%||Kp = $newKp|Ki = $newKi|Kd = $newKd|N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками"
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
    //% blockId="EmptyLineFollowParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии"
    export function EmptyLineFollowParams(): LineFollowInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     */
    //% blockId="OneLineFollowParams"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% weight="88"
    //% group="Параметры движения по линии"
    export function OneLineFollowParams(newSpeed?: number): LineFollowInterface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="TwoLineFollowParams"
    //% block="speed = $newSpeed\\% Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="87"
    //% group="Параметры движения по линии"
    export function TwoLineFollowParams(newSpeed?: number, newKp?: number): LineFollowInterface {
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
    //% block="speed = $newSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="86"
    //% group="Параметры движения по линии"
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
    //% blockId="AllLineFollowParams"
    //% block="speed = $newSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="85"
    //% group="Параметры движения по линии"
    export function AllLineFollowParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInterface {
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
        timeOut?: number;
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
     * Setting parameters for the alignment algorithm on the line perpendicular with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Установка параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed скорость движения, eg: 50
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKi интегральный коэффицент левой стороны, eg: 0
     * @param newRightKi интегральный коэффицент правой стороны, eg: 0
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftN коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightN коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="SetLineAlignmentParams"
    //% block="speed = $newSpeed\\%||left side Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|right Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%||левая сторона Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|правая Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% weight="99"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetLineAlignmentParams(newSpeed: number, newLeftKp?: number, newRightKp?: number, newLeftKi?: number, newRightKi?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number) {
        if (newSpeed) levelings.lineAlignmentMaxSpeed = newSpeed;
        if (newLeftKp) levelings.lineAlignmentLeftSideKp = newLeftKp;
        if (newRightKp) levelings.lineAlignmentRightSideKp = newRightKp;
        if (newLeftKi) levelings.lineAlignmentLeftSideKi = newLeftKi;
        if (newRightKi) levelings.lineAlignmentRightSideKi = newRightKi;
        if (newLeftKd) levelings.lineAlignmentLeftSideKd = newLeftKd;
        if (newRightKd) levelings.lineAlignmentRightSideKd = newRightKd;
        if (newLeftN) levelings.lineAlignmentLeftSideN = newLeftN;
        if (newRightN) levelings.lineAlignmentRightSideN = newRightN;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="EmptyLineAlignmentParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function EmptyLineAlignmentParams(): LineAlignmentInterface {
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
    //% weight="88"
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
    //% blockId="ThreeLineAlignmentParams"
    //% block="speed = $newSpeed\\%| left side Kp = $newLeftKp|right Kp = $newRightKp"
    //% block.loc.ru="скорость = $newSpeed\\%| левая сторона Kp = $newLeftKp|правая Kp = $newRightKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="8878"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function ThreeLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number): LineAlignmentInterface {
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
    //% blockId="SevenLineAlignmentParams"
    //% block="speed = $newSpeed\\%|left side Kp = $newLeftKp Kd = $newLeftKd N = $newLeftN|right Kp = $newRightKp Kd = $newRightKd N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%|левая сторона Kp = $newLeftKp Kd = $newLeftKd N = $newLeftN|правая Kp = $newRightKp Kd = $newRightKd N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="86"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SevenLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
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
    //% blockId="AllLineAlignmentParams"
    //% block="speed = $newSpeed\\%|left side Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|right Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%|левая сторона Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|правая Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newLeftKp.defl="1"
    //% newRightKp.defl="1"
    //% weight="85"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function AllLineAlignmentParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKi?: number, newRightKi?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
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