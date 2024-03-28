// Функция для управление манипулятором
function Manipulator(state: ClawState, speed?: number) {
    if (!speed) speed = MANIP_DEFL_SPEED; // Если аргумент не был передан, то за скорость установится значение по умолчанию
    else speed = Math.abs(speed);
    MANIPULATOR_MOTOR.setBrake(true); // Устанавливаем ударжание мотора при остановке
    if (state == ClawState.Open) MANIPULATOR_MOTOR.run(speed);
    else MANIPULATOR_MOTOR.run(-speed);
    loops.pause(20); // Пауза перед началом алгоритма для того, чтобы дать стартануть защите
    while (true) { // Проверяем, что мотор застопорился и не может больше двигаться
        let encA1 = MANIPULATOR_MOTOR.angle();
        loops.pause(15); // Задержка между измерениями
        let encA2 = MANIPULATOR_MOTOR.angle();
        if (Math.abs(Math.abs(encA2) - Math.abs(encA1)) <= 1) break;
    }
    MANIPULATOR_MOTOR.stop(); // Останавливаем мотор
}

namespace custom {
    
    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            motions.DistMove(DIST_AFTER_INTERSECTION, speed, true);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            motions.RampDistMove(DIST_AFTER_INTERSECTION, 0, DIST_AFTER_INTERSECTION / 2, speed);
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            motions.RollingMoveOut(DIST_ROLLING_MOVE_OUT, speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением
            CHASSIS_MOTORS.setBrake(true);
            CHASSIS_MOTORS.stop();
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            CHASSIS_MOTORS.setBrake(false);
            CHASSIS_MOTORS.stop();
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            CHASSIS_MOTORS.steer(0, speed);
        }
    }

}

namespace music {

    /**
     * Функция для запуска тона в паралельной задачи.
     * @param frequency pitch of the tone to play in Hertz (Hz), eg: Note.C
     * @param ms tone duration in milliseconds(ms), eg: BeatFraction.Half
     */
    //% blockId="PlayToneInParallel"
    //% block="play tone|at $frequency| for $duration|in the background"
    //% block.loc.ru="проиграть тон $frequency| продолжительностью $duration| в фоне"
    //% frequency.shadow=device_note
    //% duration.shadow=device_beat
    //% weight=75 blockGap=8
    //% group="Tone"
    export function PlayToneInParallel(frequency: number, duration: number) {
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

    // Интерфейс перадачи параметров для алгоритма с регулятором
    export interface LineFollowInreface {
        speed?: number;
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
    //% blockHidden=true
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