namespace chassis {

    /**
     * Синхронизированный поворот шасси относительно центра на нужный угол с определенной скоростью.
     * Для вращения вправо устанавливается положительный угол deg, а влево - отрицательный.
     * Скорость v всегда должна быть положительной (отрицательное значение будет взято по модулю).
     * Если указать timeOut, тогда после  указанного времени в мсек алгоритм прервётся, например, если робот застрял.
     * @param deg угол вращения в градусах, eg: 90
     * @param v скорость поворота, eg: 50
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisSpinTurn"
    //% block="chassis spin turn $deg\\° at $v\\% relative to center wheel axis||timeout $timeOut ms"
    //% block.loc.ru="поворот шасси на $deg\\° с $v\\% относительно центра оси колёс||таймаут $timeOut мс"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% weight="99" blockGap="8"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты"
    export function spinTurn(deg: number, v: number, timeOut?: number) {
        if (deg == 0 || v == 0) {
            stop(Braking.Hold);
            return;
        }
        if (v < 0) console.log(`Warning: v is negative (${v}). Using absolute value.`);
        
        v = Math.clamp(0, 100, Math.abs(v) >> 0); // Берём модуль скорости, ограничиваем от 0 до 100 и отсекаем дробную часть
        
        const calcMotRot = Math.round(Math.turnToTicks(Math.abs(deg))); // Расчёт угла поворота моторов для поворота
        
        const vLeft = deg < 0 ? -v : v;
        const vRight = deg > 0 ? -v : v;

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setDerivativeFilter(getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        pidChassisSync.reset(); // Сбросить регулятор

        const emlPrev = leftMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const emrPrev = rightMotor.angle();

        const timeOutUs = timeOut ? timeOut * 1000 : 0; // Перевод timeout в микросекунды
        
        let prevTime = control.micros(); // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = prevTime; // Стартовое время алгоритма
        while (true) {
            const currTime = control.micros();
            const dt = (currTime - prevTime) / 1000;
            prevTime = currTime;
            if (timeOutUs && currTime - startTime >= timeOutUs) break; // Выход из алгоритма, если время вышло
            const eml = leftMotor.angle() - emlPrev;
            const emr = rightMotor.angle() - emrPrev;
            if ((Math.abs(eml) + Math.abs(emr)) / 2 >= calcMotRot) break;
            const errorRaw = advmotctrls.getErrorSyncMotors(eml, emr, vLeft, vRight);
            const error = Math.clamp(-1000, 1000, errorRaw);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotors(u, vLeft, vRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTimeUs(currTime, 1000);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

    /**
     * Синхронизированный поворот на нужный угол относительно одного из колес.
     * Для вращения вперёд устанавливается положительный угол deg, а назад - отрицательный.
     * Скорость v всегда должна быть положительной (отрицательное значение будет взято по модулю).
     * Если указать timeOut, тогда после  указанного времени в мсек алгоритм прервётся, например, если робот застрял.
     * @param wheelPivot колесо, относительно которого происходит поворот, eg: WheelPivot.LeftWheel
     * @param deg угол вращения в градусах, eg: 90
     * @param v скорость вращения, eg: 50
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisPivotTurn"
    //% block="chassis pivot turn $deg\\° at $v\\% pivot $wheelPivot||timeout $timeOut ms"
    //% block.loc.ru="поворот шасси на $deg\\° с $v\\% относительно $wheelPivot||таймаут $timeOut мс"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% weight="98"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты"
    export function pivotTurn(wheelPivot: WheelPivot, deg: number, v: number, timeOut?: number) {
        if (deg == 0 || v == 0) {
            stop(Braking.Hold);
            return;
        }
        if (v < 0) console.log(`Warning: v is negative (${v}). Using absolute value.`);

        stop(Braking.Hold); // Установить тормоз и удержание моторов перед поворотом

        v = Math.clamp(0, 100, Math.abs(v) >> 0); // Берём модуль скорости, ограничиваем от 0 до 100 и отсекаем дробную часть
        
        const calcMotRot = Math.round(Math.turnToTicks(Math.abs(deg)) * 2); // Расчёт угла поворота моторов для поворота
        
        const vSign = Math.sign(deg); // Определяем направление по знаку deg
        const vLeft = wheelPivot == WheelPivot.RightWheel ? v * vSign : 0;
        const vRight = wheelPivot == WheelPivot.LeftWheel ? v * vSign : 0;

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setDerivativeFilter(getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        pidChassisSync.reset(); // Сбросить регулятор

        const emlPrev = leftMotor.angle(); // Считываем с левого мотора и  правого мотора значения энкодера перед стартом алгаритма
        const emrPrev = rightMotor.angle();

        const timeOutUs = timeOut ? timeOut * 1000 : 0; // Перевод timeout в микросекунды
        
        let prevTime = control.micros(); // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = prevTime; // Стартовое время алгоритма
        while (true) {
            const currTime = control.micros();
            const dt = (currTime - prevTime) / 1000;
            prevTime = currTime;
            if (timeOutUs && currTime - startTime >= timeOutUs) break; // Выход из алгоритма, если время вышло
            const eml = leftMotor.angle() - emlPrev;
            const emr = rightMotor.angle() - emrPrev;
            if ((wheelPivot == WheelPivot.LeftWheel && Math.abs(emr) >= calcMotRot) ||
                (wheelPivot == WheelPivot.RightWheel && Math.abs(eml) >= calcMotRot)) {
                break;
            } // Условие выхода: проверяем только движущееся колесо
            const errorRaw = advmotctrls.getErrorSyncMotors(eml, emr, vLeft, vRight);
            const error = Math.clamp(-1000, 1000, errorRaw);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotors(u, vLeft, vRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTimeUs(currTime, 1000);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

}