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
        const calcMotRot = Math.round((deg * getBaseLength()) / getWheelDiametr()); // Расчёт угла поворота моторов для поворота
        const vLeft = deg < 0 ? -speed : speed;
        const vRight = deg > 0 ? -speed : speed;

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
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
            const eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev;
            if ((Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) break;
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, vLeft, vRight);
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
    export function pivotTurn(wheelPivot: WheelPivot, deg: number, speed: number, timeOut?: number) {
        if (deg == 0 || speed == 0) {
            stop(Braking.Hold);
            return;
        } else if (deg < 0) {
            console.log("Error: the angle of rotation relative to the wheel is negative!");
            control.assert(false, 8);
        }

        stop(Braking.Hold); // Установить тормоз и удержание моторов перед поворотом
        speed = Math.clamp(-100, 100, speed >> 0); // Ограничиваем скорость от -100 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем с левого мотора и  правого мотора значения энкодера перед стартом алгаритма
        const calcMotRot = Math.round(((Math.abs(deg) * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота
        const vLeft = wheelPivot == WheelPivot.RightWheel ? speed : 0;
        const vRight = wheelPivot == WheelPivot.LeftWheel ? speed : 0;

        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
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
            const eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev;
            if (wheelPivot == WheelPivot.LeftWheel && Math.abs(emr) >= calcMotRot) break;
            else if (wheelPivot == WheelPivot.RightWheel && Math.abs(eml) >= calcMotRot) break;
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, vLeft, vRight);
            // if (wheelPivot == WheelPivot.LeftWheel) rightMotor.run(powers.pwrRight);
            // else if (wheelPivot == WheelPivot.RightWheel) leftMotor.run(powers.pwrLeft);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }


    /**
     * Синхронизированный поворот шасси относительно центра на нужный угол с ускорением и замедлением.
     * Например, если градусов > 0, то робот будет поворачиваться вправо, а если градусов < 0, то влево.
     * Скорости должны быть положительными! Скорость vMin не должна быть выше vMax.
     * Если не указать accelDeg или decelDeg, тогда их значение будет 25% от всего угла поворота.
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
        } else if (vMax < 0) {
            console.log("Error: the rotation vMax relative to the center is negative!");
            control.assert(false, 8);
        } else if (vMin < 0) {
            console.log("Error: the rotation vMin relative to the center is negative!");
            control.assert(false, 9);
        }
        if (vMin > vMax) {
            console.log(`error: vMin was greater than vMax!`);
            control.assert(false, 10);
        }

        vMin = Math.clamp(0, 100, vMin >> 0); // Ограничиваем мин скорость от 0 до 100 и отсекаем дробную часть
        vMax = Math.clamp(0, 100, vMax >> 0); // Ограничиваем макс скорость от 0 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const absDeg = Math.abs(deg); // Угол поворота
        accelDeg = accelDeg !== undefined ? accelDeg : absDeg * 0.25; // 25% на ускорение
        decelDeg = decelDeg !== undefined ? decelDeg : absDeg * 0.25; // 25% на замедление
        if (accelDeg + decelDeg > absDeg) { // Проверка если ускорение + замедление > всего пути, обрезаем
            const ratio = absDeg / (accelDeg + decelDeg);
            accelDeg *= ratio;
            decelDeg *= ratio;
        }
        const accelCalcMotRot = Math.round((accelDeg * getBaseLength()) / getWheelDiametr()); // Расчёт угла поворота моторов для поворота для ускорения
        const decelCalcMotRot = Math.round((decelDeg * getBaseLength()) / getWheelDiametr()); // Расчёт угла поворота моторов для поворота для замедления
        const totalCalcMotRot = Math.round((absDeg * getBaseLength()) / getWheelDiametr()); // Расчёт угла поворота моторов для поворота общего угла
        const vLeftMax = deg > 0 ? vMax : -vMax;
        const vRightMax = deg > 0 ? -vMax : vMax;

        advmotctrls.accTwoEncComplexMotionConfig(vMin, vLeftMax, vRightMax, vMin, accelCalcMotRot, decelCalcMotRot, totalCalcMotRot);
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
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
            const eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev;
            const out = advmotctrls.accTwoEncComplexMotionCompute(eml, emr);
            if (out.isDoneLeft || out.isDoneRight
                || ((Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(totalCalcMotRot))) break;
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, out.pwrLeft, out.pwrRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, out.pwrLeft, out.pwrRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

    /**
     * Синхронизированный поворот на нужный угол относительно одного из колес с ускорением и замедлением.
     * Для вращения вперёд устанавливается положительная скорость, а назад - отрицательная.
     * Значение угла поворота всегда положительное!
     * Скорость vMin не должна быть выше vMax.
     * Если не указать accelDeg или decelDeg, тогда их значение будет 25% от всего угла поворота.
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
        stop(Braking.Hold); // Установить тормоз и удержание моторов перед поворотом
        vMin = Math.clamp(-100, 100, vMin >> 0); // Ограничиваем мин скорость от -100 до 100 и отсекаем дробную часть
        vMax = Math.clamp(-100, 100, vMax >> 0); // Ограничиваем макс скорость от -100 до 100 и отсекаем дробную часть
        if (Math.abs(vMin) > Math.abs(vMax)) { // Проверка перепутанных скоростей по модулю
            const temp = vMin;
            vMin = vMax;
            vMax = temp;
        }
        if (Math.abs(vMin) === Math.abs(vMax)) { // Проверка равенства скоростей по модулю
            if (vMin > 0) vMin = Math.max(0, vMin - 10);
            else vMin = Math.min(0, vMin + 10);
        }
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const absDeg = Math.abs(deg); // Угол поворота
        accelDeg = accelDeg !== undefined ? accelDeg : absDeg * 0.25; // 25% на ускорение
        decelDeg = decelDeg !== undefined ? decelDeg : absDeg * 0.25; // 25% на замедление
        if (accelDeg + decelDeg > absDeg) { // Проверка если ускорение + замедление > всего пути, обрезаем
            const ratio = absDeg / (accelDeg + decelDeg);
            accelDeg *= ratio;
            decelDeg *= ratio;
        }
        const accelCalcMotRot = Math.round(((accelDeg * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота для ускорения
        const decelCalcMotRot = Math.round(((decelDeg * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота для замедления
        const totalCalcMotRot = Math.round(((Math.abs(deg) * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота общего угла
        const v = deg > 0 ? vMax : -vMax;
        const vLeftMax = wheelPivot === WheelPivot.LeftWheel ? 0 : v;
        const vRightMax = wheelPivot === WheelPivot.LeftWheel ? v : 0;

        advmotctrls.accTwoEncComplexMotionConfig(vMin, vLeftMax, vRightMax, vMin, accelCalcMotRot, decelCalcMotRot, totalCalcMotRot);
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
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
            const eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev;
            const out = advmotctrls.accTwoEncComplexMotionCompute(eml, emr);
            if (wheelPivot == WheelPivot.LeftWheel && Math.abs(emr) >= totalCalcMotRot ||
                wheelPivot == WheelPivot.RightWheel && Math.abs(eml) >= totalCalcMotRot) {
                break;
            } // Условие выхода: проверяем только движущееся колесо
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, out.pwrLeft, out.pwrRight);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, out.pwrLeft, out.pwrRight);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold); // Удерживание при торможении
    }

}