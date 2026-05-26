namespace params {

    export interface NavLineFollow {
        vStartMove?: number,
        vMaxMove?: number,
        vTurn?: number,
        accelStartDist?: number
        Kp?: number,
        Ki?: number,
        Kd?: number,
        Kf?: number,
        KpSide?: number,
        KiSide?: number,
        KdSide?: number,
        KfSide?: number,
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="NavLineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии"
    export function navLineFollowEmptyParams(): NavLineFollow {
        return null;
    }

}