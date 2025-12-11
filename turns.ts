namespace chassis {

    /**
     * Синхронизированный поворот шасси относительно центра на нужный угол с определенной скоростью.
     * Например, если градусов > 0, то робот будет поворачиваться вправо, а если градусов < 0, то влево.
     * Скорость должна быть положительной!
     * @param deg угол вращения в градусах, eg: 90
     * @param speed скорость поворота, eg: 50
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisSpinTurn"
    //% block="chassis spin turn $deg\\° at $speed\\% relative to center wheel axis||timeout $timeOut ms"
    //% block.loc.ru="поворот шасси на $deg\\° с $speed\\% относительно центра оси колёс||таймаут $timeOut мс"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="99" blockGap="8"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты"
    export function spinTurn(deg: number, speed: number, timeOut?: number) {
        if (deg == 0 || speed == 0) {
            stop(Braking.Hold);
            return;
        } else if (speed < 0) {
            console.log("Error: the rotation speed relative to the center is negative!");
            control.assert(false, 7);
        }
        speed = Math.clamp(0, 100, speed >> 0); // Ограничиваем скорость от 0 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const calcMotRot = Math.round(deg * getBaseLength() / getWheelDiametr()); // Расчёт угла поворота моторов для поворота
        let vLeft = deg < 0 ? -speed : speed;
        let vRight = deg > 0 ? -speed : speed;
        // if (deg > 0) advmotctrls.syncMotorsConfig(speed, -speed);
        // else if (deg < 0) advmotctrls.syncMotorsConfig(-speed, speed);
        // else return;
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0);
        pidChassisSync.reset(); // Сбросить регулятор
        let prevTime = 0; // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = control.millis(); // Стартовое время алгоритма
        while (true) {
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (timeOut && currTime - startTime >= timeOut) break; // Выход из алгоритма, если время вышло
            let eml = leftMotor.angle() - emlPrev;
            let emr = rightMotor.angle() - emrPrev;
            if ((Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) break;
            let error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            // pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, -error);
            let powers = advmotctrls.getPwrSyncMotors(U);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

    /**
     * Синхронизированный поворот на нужный угол относительно одного из колес.
     * Для вращения вперёд устанавливается положительная скорость, а назад - отрицательная.
     * Значение угла поворота всегда положительное!
     * @param deg угол вращения в градусах, eg: 90
     * @param speed скорость вращения, eg: 50
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisPivotTurn"
    //% block="chassis pivot turn $deg\\° at $speed\\% pivot $wheelPivot||timeout $timeOut ms"
    //% block.loc.ru="поворот шасси на $deg\\° с $speed\\% относительно $wheelPivot||таймаут $timeOut мс"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="98"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты"
    export function pivotTurn(deg: number, speed: number, wheelPivot: WheelPivot, timeOut?: number) {
        if (deg == 0 || speed == 0) {
            stop(Braking.Hold);
            return;
        } else if (deg < 0) {
            console.log("Error: the angle of rotation relative to the wheel is negative!");
            control.assert(false, 8);
        }
        speed = Math.clamp(-100, 100, speed >> 0); // Ограничиваем скорость от -100 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем с левого мотора и  правого мотора значения энкодера перед стартом алгаритма
        const calcMotRot = Math.round(((Math.abs(deg) * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота
        stop(Braking.Hold); // Установить тормоз и удержание моторов перед поворотом
        const vLeft = wheelPivot == WheelPivot.RightWheel ? speed : 0;
        const vRight = wheelPivot == WheelPivot.LeftWheel ? speed : 0;
        // if (wheelPivot == WheelPivot.LeftWheel) advmotctrls.syncMotorsConfig(0, speed);
        // else if (wheelPivot == WheelPivot.RightWheel) advmotctrls.syncMotorsConfig(speed, 0);
        // else return;
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0);
        pidChassisSync.reset(); // Сбросить регулятор
        let prevTime = 0; // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = control.millis(); // Стартовое время алгоритма
        while (true) {
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (timeOut && currTime - startTime >= timeOut) break; // Выход из алгоритма, если время вышло
            let eml = leftMotor.angle() - emlPrev;
            let emr = rightMotor.angle() - emrPrev;
            if (wheelPivot == WheelPivot.LeftWheel && Math.abs(emr) >= calcMotRot) break;
            else if (wheelPivot == WheelPivot.RightWheel && Math.abs(eml) >= calcMotRot) break;
            let error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            // pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, -error);
            let powers = advmotctrls.getPwrSyncMotors(U);
            if (wheelPivot == WheelPivot.LeftWheel) rightMotor.run(powers.pwrRight);
            else if (wheelPivot == WheelPivot.RightWheel) leftMotor.run(powers.pwrLeft);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

    /**
     * Синхронизированный поворот шасси относительно центра на нужный угол с определенной скоростью.
     * Например, если градусов > 0, то робот будет поворачиваться вправо, а если градусов < 0, то влево.
     * Скорость должна быть положительной!
     * @param deg rotation value in degrees, eg: 90
     * @param speed turning speed value, eg: 30
     */
    //% blockId="ChassisRampSpinTurn"
    //% block="chassis spin turn $deg\\° at $speed\\% relative to center wheel axis"
    //% block.loc.ru="поворот шасси на $deg\\° с $speed\\% относительно центра оси колёс"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="89" blockGap="8"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты с ускорениями"
    function rampSpinTurn(deg: number, minSpeed: number, maxSpeed: number) {
        return;
    }

    /**
     * Синхронизированный поворот на нужный угол относительно одного из колес.
     * Для вращения вперёд устанавливается положительная скорость, а назад - отрицательная.
     * Значение угла поворота всегда положительное!
     * @param deg rotation value in degrees, eg: 90
     * @param speed turning speed value, eg: 30
     */
    //% blockId="ChassisRampPivotTurn"
    //% block="chassis pivot turn $deg\\° at $minSpeed\\% $maxSpeed\\% pivot $wheelPivot"
    //% block.loc.ru="поворот шасси на $deg\\° с $minSpeed\\% $maxSpeed\\% относительно $wheelPivot"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="88"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты с ускорениями"
    function rampPivotTurn(deg: number, minSpeed: number, maxSpeed: number, wheelPivot: WheelPivot) {
        return;
    }

}