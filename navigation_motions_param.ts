namespace params {

    export interface NavLineFollow {
        moveStartV?: number,
        moveMaxV?: number,
        turnV?: number,
        accelStartDist?: number
        Kp?: number,
        Ki?: number,
        Kd?: number,
        Kf?: number,
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
    export function navLineFollowEmptyParams(): LineFollow {
        return null;
    }

}