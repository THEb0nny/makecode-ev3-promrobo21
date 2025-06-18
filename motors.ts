namespace motors {

    let regMotorMaxSpeed = 80; // Максимальная скорость регулирования положения мотором
    let regMotorKp = 1; // Пропорциональный коэффицент регулирования положения мотора
    let regMotorKi = 0; // Интегральный коэффицент регулирования положения мотора
    let regMotorKd = 0; // Дифференциальный коэффицент регулирования положения мотора
    let regMotorKf = 0; // Фильтр дифференциального коэффицента регулирования положения мотора
    let regMotorTimeOut = 2000; // Максимальное время работы
    let errorThreshold = 1; // Допустимая погрешность (в тиках энкодера)
    let minSpeedThreshold = 5; // Порог минимальной скорости

    export const pidRegMotor = new automation.PIDController(); // PID для регулирования положения мотора
    
    /**
     * Функция, которая устанавливает мотор на нужную позицию.
     * @param motor мотор для управления, eg: motors.mediumA
     * @param pos установить новый угол в градусах, eg: 45
     * @param braking торможение мотора по завершению по завершению, eg: Braking.Hold
     */
    //% blockId="MotorSetPosition"
    //% block="set $motor to position $pos||braking $braking|params: $params"
    //% block.loc.ru="установить $motor на позицию $pos||торможение $braking|параметры: $params"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% motor.fieldEditor="motors"
    //% motor.fieldOptions.decompileLiterals=1
    //% params.shadow="MotorSetPosEmptyParams"
    //% weight="99"
    //% subcategory="Дополнительно"
    //% group="Управление положением"
    export function setPosition(motor: motors.Motor, pos: number, braking: Braking, params?: params.MotorRegulator, debug: boolean = false) {
        if (params) {
            if (params.maxSpeed >= 0) regMotorMaxSpeed = params.maxSpeed;
            if (params.Kp >= 0) regMotorKp = params.Kp;
            if (params.Ki >= 0) regMotorKi = params.Ki;
            if (params.Kd >= 0) regMotorKd = params.Kd;
            if (params.Kf >= 0) regMotorKf = params.Kf;
            if (params.errorThreshold >= 0) errorThreshold = params.errorThreshold;
            if (params.minSpeedThreshold >= 0) minSpeedThreshold = params.minSpeedThreshold;
            if (params.timeOut >= 0) regMotorTimeOut = params.timeOut;
        }

        motor.setBrake(braking == Braking.Hold); // Установка удерживания мотором позиции

        pidRegMotor.setGains(regMotorKp, regMotorKi, regMotorKd); // Установка коэффицентов ПИД регулятора
        pidRegMotor.setDerivativeFilter(regMotorKf); // Установить фильтр дифференциального регулятора
        pidRegMotor.setControlSaturation(-500, 500); // Установка интервала ПИД регулятора
        pidRegMotor.reset(); // Сброс ПИД регулятора

        if (debug) console.log(`Start motors.setPosition(${pos})`);
        
        const startTime = control.millis(); // Переменная хранения времени старта алгоритма
        let prevDebugPrintTime = 0;
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            if (regMotorTimeOut > 0 && currTime - startTime >= regMotorTimeOut) break; // Таймаут
            let currentAngle = motor.angle();
            let error = pos - currentAngle; // Расчитываем ошибку положения
            if (Math.abs(error) <= errorThreshold && Math.abs(motor.speed()) <= minSpeedThreshold) break; // Угол был достигнут
            pidRegMotor.setPoint(error); // Передать ошибку регулятору
            let U = pidRegMotor.compute(dt, 0); // Управляющее воздействие
            U = Math.constrain(U, -regMotorMaxSpeed, regMotorMaxSpeed); // Ограничиваем
            motor.run(U); // Установить мотору управляющее воздействие
            if (debug && currTime - prevDebugPrintTime >= 10) {
                // brick.clearScreen();
                // brick.printString(`angle: ${motor.angle()}`, 1);
                // brick.printString(`error: ${error}`, 2);
                // brick.printString(`U: ${U}`, 3);
                // console.log(`millis: ${control.millis() - startTime}, angle: ${currentAngle}, error: ${error}, U: ${U}`);
                control.runInParallel(function() {
                    console.log(`${currentAngle}, ${error}, ${U}`);
                    prevDebugPrintTime = control.millis();
                })
            }
            control.pauseUntilTime(currTime, 5); // Ожидание выполнения цикла за нужную частоту
        }
        if (debug) console.log(`Stop motors.setPosition, angle: ${motor.angle()}`);
        music.playToneInBackground(988, 50); // Сигнал о завершении
        motor.stop(); // Останавливаем
    }

}