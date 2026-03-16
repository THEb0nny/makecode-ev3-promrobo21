namespace chassis {

    /**
     * Синхронизированный поворот шасси относительно центра на нужный угол с ускорением и замедлением.
     * Например, если deg > 0, то робот будет поворачиваться вправо, а если deg < 0, то влево.
     * Скорости vMin и vMax, углы accelDeg и decelDeg должны быть положительными (отрицательные значения будут взяты по модулю).
     * Скорость vMin не должна быть выше vMax.
     * Если не указать accelDeg или decelDeg, тогда их значение будет 25% от всего угла поворота.
     * Если указать timeOut, тогда после указанного времени в мсек алгоритм прервётся, например, если робот застрял.
     * @param deg угол вращения в градусах, eg: 90
     * @param vMin мин скорость вращения, eg: 30
     * @param vMax макс скорость вращения, eg: 80
     * @param accelDeg угол ускорения, eg: 25
     * @param decelDeg угол замедления, eg: 25
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisRampSpinTurn"
    //% block="chassis ramp spin turn $deg\\° from min $vMin\\% макс $vMax\\% relative to center wheel axis||at accel deg $accelDeg|decel $decelDeg"
    //% block.loc.ru="плавный поворот шасси на $deg\\° с мин $vMin\\% макс $vMax\\% при относительно центра оси колёс||при угле ускорения $accelDeg|замедления $decelDeg"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% vMin.shadow="motorSpeedPicker"
    //% vMax.shadow="motorSpeedPicker"
    //% weight="89" blockGap="8"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты с ускорениями"
    export function rampSpinTurn(deg: number, vMin: number, vMax: number, accelDeg?: number, decelDeg?: number, timeOut?: number) {
        if (deg == 0 || vMax == 0) {
            stop(Braking.Hold);
            return;
        }
        if (vMin < 0) { // Берём модули скоростей и выводим предупреждение
            console.log(`Warning: vMin is negative (${vMin}). Using absolute value.`);
        }
        if (vMax < 0) {
            console.log(`Warning: vMax is negative (${vMax}). Using absolute value.`);
        }

        const emlPrev = leftMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const emrPrev = rightMotor.angle();

        vMin = Math.clamp(0, 100, Math.abs(vMin) >> 0); // Ограничиваем мин скорость от 0 до 100, берём модули и отсекаем дробную часть
        vMax = Math.clamp(0, 100, Math.abs(vMax) >> 0); // Ограничиваем макс скорость от 0 до 100, берём модули и отсекаем дробную часть

        if (vMin > vMax) { // Проверка перепутанных скоростей ПОСЛЕ clamp
            [vMin, vMax] = [vMax, vMin];
            console.log(`Warning: vMin was greater than vMax. Swapped: vMin=${vMin}, vMax=${vMax}`);
        }
        if (vMin === vMax) { // Проверка равенства скоростей
            vMin = Math.max(0, vMax - 10);
            console.log(`Warning: vMin equals vMax. Adjusted: vMin=${vMin}, vMax=${vMax}`);
        }

        const absDeg = Math.abs(deg); // Угол поворота
        let absAccelDeg = accelDeg !== undefined ? Math.abs(accelDeg) : absDeg * 0.25; // 25% на ускорение
        let absDecelDeg = decelDeg !== undefined ? Math.abs(decelDeg) : absDeg * 0.25; // 25% на замедление

        if (accelDeg !== undefined && accelDeg < 0) {
            console.log(`Warning: accelDeg is negative (${accelDeg}). Using absolute value (${absAccelDeg}).`);
        }
        if (decelDeg !== undefined && decelDeg < 0) {
            console.log(`Warning: decelDeg is negative (${decelDeg}). Using absolute value (${absDecelDeg}).`);
        }
        if (absAccelDeg + absDecelDeg > absDeg) { // Проверка если ускорение + замедление > всего пути, обрезаем
            const ratio = absDeg / (absAccelDeg + absDecelDeg);
            absAccelDeg *= ratio;
            absDecelDeg *= ratio;
        }

        const accelCalcMotRot = Math.round(Math.turnToTicks(absAccelDeg)); // Расчёт угла поворота моторов для поворота для ускорения
        const decelCalcMotRot = Math.round(Math.turnToTicks(absDecelDeg)); // Расчёт угла поворота моторов для поворота для замедления
        const totalCalcMotRot = Math.round(Math.turnToTicks(deg)); // Расчёт угла поворота моторов для поворота общего угла

        const vLeftMax = deg > 0 ? vMax : -vMax;
        const vRightMax = deg > 0 ? -vMax : vMax;

        advmotctrls.accTwoEncComplexMotionConfig(vMin, vLeftMax, vRightMax, vMin, totalCalcMotRot, accelCalcMotRot, decelCalcMotRot); // Установить конфигурация синхронизированного движения с ускорениями

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setDerivativeFilter(getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        pidChassisSync.reset(); // Сбросить регулятор

        let prevTime = control.millis(); // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = control.millis(); // Стартовое время алгоритма
        while (true) {
            const currTime = control.millis();
            const dt = currTime - prevTime;
            prevTime = currTime;
            if (timeOut && currTime - startTime >= timeOut) break; // Выход из алгоритма, если время вышло
            const eml = leftMotor.angle() - emlPrev;
            const emr = rightMotor.angle() - emrPrev;
            const out = advmotctrls.accTwoEncComplexMotionCompute(eml, emr);
            if (out.isDoneLeft || out.isDoneRight ||
                ((Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(totalCalcMotRot))) break;
            const error = advmotctrls.getErrorSyncMotors(eml, emr, out.pwrLeft, out.pwrRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotors(u, out.pwrLeft, out.pwrRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

    /**
     * Синхронизированный поворот на нужный угол относительно одного из колес с ускорением и замедлением.
     * Для вращения вперёд устанавливается положительный deg, а назад - отрицательный.
     * Скорости vMin и vMax, углы accelDeg и decelDeg всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * Скорость vMin не должна быть выше vMax.
     * Если не указать accelDeg или decelDeg, тогда их значение будет 25% от всего угла поворота.
     * Если указать timeOut, тогда после указанного времени в мсек алгоритм прервётся, например, если робот застрял.
     * @param wheelPivot колесо, относительно которого происходит поворот, eg: WheelPivot.LeftWheel
     * @param deg угол вращения в градусах, eg: 90
     * @param vMin мин скорость вращения, eg: 30
     * @param vMax макс скорость вращения, eg: 80
     * @param accelDeg угол ускорения, eg: 25
     * @param decelDeg угол замедления, eg: 25
     * @param timeOut максимальное время выполнения в мсек, eg: 2000
     */
    //% blockId="ChassisRampPivotTurn"
    //% block="chassis rump pivot turn $deg\\° from min $vMin\\% max $vMax\\% pivot $wheelPivot||at accel deg $accelDeg|decel $decelDeg"
    //% block.loc.ru="плавный поворот шасси на $deg\\° с мин $vMin\\% макс $vMax\\% относительно $wheelPivot||при угле ускорения $accelDeg|замедления $decelDeg"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% vMin.shadow="motorSpeedPicker"
    //% vMax.shadow="motorSpeedPicker"
    //% weight="88"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты с ускорениями"
    export function rampPivotTurn(wheelPivot: WheelPivot, deg: number, vMin: number, vMax: number, accelDeg?: number, decelDeg?: number, timeOut?: number) {
        if (deg == 0 || vMax == 0) {
            stop(Braking.Hold);
            return;
        }
        if (vMin < 0) {
            console.log(`Warning: vMin is negative (${vMin}). Using absolute value.`);
        }
        if (vMax < 0) {
            console.log(`Warning: vMax is negative (${vMax}). Using absolute value.`);
        }

        stop(Braking.Hold); // Установить тормоз и удержание моторов перед поворотом

        const emlPrev = leftMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const emrPrev = rightMotor.angle();

        vMin = Math.clamp(-100, 100, Math.abs(vMin) >> 0); // Ограничиваем мин скорость от -100 до 100, берём модули и отсекаем дробную часть
        vMax = Math.clamp(-100, 100, Math.abs(vMax) >> 0); // Ограничиваем макс скорость от -100 до 100, берём модули и отсекаем дробную часть

        if (vMin > vMax) { // Проверка перепутанных скоростей по модулю
            [vMin, vMax] = [vMax, vMin];
            console.log(`Warning: vMin was greater than vMax. Swapped: vMin=${vMin}, vMax=${vMax}`);
        }
        if (vMin == vMax) { // Проверка равенства скоростей
            vMin = Math.max(0, vMax - 10);
            console.log(`Warning: vMin equals vMax. Adjusted: vMin=${vMin}, vMax=${vMax}`);
        }

        const absDeg = Math.abs(deg); // Угол поворота
        let absAccelDeg = accelDeg !== undefined ? Math.abs(accelDeg) : absDeg * 0.25; // 25% на ускорение
        let absDecelDeg = decelDeg !== undefined ? Math.abs(decelDeg) : absDeg * 0.25; // 25% на замедление

        if (absAccelDeg + absDecelDeg > absDeg) { // Проверка если ускорение + замедление > всего пути, обрезаем
            const ratio = absDeg / (accelDeg + decelDeg);
            accelDeg *= ratio;
            decelDeg *= ratio;
        }

        const accelCalcMotRot = Math.round(Math.turnToTicks(absAccelDeg) * 2); // Расчёт угла поворота моторов для поворота для ускорения
        const decelCalcMotRot = Math.round(Math.turnToTicks(absDecelDeg) * 2); // Расчёт угла поворота моторов для поворота для замедления
        const totalCalcMotRot = Math.round(Math.turnToTicks(absDeg) * 2); // Расчёт угла поворота моторов для поворота общего угла

        const vSign = Math.sign(deg);
        const vLeftMax = wheelPivot === WheelPivot.LeftWheel ? 0 : vMax * vSign;
        const vRightMax = wheelPivot === WheelPivot.LeftWheel ? vMax * vSign : 0;

        advmotctrls.accTwoEncComplexMotionConfig(vMin, vLeftMax, vRightMax, vMin, totalCalcMotRot, accelCalcMotRot, decelCalcMotRot); // Установить конфигурация синхронизированного движения с ускорениями

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setDerivativeFilter(getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
        pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        pidChassisSync.reset(); // Сбросить регулятор

        let prevTime = control.millis(); // Переменная для хранения предыдущего времени для цикла регулирования
        const startTime = control.millis(); // Стартовое время алгоритма
        while (true) {
            const currTime = control.millis();
            const dt = currTime - prevTime;
            prevTime = currTime;
            if (timeOut && currTime - startTime >= timeOut) break; // Выход из алгоритма, если время вышло
            const eml = leftMotor.angle() - emlPrev;
            const emr = rightMotor.angle() - emrPrev;
            const out = advmotctrls.accTwoEncComplexMotionCompute(eml, emr);
            if (wheelPivot == WheelPivot.LeftWheel && Math.abs(emr) >= totalCalcMotRot ||
                wheelPivot == WheelPivot.RightWheel && Math.abs(eml) >= totalCalcMotRot) {
                break;
            } // Условие выхода: проверяем только движущееся колесо
            const error = advmotctrls.getErrorSyncMotors(eml, emr, out.pwrLeft, out.pwrRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotors(u, out.pwrLeft, out.pwrRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

}