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

    /**
     * Установить значение максимального времени умного поворота относительно центра колёс в мсек.
     * @param timeOut максимальное время в мс, eg: 1000
     */
    //% blockId="SetSmartSpinTurnTimeOut"
    //% block="максимальное время поворота относительно центра $timeOut|мс"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Повороты с регулятором"
    export function SetSmartSpinTurnTimeOut(timeOut: number) {
        smartSpinTurnTimeOut = timeOut;
    }

    /**
     * Установить значение максимального времени умного поворота относительно колёса в мсек.
     * @param timeOut максимальное время в мс, eg: 1000
     */
    //% blockId="SetSmartPivotTurnTimeOut"
    //% block="максимальное время поворота относительно колеса $timeOut|мс"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства поворотов с регулятором"
    export function SetSmartPivotTurnTimeOut(timeOut: number) {
        smartPivotTurnTimeOut = timeOut;
    }

    /**
     * Установить значение времени дорегулирования при умном повороте в мс.
     * @param timeOut максимальное время в мс, eg: 200
     */
    //% blockId="SetSmartTurnDeregTimeOut"
    //% block="максимальное время дорегулирования умного поворота $timeOut|мс"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства поворотов с регулятором"
    export function SetSmartTurnDeregTimeOut(timeOut: number) {
        smartTurnDeregTimeOut = timeOut;
    }

    /**
     * Установить значение условия ошибки при умном повороте.
     * @param maxErr максимальная ошибка, eg: 10
     */
    //% blockId="SetSmartTurnConditionErrDifference"
    //% block="максимальная ошибка при умном повороте $maxErr| определения окончания"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства поворотов с регулятором"
    export function SetSmartTurnConditionErrDifference(maxErr: number) {
        smartTurnConditionErrDifference = maxErr;
    }

    /**
     * Установить значение условия управляющего воздействия регулятора при умном повороте.
     * @param maxU максимальное управляющее воздействие, eg: 10
     */
    //% blockId="SetSmartTurnConditionRegDifference"
    //% block="максимальное значение управляющего воздействия при умном повороте $maxU| определения окончания"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства поворотов с регулятором"
    export function SetSmartTurnConditionRegDifference(maxU: number) {
        smartTurnConditionRegDifference = maxU;
    }

    /**
     * Rotation relative to the center of the wheels with a regulator.
     * Поворот относительно центра колёс c регулятором.
     * @param deg угол в градусах поворота в градусах, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param speed максимальная скорость поворота, eg: 60
     * @param debug отладка на экран, eg: false
     */
    //% blockId="SmartSpinTurn"
    //% block="умный поворот на $deg|° с $speed|\\% относительно центра колёс|| параметры = $params| отдалка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="99"
    //% group="Повороты с регулятором"
    export function SmartSpinTurn(deg: number, params?: custom.LineFollowInterface, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartSpinTurnSpeed = params.speed;
            if (params.Kp) smartSpinTurnKp = params.Kp;
            if (params.Ki) smartSpinTurnKi = params.Ki;
            if (params.Kd) smartSpinTurnKd = params.Kd;
            if (params.N) smartSpinTurnN = params.N;
        }

        let lMotEncPrev = chassis.leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        let rMotEncPrev = chassis.rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        let calcMotRot = Math.round(deg * chassis.getBaseLength() / chassis.getWheelRadius()); // Расчёт угла поворота моторов для поворота

        automation.pid2.setGains(smartSpinTurnKp, smartSpinTurnKi, smartSpinTurnKd); // Установка коэффициентов ПИД регулятора
        automation.pid2.setDerivativeFilter(smartSpinTurnN); // Установить фильтр дифференциального регулятора
        automation.pid2.setControlSaturation(-100, 100); // Устанавливаем интервал ПИД регулятора
        automation.pid2.reset(); // Сброс ПИД регулятора

        let isTurned = false; // Флажок о повороте
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        let deregStartTime = 0; // Переменная для хранения времени старта таймера дорегулирования 
        let startTime = control.millis(); // Стартовое время алгоритма
        while (true) { // Цикл регулирования
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            if (isTurned && currTime - deregStartTime >= smartTurnDeregTimeOut || currTime - startTime >= smartSpinTurnTimeOut) break; // Дорегулируемся
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev; // Значение энкодера с левого мотора в текущий момент
            let rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значение энкодера с правого мотора в текущий момент
            let errorL = calcMotRot - lMotEnc; // Ошибки регулирования левой стороны
            let errorR = calcMotRot * -1 - rMotEnc; // Ошибки регулирования правой стороны
            let error = errorL - errorR; // Расчитываем общую ошибку
            automation.pid2.setPoint(error); // Передаём ошибку регулятору
            let u = automation.pid2.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            u = Math.constrain(u, -smartSpinTurnSpeed, smartSpinTurnSpeed); // Ограничение скорости
            if (!isTurned && Math.abs(error) <= smartTurnConditionErrDifference && Math.abs(u) <= smartTurnConditionRegDifference) { // Если почти повернулись до конца при маленькой ошибке и маленькой мощности регулятора
                isTurned = true; // Повернулись до нужного градуса
                deregStartTime = control.millis(); // Время старта таймер времени для дорегулирования
                music.playToneInBackground(587, 50); // Сигнал начале дорегулирования
            }
            chassis.leftMotor.run(u); chassis.rightMotor.run(-u); // Передаём управляющее воздействие на моторы
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
        chassis.leftMotor.setBrake(true); chassis.rightMotor.setBrake(true); // Установка тормоз с удержанием на моторы
        chassis.leftMotor.stop(); chassis.rightMotor.stop(); // Остановка моторов
    }

    /**
     * Turn relative to the left or right wheel with a regulator.
     * Поворот относительно левого или правого колеса c регулятором.
     * @param deg угол в градусах поворота, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param speed максимальная скорость поворота, eg: 60
     * @param wheelPivot относительно колеса, eg: WheelPivot.LeftWheel
     * @param debug отладка на экран, eg: false
     */
    //% blockId="SmartPivotTurn"
    //% block="умный поворот на $deg|° с $speed|\\% относительно $wheelPivot|колеса|| параметры = $params| отладка %debug"
    //% block.loc.ru="умный поворот на $deg|° с $speed|\\% относительно $wheelPivot|колеса|| параметры = $params| отладка %debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="98"
    //% group="Повороты с регулятором"
    export function SmartPivotTurn(deg: number, wheelPivot: WheelPivot, params?: custom.LineFollowInterface, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartPivotTurnSpeed = params.speed;
            if (params.Kp) smartPivotTurnKp = params.Kp;
            if (params.Ki) smartPivotTurnKi = params.Ki;
            if (params.Kd) smartPivotTurnKd = params.Kd;
            if (params.N) smartPivotTurnN = params.N;
        }

        chassis.leftMotor.setBrake(true); chassis.rightMotor.setBrake(true); // Установить жёсткий тормоз для моторов
        let motEncPrev = 0; // Инициализируем переменную хранения значения с энкодера мотора
        if (wheelPivot == WheelPivot.LeftWheel) { // Записываем текущее значение с энкодера нужного мотора и ставим тормоз нужному мотору
            chassis.leftMotor.stop(); // Тормоз на мотор
            motEncPrev = chassis.rightMotor.angle(); // Если вращаться нужно вокруг левого, тогда записываем с правого
        } else if (wheelPivot == WheelPivot.RightWheel) {
            chassis.rightMotor.stop(); // Тормоз на мотор
            motEncPrev = chassis.leftMotor.angle(); // Если вращаться нужно вокруг правого, тогда записываем с левого
        }
        let calcMotRot = Math.round(((deg * chassis.getBaseLength()) / chassis.getWheelRadius()) * 2); // Рассчитываем сколько градусов вращать мотор
        
        automation.pid2.setGains(smartPivotTurnKp, smartPivotTurnKi, smartPivotTurnKd); // Устанавливаем коэффиценты ПИД регулятора
        automation.pid2.setDerivativeFilter(smartPivotTurnN); // Установить фильтр дифференциального регулятора
        automation.pid2.setControlSaturation(-100, 100); // Устанавливаем интервал ПИД регулятора
        automation.pid2.reset(); // Сбросить ПИД регулятора

        let motEnc = 0; // Переменная для хранения значения с энкодера
        let isTurned = false; // Флажок о повороте
        let deregStartTime = 0; // Переменная для хранения времени старта таймера дорегулирования 
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        let startTime = control.millis(); // Стартовое время алгоритма
        while (true) { // Цикл регулирования
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            if (wheelPivot == WheelPivot.LeftWheel) motEnc = chassis.rightMotor.angle() - motEncPrev; // Значение левого энкодера мотора в текущий момент
            else if (wheelPivot == WheelPivot.RightWheel) motEnc = chassis.leftMotor.angle() - motEncPrev; // Значение правого энкодера мотора в текущий момент
            let error = calcMotRot - motEnc; // Ошибка регулирования
            if (isTurned && currTime - deregStartTime >= smartTurnDeregTimeOut || currTime - startTime >= smartPivotTurnTimeOut) break; // Дорегулируемся
            automation.pid2.setPoint(error); // Передаём ошибку регулятору
            let U = automation.pid2.compute(dt, 0); // Записываем в переменную управляющее воздействие регулятора
            U = Math.constrain(U, -smartPivotTurnSpeed, smartPivotTurnSpeed); // Ограничить скорость по входному параметру
            if (!isTurned && Math.abs(error) <= smartTurnConditionErrDifference && Math.abs(U) <= smartTurnConditionRegDifference) { // Если почти повернулись до конца
                isTurned = true; // Повернулись до нужного градуса
                deregStartTime = control.millis(); // Время старта таймер времени для дорегулирования
                music.playToneInBackground(587, 50); // Сигнал начале дорегулирования
            }
            if (wheelPivot == WheelPivot.LeftWheel) chassis.rightMotor.run(U); // Передаём правому мотору управляющее воздействие
            else if (wheelPivot == WheelPivot.RightWheel) chassis.leftMotor.run(U); // Передаём левому мотору управляющее воздействие
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
        chassis.leftMotor.stop(); chassis.rightMotor.stop(); // Остановить моторы
    }
    
}