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
            // RampDistMove(DIST_AFTER_INTERSECTION, 0, DIST_AFTER_INTERSECTION / 2, speed);
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
        while (control.millis() < waitCompletionTime) loops.pause(0.0001);
    }

}