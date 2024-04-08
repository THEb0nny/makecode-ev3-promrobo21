namespace custom {

    // Интерфейс перадачи параметров для алгоритма движения по линии
    export interface LineFollowInterface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

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

    // Интерфейс перадачи параметров для алгоритма позиционирования на линии
    export interface LinePositioningInterface {
        maxSpeed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden="true"
    //% weight="99"
    //% group="Параметры"
    export function SetEmptyParams(): LineFollowInterface {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="Set1Params"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="98"
    //% group="Параметры"
    export function Set1Params(newSpeed?: number): LineFollowInterface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="Set2Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="97"
    //% group="Параметры"
    export function Set2Params(newSpeed?: number, newKp?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="Set4Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="96"
    //% group="Параметры"
    export function Set4Params(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Kd: newKd,
            N: newN
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetAllParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="95"
    //% group="Параметры"
    export function SetAllParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInterface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            N: newN
        };
    }

}