namespace motors {

    let regMotorMaxSpeed = 50;
    let regMotorKp = 1;
    let regMotorKi = 0;
    let regMotorKd = 0;
    let regMotorN = 0;
    let regMotorTimeOut = 1500;

    // export const pidRegMotor = new automation.PIDController(); // PID для регулирования положения мотора
    
    /**
     * A function that sets the motor to the desired position.
     * Функция, которая устанавливает мотор на нужную позицию.
     * @param motor мотор для управления, eg: motors.mediumA
     * @param newPos установить новый угол в градусах, eg: 45
     */
    //% blockId="MotorMoveIntoPosition"
    //% block="set $motor to position $pos||params: $params"
    //% block.loc.ru="установить $motor на позицию $pos||параметры: $params"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% motor.fieldEditor="motors"
    //% motor.fieldOptions.decompileLiterals=1
    //% params.shadow="MotorMoveIntoPosEmptyParams"
    //% weight="99"
    //% subcategory="Дополнительно"
    //% group="Управление положением"
    export function moveIntoPosition(motor: motors.Motor, pos: number, params?: params.MotorRegInterface) {
        if (params) {
            if (params.maxSpeed) regMotorMaxSpeed = params.maxSpeed;
            if (params.Kp) regMotorKp = params.Kp;
            if (params.Ki) regMotorKi = params.Ki;
            if (params.Kd) regMotorKd = params.Kd;
            if (params.N) regMotorN = params.N;
            if (params.timeOut) regMotorTimeOut = params.timeOut;
        }

        motor.setBrake(true); // Установка удерживания мотором позиции

        let pidRegMotor = new automation.PIDController(); // PID для мотора
        pidRegMotor.setGains(regMotorKp, regMotorKi, regMotorKd); // Установка коэффицентов ПИД регулятора
        pidRegMotor.setDerivativeFilter(regMotorN); // Установить фильтр дифференциального регулятора
        pidRegMotor.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidRegMotor.reset(); // Сброс ПИД регулятора

        const startTime = control.millis();
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            if (regMotorTimeOut && currTime - startTime >= regMotorTimeOut) break; // Таймаут
            const error =  pos - motor.angle(); // Расчитываем ошибку положения
            pidRegMotor.setPoint(error); // Передать ошибку регулятору
            let U = pidRegMotor.compute(dt, 0); // Управляющее воздействие
            U = Math.constrain(U, -regMotorMaxSpeed, regMotorMaxSpeed); // Ограничиваем
            motor.run(U); // Установить мотору управляющее воздействие
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла за нужную частоту
        }
        motor.stop(); // Останавливаем
    }

}