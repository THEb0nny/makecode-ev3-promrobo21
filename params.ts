namespace params {

    // Интерфейс перадачи параметров для алгоритма движения по линии
    export interface LineFollowInterface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetLineFollow2SensorParams"
    //% block="set line follow params at speed = $newSpeed\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% block.loc.ru="установить параметры движения по линии на скорости = $newSpeed\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками"
    export function SetLineFollow2SensorParams(newSpeed: number, newKp?: number, newKi?: number, newKd?: number, newN?: number) {
        if (newSpeed) motions.lineFollowCrossIntersactionSpeed = newSpeed;
        if (newKp) motions.lineFollowCrossIntersactionKp = newKp;
        if (newKi) motions.lineFollowCrossIntersactionKi = newKi;
        if (newKd) motions.lineFollowCrossIntersactionKd = newKd;
        if (newN) motions.lineFollowCrossIntersactionN = newN;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="LineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии"
    export function LineFollowEmptyParams(): LineFollowInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     * @param newSpeed скорость движения, eg: 50
     */
    //% blockId="LineFollowOneParams"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры движения по линии"
    export function LineFollowOneParams(newSpeed?: number): LineFollowInterface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     * @param newSpeed скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     */
    //% blockId="LineFollowTwoParams"
    //% block="speed = $newSpeed\\% Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры движения по линии"
    export function LineFollowTwoParams(newSpeed?: number, newKp?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="LineFollowFourParams"
    //% block="speed = $newSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры движения по линии"
    export function LineFollowFourParams(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInterface {
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
     * @param newSpeed скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="LineFollowAllParams"
    //% block="speed = $newSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры движения по линии"
    export function LineFollowAllParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInterface {
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

    // Интерфейс перадачи параметров для алгоритма движения по линии с ускорениями и замедлениями
    export interface RampLineFollowInterface {
        startSpeed?: number;
        maxSpeed?: number;
        finishSpeed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newMinStartSpeed начальная скорость движения, eg: 10
     * @param newMaxSpeed максимальная скорость движения, eg: 50
     * @param newMinFihishSpeed конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetRampLineFollow2SensorParams"
    //% block="set line follow params at start speed = $newMinStartSpeed\\% max = $newMaxSpeed\\% final = $newMinFihishSpeed\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% block.loc.ru="установить параметры движения по линии при стартовой скорости = $newMinStartSpeed\\% макс = $newMaxSpeed\\% конечной = $newMinFihishSpeed\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function SetRampLineFollow2SensorParams(newMinStartSpeed: number, newMaxSpeed: number, newMinFihishSpeed: number, newKp?: number, newKi?: number, newKd?: number, newN?: number) {
        if (newMinStartSpeed) motions.rampLineFollow2SensorStartSpeed = newMinStartSpeed;
        if (newMaxSpeed) motions.rampLineFollow2SensorMaxSpeed = newMaxSpeed;
        if (newMinFihishSpeed) motions.rampLineFollow2SensorFinishSpeed = newMinFihishSpeed;
        if (newKp) motions.rampLineFollow2SensorKp = newKp;
        if (newKi) motions.rampLineFollow2SensorKi = newKi;
        if (newKd) motions.rampLineFollow2SensorKd = newKd;
        if (newN) motions.rampLineFollow2SensorN = newN;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="RampLineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function RampLineFollowEmptyParams(): RampLineFollowInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     * @param newStartSpeed начальная скорость движения, eg: 10
     * @param newMaxSpeed максимальная скорость движения, eg: 50
     * @param newFinishSpeed конечная скорость движения, eg: 10
     */
    //% blockId="RampLineFollowThreeParams"
    //% block="start speed = $newStartSpeed\\% max = $newMaxSpeed\\% finally $newFinishSpeed\\%"
    //% block.loc.ru="начальная скорость = $newStartSpeed\\% макс = $newMaxSpeed\\% конечная $newFinishSpeed\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function RampLineFollowThreeParams(newStartSpeed: number, newMaxSpeed: number, newFinishSpeed: number): RampLineFollowInterface {
        return {
            startSpeed: newStartSpeed,
            maxSpeed: newMaxSpeed,
            finishSpeed: newFinishSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     * @param newStartSpeed начальная скорость движения, eg: 10
     * @param newMaxSpeed максимальная скорость движения, eg: 50
     * @param newFinishSpeed конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     */
    //% blockId="RampLineFollowFourParams"
    //% block="min speed = $newStartSpeed\\% max = $newMaxSpeed\\% finaly $newFinishSpeed\\% Kp = $newKp"
    //% block.loc.ru="начальная скорость = $newStartSpeed\\% макс = $newMaxSpeed\\% конечная $newFinishSpeed\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function RampLineFollowFourParams(newStartSpeed: number, newMaxSpeed: number, newFinishSpeed: number, newKp?: number): RampLineFollowInterface {
        return {
            startSpeed: newStartSpeed,
            maxSpeed: newMaxSpeed,
            finishSpeed: newFinishSpeed,
            Kp: newKp
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     * @param newStartSpeed начальная скорость движения, eg: 10
     * @param newMaxSpeed максимальная скорость движения, eg: 50
     * @param newFinishSpeed конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowSixParams"
    //% block="starting speed = $newStartSpeed\\% max = $newMaxSpeed\\% finaly $newFinishSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% block.loc.ru="стартовая скорость = $newStartSpeed\\% макс = $newMaxSpeed\\% конечная $newFinishSpeed\\% Kp = $newKp Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function RampLineFollowSixParams(newStartSpeed: number, newMaxSpeed: number, newFinishSpeed: number, newKp?: number, newKd?: number, newN?: number): RampLineFollowInterface {
        return {
            startSpeed: newStartSpeed,
            maxSpeed: newMaxSpeed,
            finishSpeed: newFinishSpeed,
            Kp: newKp,
            Kd: newKd,
            N: newN
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newStartSpeed начальная скорость движения, eg: 10
     * @param newMaxSpeed максимальная скорость движения, eg: 50
     * @param newFinishSpeed конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowAllParams"
    //% block="starting speed = $newStartSpeed\\% max = $newMaxSpeed\\% finaly $newFinishSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% block.loc.ru="стартовая скорость = $newStartSpeed\\% макс = $newMaxSpeed\\% конечная $newFinishSpeed\\% Kp = $newKp Ki = $newKi Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function RampLineFollowAllParams(newStartSpeed: number, newMaxSpeed: number, newFinishSpeed: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): RampLineFollowInterface {
        return {
            startSpeed: newStartSpeed,
            maxSpeed: newMaxSpeed,
            finishSpeed: newFinishSpeed,
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
    //% block="set line alignment params at speed = $newSpeed\\%||leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd|leftN = $newLeftN rightN = $newRightN"
    //% block.loc.ru="установить параметры выравнивания на линии с макс скоростью = $newSpeed\\%||leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd|leftN = $newLeftN rightN = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
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
     * Setting sort parameters for the alignment algorithm on the line perpendicular with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Установка сокращённых параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed скорость движения, eg: 50
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftN коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightN коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="SetLineAlignmentShortParams"
    //% block="set line alignment params at speed = $newSpeed\\%||leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd|leftN = $newLeftN rightN = $newRightN"
    //% block.loc.ru="установить параметры выравнивания на линии с макс скоростью = $newSpeed\\%||leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd|leftN = $newLeftN rightN = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function SetLineAlignmentShortParams(newSpeed: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number) {
        if (newSpeed) levelings.lineAlignmentMaxSpeed = newSpeed;
        if (newLeftKp) levelings.lineAlignmentLeftSideKp = newLeftKp;
        if (newRightKp) levelings.lineAlignmentRightSideKp = newRightKp;
        if (newLeftKd) levelings.lineAlignmentLeftSideKd = newLeftKd;
        if (newRightKd) levelings.lineAlignmentRightSideKd = newRightKd;
        if (newLeftN) levelings.lineAlignmentLeftSideN = newLeftN;
        if (newRightN) levelings.lineAlignmentRightSideN = newRightN;
    }

    /**
     * Empty parameters for the algorithm with a regulator.
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="LineAlignmentEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function LineAlignmentEmptyParams(): LineAlignmentInterface {
        return null;
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed.
     * Параметры для алгоритма с регулятором с возможностью установить скорость.
     * @param newSpeed максимальная скорость выравнивания, eg: 40
     */
    //% blockId="LineAlignmentOneParams"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function LineAlignmentOneParams(newSpeed?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed
        };
    }

    /**
     * Parameters for an algorithm with a regulator with the ability to set the speed, Kp.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     * @param newSpeed максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     */
    //% blockId="LineAlignmentThreeParams"
    //% block="speed = $newSpeed\\%| left side Kp = $newLeftKp|right Kp = $newRightKp"
    //% block.loc.ru="скорость = $newSpeed\\%| левая сторона Kp = $newLeftKp|правая Kp = $newRightKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function LineAlignmentThreeParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number): LineAlignmentInterface {
        return {
            maxSpeed: newSpeed,
            leftKp: newLeftKp,
            rightKp: newRightKp
        };
    }

    /**
     * Parameters for the algorithm with a regulator with the ability to set the speed, Kp, Kd, and N - filter of the differential regulator.
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     */
    //% blockId="LineAlignmentSevenParams"
    //% block="speed = $newSpeed\\%|left side Kp = $newLeftKp Kd = $newLeftKd N = $newLeftN|right Kp = $newRightKp Kd = $newRightKd N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%|левая сторона Kp = $newLeftKp Kd = $newLeftKd N = $newLeftN|правая Kp = $newRightKp Kd = $newRightKd N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function LineAlignmentSevenParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
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
     * @param newSpeed максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     */
    //% blockId="LineAlignmentAllParams"
    //% block="speed = $newSpeed\\%|left side Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|right Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% block.loc.ru="скорость = $newSpeed\\%|левая сторона Kp = $newLeftKp Ki = $newLeftKi Kd = $newLeftKd N = $newLeftN|правая Kp = $newRightKp Ki = $newRightKi Kd = $newRightKd N = $newRightN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function LineAlignmentAllParams(newSpeed?: number, newLeftKp?: number, newRightKp?: number, newLeftKi?: number, newRightKi?: number, newLeftKd?: number, newRightKd?: number, newLeftN?: number, newRightN?: number): LineAlignmentInterface {
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

namespace params {

    /**
     * Setting parameters for the positioning algorithm (alignment) on the line by line sensors with the ability to set the speed, Kp, Ki, Kd, and N - filter of the differential regulator.
     * Установка параметров для алгоритма позицианирования (выравнивание) на линии датчиками линии с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     * @param newSpeed максимальная скорость выравнивания, eg: 40
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newN коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetLinePositioningParams"
    //% block="set line positioning params at speed = $newSpeed\\% Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% block.loc.ru="установить параметры позиционирования на линии на скорости = $newSpeed\\% Kp = $newKp|Ki = $newKi|Kd = $newKd||N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры позицианирования на линии"
    export function SetLinePositioningParams(newSpeed: number, newKp?: number, newKi?: number, newKd?: number, newN?: number) {
        if (newSpeed) levelings.linePositioningMaxSpeed = newSpeed;
        if (newKp) levelings.linePositioningKp = newKp;
        if (newKi) levelings.linePositioningKi = newKi;
        if (newKd) levelings.linePositioningKd = newKd;
        if (newN) levelings.linePositioningN = newN;
    }

}

namespace params {

    // Интерфейс перадачи параметров для алгоритма позиционирования на линии
    export interface LinePositioningInterface {
        maxSpeed?: number;
        timeOut?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

}