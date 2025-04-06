namespace motors {

    let regMotorMaxSpeed = 50; // Максимальная скорость регулирования положения мотором
    let regMotorKp = 1; // Пропорциональный коэффицент регулирования положения мотора
    let regMotorKi = 0; // Интегральный коэффицент регулирования положения мотора
    let regMotorKd = 0; // Дифференциальный коэффицент регулирования положения мотора
    let regMotorN = 0; // Фильтр дифференциального коэффицента регулирования положения мотора
    let regMotorTimeOut = 2000; // Максимальное время работы
    let tolerance = 5; // Допустимая погрешность (в тиках энкодера)
    let minSpeedThreshold = 5; // Порог минимальной скорости

    export let pidRegMotor: automation.PIDController; // PID для регулирования положения мотора
    
    /**
     * A function that sets the motor to the desired position.
     * Функция, которая устанавливает мотор на нужную позицию.
     * @param motor мотор для управления, eg: motors.mediumA
     * @param pos установить новый угол в градусах, eg: 45
     * @param isHold удержание мотора по завершению, eg: true
     */
    //% blockId="MotorSetPosition"
    //% block="set $motor to position $pos||holding $isHold|params: $params"
    //% block.loc.ru="установить $motor на позицию $pos||удерживание $isHold|параметры: $params"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% motor.fieldEditor="motors"
    //% motor.fieldOptions.decompileLiterals=1
    //% params.shadow="MotorSetPosEmptyParams"
    //% weight="99"
    //% subcategory="Дополнительно"
    //% group="Управление положением"
    export function setPosition(motor: motors.Motor, pos: number, isHold: boolean = true, params?: params.MotorRegulator) {
        if (params) {
            if (params.maxSpeed) regMotorMaxSpeed = params.maxSpeed;
            if (params.Kp) regMotorKp = params.Kp;
            if (params.Ki) regMotorKi = params.Ki;
            if (params.Kd) regMotorKd = params.Kd;
            if (params.N) regMotorN = params.N;
            if (params.tolerance) tolerance = params.tolerance;
            if (params.timeOut) minSpeedThreshold = params.minSpeedThreshold;
        }

        motor.setBrake(isHold); // Установка удерживания мотором позиции

        pidRegMotor = new automation.PIDController(); // PID для мотора
        pidRegMotor.setGains(regMotorKp, regMotorKi, regMotorKd); // Установка коэффицентов ПИД регулятора
        pidRegMotor.setDerivativeFilter(regMotorN); // Установить фильтр дифференциального регулятора
        pidRegMotor.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidRegMotor.reset(); // Сброс ПИД регулятора
        
        let prevError = 0; // Предыдущая ошибка (для расчёта скорости)
        let speed = 0; // Текущая скорость (производная ошибки)
        const startTime = control.millis(); // Переменная хранения времени старта алгоритма
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            if (regMotorTimeOut && currTime - startTime >= regMotorTimeOut) break; // Таймаут
            const error = pos - motor.angle(); // Расчитываем ошибку положения
            // Рассчитываем скорость (производную ошибки)
            if (dt > 0) { // Избегаем деления на ноль
                speed = (error - prevError) / dt;
                prevError = error;
            }
            if (Math.abs(error) < tolerance && Math.abs(speed) < minSpeedThreshold) break; // Угол был достигнут
            pidRegMotor.setPoint(error); // Передать ошибку регулятору
            let U = pidRegMotor.compute(dt, 0); // Управляющее воздействие
            U = Math.constrain(U, -regMotorMaxSpeed, regMotorMaxSpeed); // Ограничиваем
            motor.run(U); // Установить мотору управляющее воздействие
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла за нужную частоту
        }
        music.playToneInBackground(Note.C, 75); // Сигнал о завершении
        motor.stop(); // Останавливаем
    }

}