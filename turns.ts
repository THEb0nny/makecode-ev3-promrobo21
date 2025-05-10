namespace chassis {

    /**
     * Synchronized rotation of the chassis relative to the center at the desired angle at a certain speed.
     * For example, if deg > 0, then the robot will rotate to the right, and if deg < 0, then to the left.
     * The speed must be positive!
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
        //if (!motorsPair) return;
        if (deg == 0 || speed == 0) {
            stop(true);
            return;
        } else if (speed < 0) {
            console.log("Error: the rotation speed relative to the center is negative!");
            control.assert(false, 7);
        }
        speed = Math.clamp(0, 100, speed >> 0); // Ограничиваем скорость от 0 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем значение с энкодера с левого двигателя, правого двигателя перед запуском
        const calcMotRot = Math.round(deg * getBaseLength() / getWheelDiametr()); // Расчёт угла поворота моторов для поворота
        if (deg > 0) advmotctrls.syncMotorsConfig(speed, -speed);
        else if (deg < 0) advmotctrls.syncMotorsConfig(-speed, speed);
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
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
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(true); // Удерживание при торможении
    }

    /**
     * Synchronized rotation to the desired angle relative to one of the wheels.
     * A positive speed is set for forward rotation, and a negative speed is set for backward rotation.
     * The value of the rotation angle is always positive!
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
        //if (!motorsPair) return;
        if (deg == 0 || speed == 0) {
            stop(true);
            return;
        } else if (deg < 0) {
            console.log("Error: the angle of rotation relative to the wheel is negative!");
            control.assert(false, 8);
        }
        speed = Math.clamp(-100, 100, speed >> 0); // Ограничиваем скорость от -100 до 100 и отсекаем дробную часть
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Считываем с левого мотора и  правого мотора значения энкодера перед стартом алгаритма
        const calcMotRot = Math.round(((Math.abs(deg) * getBaseLength()) / getWheelDiametr()) * 2); // Расчёт угла поворота моторов для поворота
        stop(true, 0); // Установить тормоз и удержание моторов перед поворотом
        if (wheelPivot == WheelPivot.LeftWheel) advmotctrls.syncMotorsConfig(0, speed);
        else if (wheelPivot == WheelPivot.RightWheel) advmotctrls.syncMotorsConfig(speed, 0);
        else return;
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервалов регулирования
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
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            if (wheelPivot == WheelPivot.LeftWheel) rightMotor.run(powers.pwrRight);
            else if (wheelPivot == WheelPivot.RightWheel) leftMotor.run(powers.pwrLeft);
            control.pauseUntilTime(currTime, 1);
        }
        stop(true); // Удерживание при торможении
    }

    /**
     * Synchronized rotation of the chassis relative to the center at the desired angle at a certain speed.
     * For example, if deg > 0, then the robot will rotate to the right, and if deg < 0, then to the left.
     * The speed must be positive!
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
     * Synchronized rotation to the desired angle relative to one of the wheels.
     * A positive speed is set for forward rotation, and a negative speed is set for backward rotation.
     * The value of the rotation angle is always positive!
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

namespace chassis {

    export let smartSpinTurnTimeOut = 800; // Максимальное время умного поворота относительно центра в мм
    export let smartPivotTurnTimeOut = 1000; // Максимальное время умного поворота относительно колеса в мм
    export let smartTurnDeregTimeOut = 200; // Время дорегулирования в умном повороте

    export let smartTurnConditionErrDifference = 10; // Пороговое значения ошибки для регулятора умного поворота, что поворот выполнен
    export let smartTurnConditionRegDifference = 10; // Пороговое значение регулятора (мощности регулятора) умного поворота для определения выполненного поворота

    export let smartSpinTurnSpeed = 50; // Переменная для хранения скорости при повороте относительно центра оси
    export let smartSpinTurnKp = 0.25; // Переменная для хранения коэффицента пропорционального регулятора при повороте относительно центра оси
    export let smartSpinTurnKi = 0; // Переменная для хранения коэффицента интегорального регулятора при повороте относительно центра оси
    export let smartSpinTurnKd = 2; // Переменная для хранения коэффицента дифференциального регулятора при повороте относительно центра оси
    export let smartSpinTurnN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при повороте относительно центра оси

    export let smartPivotTurnSpeed = 60; // Переменная для хранения скорости при повороте относительно колеса
    export let smartPivotTurnKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при повороте относительно колеса
    export let smartPivotTurnKi = 0; // Переменная для хранения коэффицента интегорального регулятора при повороте относительно колеса
    export let smartPivotTurnKd = 2; // Переменная для хранения коэффицента дифференциального регулятора при повороте относительно колеса
    export let smartPivotTurnN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при повороте относительно колеса

    export const pidSmartTurns = new automation.PIDController(); // PID для умных поворотов

    /**
     * Установить значение максимального времени умного поворота относительно центра колёс в мсек.
     * @param timeOut максимальное время в мс, eg: 1000
     */
    //% blockId="SetSmartSpinTurnTimeOut"
    //% block="максимальное время поворота относительно центра $timeOut мс"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% subcategory="Повороты 2"
    //% group="Свойства умных поворотов"
    export function setSmartSpinTurnTimeOut(timeOut: number) {
        smartSpinTurnTimeOut = timeOut;
    }

    /**
     * Установить значение максимального времени умного поворота относительно колёса в мсек.
     * @param timeOut максимальное время в мс, eg: 1000
     */
    //% blockId="SetSmartPivotTurnTimeOut"
    //% block="максимальное время поворота относительно колеса $timeOut мс"
    //% inlineInputMode="inline"
    //% weight="98" blockGap="8"
    //% subcategory="Повороты 2"
    //% group="Свойства умных поворотов"
    export function setSmartPivotTurnTimeOut(timeOut: number) {
        smartPivotTurnTimeOut = timeOut;
    }

    /**
     * Установить значение времени дорегулирования при умном повороте в мс.
     * @param timeOut максимальное время в мс, eg: 200
     */
    //% blockId="SetSmartTurnDeregTimeOut"
    //% block="максимальное время дорегулирования умного поворота $timeOut мс"
    //% inlineInputMode="inline"
    //% weight="97"
    //% subcategory="Повороты 2"
    //% group="Свойства умных поворотов"
    export function setSmartTurnDeregTimeOut(timeOut: number) {
        smartTurnDeregTimeOut = timeOut;
    }

    /**
     * Установить значение условия ошибки при умном повороте.
     * @param maxErr максимальная ошибка, eg: 10
     */
    //% blockId="SetSmartTurnConditionErrDifference"
    //% block="максимальная ошибка при умном повороте $maxErr определения окончания"
    //% inlineInputMode="inline"
    //% weight="96" blockGap="8"
    //% subcategory="Повороты 2"
    //% group="Свойства умных поворотов"
    export function setSmartTurnConditionErrDifference(maxErr: number) {
        smartTurnConditionErrDifference = maxErr;
    }

    /**
     * Установить значение условия управляющего воздействия регулятора при умном повороте.
     * @param maxU максимальное управляющее воздействие, eg: 10
     */
    //% blockId="SetSmartTurnConditionRegDifference"
    //% block="максимальное значение управляющего воздействия при умном повороте $maxU определения окончания"
    //% inlineInputMode="inline"
    //% weight="96" blockGap="8"
    //% subcategory="Повороты 2"
    //% group="Свойства умных поворотов"
    export function setSmartTurnConditionRegDifference(maxU: number) {
        smartTurnConditionRegDifference = maxU;
    }

    /**
     * Rotation relative to the center of the wheels with a regulator.
     * Поворот относительно центра колёс c регулятором.
     * @param deg угол в градусах поворота в градусах, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param debug отладка на экран, eg: false
     */
    //% blockId="SmartSpinTurn"
    //% block="smart turn at $deg\\° relative center of wheels||params = $params|debug $debug"
    //% block.loc.ru="умный поворот на $deg\\° относительно центра оси колёс||параметры = $params|отдалка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% debug.shadow="toggleOnOff"
    //% weight="99" blockGap="8"
    //% subcategory="Повороты 2"
    //% group="Умные повороты с регулятором"
    export function smartSpinTurn(deg: number, params?: params.LineFollow, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartSpinTurnSpeed = params.speed;
            if (params.Kp) smartSpinTurnKp = params.Kp;
            if (params.Ki) smartSpinTurnKi = params.Ki;
            if (params.Kd) smartSpinTurnKd = params.Kd;
            if (params.N) smartSpinTurnN = params.N;
        }
        const lMotEncPrev = leftMotor.angle(), rMotEncPrev = rightMotor.angle(); // Считываем значение с энкодера левого мотора и правого мотора перед стартом алгаритма
        const calcMotRot = Math.round(deg * getBaseLength() / getWheelDiametr()); // Расчёт угла поворота моторов для поворота
        pidSmartTurns.setGains(smartSpinTurnKp, smartSpinTurnKi, smartSpinTurnKd); // Установка коэффициентов ПИД регулятора
        pidSmartTurns.setDerivativeFilter(smartSpinTurnN); // Установить фильтр дифференциального регулятора
        pidSmartTurns.setControlSaturation(-100, 100); // Устанавливаем интервал ПИД регулятора
        pidSmartTurns.reset(); // Сброс ПИД регулятора
        let isTurned = false; // Флажок о повороте
        let deregStartTime = 0; // Переменная для хранения времени старта таймера дорегулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        let startTime = control.millis(); // Стартовое время алгоритма
        while (true) { // Цикл регулирования
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            if (isTurned && currTime - deregStartTime >= smartTurnDeregTimeOut || currTime - startTime >= smartSpinTurnTimeOut) break; // Дорегулируемся
            const lMotEnc = leftMotor.angle() - lMotEncPrev; // Значение энкодера с левого мотора в текущий момент
            const rMotEnc = rightMotor.angle() - rMotEncPrev; // Значение энкодера с правого мотора в текущий момент
            const errorL = calcMotRot - lMotEnc; // Ошибки регулирования левой стороны
            const errorR = calcMotRot * -1 - rMotEnc; // Ошибки регулирования правой стороны
            const error = errorL - errorR; // Расчитываем общую ошибку
            pidSmartTurns.setPoint(error); // Передаём ошибку регулятору
            let u = pidSmartTurns.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            u = Math.constrain(u, -smartSpinTurnSpeed, smartSpinTurnSpeed); // Ограничение скорости
            if (!isTurned && Math.abs(error) <= smartTurnConditionErrDifference && Math.abs(u) <= smartTurnConditionRegDifference) { // Если почти повернулись до конца при маленькой ошибке и маленькой мощности регулятора
                isTurned = true; // Повернулись до нужного градуса
                deregStartTime = control.millis(); // Время старта таймер времени для дорегулирования
                music.playToneInBackground(587, 50); // Сигнал начале дорегулирования
            }
            setSpeedsCommand(u, -u); // Передаём управляющее воздействие как скорости на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("calcMotRot", calcMotRot, 1);
                brick.showValue("lMotEnc", lMotEnc, 2);
                brick.showValue("rMotEnc", rMotEnc, 3);
                brick.showValue("errorL", errorL, 4);
                brick.showValue("errorR", errorR, 5);
                brick.showValue("error", error, 6);
                brick.showValue("u", u, 7);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.playToneInBackground(622, 100); // Издаём сигнал завершения дорегулирования
        stop(true); // Остановка моторов с удержанием
    }

    /**
     * Turn relative to the left or right wheel with a regulator.
     * Поворот относительно левого или правого колеса c регулятором.
     * @param deg угол в градусах поворота, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param wheelPivot относительно колеса, eg: WheelPivot.LeftWheel
     * @param debug отладка на экран, eg: false
     */
    //% blockId="SmartPivotTurn"
    //% block="smart turn at $deg\\° relative $wheelPivot wheel||params = $params|debug %debug"
    //% block.loc.ru="умный поворот на $deg\\° относительно $wheelPivot колеса||параметры = $params|отладка %debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% debug.shadow="toggleOnOff"
    //% weight="98"
    //% subcategory="Повороты 2"
    //% group="Умные повороты с регулятором"
    export function smartPivotTurn(deg: number, wheelPivot: WheelPivot, params?: params.LineFollow, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartPivotTurnSpeed = params.speed;
            if (params.Kp) smartPivotTurnKp = params.Kp;
            if (params.Ki) smartPivotTurnKi = params.Ki;
            if (params.Kd) smartPivotTurnKd = params.Kd;
            if (params.N) smartPivotTurnN = params.N;
        }
        stop(true, 0); // Остановить и установить жёсткий тормоз для моторов
        let motEncPrev = 0; // Инициализируем переменную хранения значения с энкодера мотора
        // Записываем текущее значение с энкодера нужного мотора и ставим тормоз нужному мотору
        if (wheelPivot == WheelPivot.LeftWheel) motEncPrev = rightMotor.angle(); // Если вращаться нужно вокруг левого, тогда записываем с правого
        else if (wheelPivot == WheelPivot.RightWheel) motEncPrev = leftMotor.angle(); // Если вращаться нужно вокруг правого, тогда записываем с левого
        let calcMotRot = Math.round(((deg * getBaseLength()) / getWheelDiametr()) * 2); // Рассчитываем сколько градусов вращать мотор
        pidSmartTurns.setGains(smartPivotTurnKp, smartPivotTurnKi, smartPivotTurnKd); // Устанавливаем коэффиценты ПИД регулятора
        pidSmartTurns.setDerivativeFilter(smartPivotTurnN); // Установить фильтр дифференциального регулятора
        pidSmartTurns.setControlSaturation(-100, 100); // Устанавливаем интервал ПИД регулятора
        pidSmartTurns.reset(); // Сбросить ПИД регулятора
        let motEnc = 0; // Переменная для хранения значения с энкодера
        let isTurned = false; // Флажок о повороте
        let deregStartTime = 0; // Переменная для хранения времени старта таймера дорегулирования 
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        let startTime = control.millis(); // Стартовое время алгоритма
        while (true) { // Цикл регулирования
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            if (wheelPivot == WheelPivot.LeftWheel) motEnc = rightMotor.angle() - motEncPrev; // Значение левого энкодера мотора в текущий момент
            else if (wheelPivot == WheelPivot.RightWheel) motEnc = leftMotor.angle() - motEncPrev; // Значение правого энкодера мотора в текущий момент
            let error = calcMotRot - motEnc; // Ошибка регулирования
            if (isTurned && currTime - deregStartTime >= smartTurnDeregTimeOut || currTime - startTime >= smartPivotTurnTimeOut) break; // Дорегулируемся
            pidSmartTurns.setPoint(error); // Передаём ошибку регулятору
            let U = pidSmartTurns.compute(dt, 0); // Записываем в переменную управляющее воздействие регулятора
            U = Math.constrain(U, -smartPivotTurnSpeed, smartPivotTurnSpeed); // Ограничить скорость по входному параметру
            if (!isTurned && Math.abs(error) <= smartTurnConditionErrDifference && Math.abs(U) <= smartTurnConditionRegDifference) { // Если почти повернулись до конца
                isTurned = true; // Повернулись до нужного градуса
                deregStartTime = control.millis(); // Время старта таймер времени для дорегулирования
                music.playToneInBackground(587, 50); // Сигнал начале дорегулирования
            }
            if (wheelPivot == WheelPivot.LeftWheel) rightMotor.run(U); // Передаём правому мотору управляющее воздействие
            else if (wheelPivot == WheelPivot.RightWheel) leftMotor.run(U); // Передаём левому мотору управляющее воздействие
            if (debug) { // Выводим для отладки на экран
                brick.clearScreen();
                brick.showValue("calcMotRot", calcMotRot, 1);
                brick.showValue("motEnc", motEnc, 2);
                brick.showValue("error", error, 3);
                brick.showValue("U", U, 4);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.playToneInBackground(622, 100); // Издаём сигнал завершения дорегулирования
        stop(true); // Остановить моторы
    }
    
}