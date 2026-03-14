namespace params {

    export interface MotorRegulator {
        vMax?: number;
        timeOut?: number;
        errorThreshold?: number;
        vMinThreshold?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

    /**
     * Пустые параметры для алгоритма регулирования мотора для установки на позицию.
     */
    //% blockId="MotorSetPosEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры регулирования управления мотора"
    export function motorSetPosEmptyParams(): MotorRegulator {
        return null;
    }

}