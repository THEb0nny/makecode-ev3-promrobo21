namespace music {

    /**
     * Функция для запуска тона в фоне(паралельной задачи).
     * @param frequency pitch of the tone to play in Hertz (Hz), eg: Note.C
     * @param ms tone duration in milliseconds(ms), eg: BeatFraction.Half
     */
    //% blockId="PlayToneInBackground"
    //% block="play tone|at $frequency| for $duration|in the background"
    //% block.loc.ru="проиграть тон $frequency| продолжительностью $duration| в фоне"
    //% frequency.shadow=device_note
    //% duration.shadow=device_beat
    //% weight=75 blockGap=8
    //% group="Tone"
    export function PlayToneInBackground(frequency: number, duration: number) {
        control.runInParallel(function () {
            music.playTone(frequency, duration);
        });
    }

}

namespace control {

    /**
     * Function to wait for a loop to complete for a specified time.
     * @param startTime start time, eg: 0
     * @param delay waiting time, eg: 10
     */
    //% blockId="PauseUntilTime"
    //% block="wait $delay ms|at start at $startTime"
    //% block.loc.ru="ждать $delay мс|при начале в $startTime|мс"
    //% weight="6"
    export function PauseUntilTime(startTime: number, ms: number) {
        if (startTime == 0) startTime = control.millis();
        const waitCompletionTime = startTime + ms;
        while (control.millis() < waitCompletionTime) loops.pause(0.01);
    }

}

namespace automation {

    // Интерфейс перадачи параметров для алгоритма движения по линии
    export interface LineFollowInreface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    // Интерфейс перадачи параметров для алгоритма выравнивания на линии
    export interface LineAlignmentInreface {
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
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden="true"
    //% weight="99"
    //% group="Params"
    export function SetEmptyParams(): LineFollowInreface {
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
    //% group="Params"
    export function Set1Params(newSpeed?: number): LineFollowInreface {
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
    //% group="Params"
    export function Set2Params(newSpeed?: number, newKp?: number): LineFollowInreface {
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
    //% group="Params"
    export function Set4Params(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInreface {
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
    //% group="Params"
    export function SetAllParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            N: newN
        };
    }

}