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
    export let smartSpinTurnKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при повороте относительно центра оси

    export let smartPivotTurnSpeed = 60; // Переменная для хранения скорости при повороте относительно колеса
    export let smartPivotTurnKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при повороте относительно колеса
    export let smartPivotTurnKi = 0; // Переменная для хранения коэффицента интегорального регулятора при повороте относительно колеса
    export let smartPivotTurnKd = 2; // Переменная для хранения коэффицента дифференциального регулятора при повороте относительно колеса
    export let smartPivotTurnKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при повороте относительно колеса

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
            if (params.Kf) smartSpinTurnKf = params.Kf;
        }
        const lMotEncPrev = leftMotor.angle(), rMotEncPrev = rightMotor.angle(); // Считываем значение с энкодера левого мотора и правого мотора перед стартом алгаритма
        const calcMotRot = Math.round(deg * getBaseLength() / getWheelDiametr()); // Расчёт угла поворота моторов для поворота
        pidSmartTurns.setGains(smartSpinTurnKp, smartSpinTurnKi, smartSpinTurnKd); // Установка коэффициентов ПИД регулятора
        pidSmartTurns.setDerivativeFilter(smartSpinTurnKf); // Установить фильтр дифференциального регулятора
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
        stop(Braking.Hold); // Остановка моторов с удержанием
    }

    /**
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
            if (params.Kf) smartPivotTurnKf = params.Kf;
        }
        stop(Braking.Hold); // Остановить и установить жёсткий тормоз для моторов
        let motEncPrev = 0; // Инициализируем переменную хранения значения с энкодера мотора
        // Записываем текущее значение с энкодера нужного мотора и ставим тормоз нужному мотору
        if (wheelPivot == WheelPivot.LeftWheel) motEncPrev = rightMotor.angle(); // Если вращаться нужно вокруг левого, тогда записываем с правого
        else if (wheelPivot == WheelPivot.RightWheel) motEncPrev = leftMotor.angle(); // Если вращаться нужно вокруг правого, тогда записываем с левого
        let calcMotRot = Math.round(((deg * getBaseLength()) / getWheelDiametr()) * 2); // Рассчитываем сколько градусов вращать мотор
        pidSmartTurns.setGains(smartPivotTurnKp, smartPivotTurnKi, smartPivotTurnKd); // Устанавливаем коэффиценты ПИД регулятора
        pidSmartTurns.setDerivativeFilter(smartPivotTurnKf); // Установить фильтр дифференциального регулятора
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
        stop(Braking.Hold); // Остановить моторы
    }

}