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
    //% block="максимальное время поворота относительно центра $timeOut мс"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства умных поворотов"
    export function SetSmartSpinTurnTimeOut(timeOut: number) {
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
    //% group="Свойства умных поворотов"
    export function SetSmartPivotTurnTimeOut(timeOut: number) {
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
    //% group="Свойства умных поворотов"
    export function SetSmartTurnDeregTimeOut(timeOut: number) {
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
    //% group="Свойства умных поворотов"
    export function SetSmartTurnConditionErrDifference(maxErr: number) {
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
    //% group="Свойства умных поворотов"
    export function SetSmartTurnConditionRegDifference(maxU: number) {
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
    //% group="Умные повороты с регулятором"
    export function SmartSpinTurn(deg: number, params?: params.LineFollowInterface, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartSpinTurnSpeed = params.speed;
            if (params.Kp) smartSpinTurnKp = params.Kp;
            if (params.Ki) smartSpinTurnKi = params.Ki;
            if (params.Kd) smartSpinTurnKd = params.Kd;
            if (params.N) smartSpinTurnN = params.N;
        }

        let lMotEncPrev = leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        let rMotEncPrev = rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        let calcMotRot = Math.round(deg * getBaseLength() / getWheelRadius()); // Расчёт угла поворота моторов для поворота

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
            let lMotEnc = leftMotor.angle() - lMotEncPrev; // Значение энкодера с левого мотора в текущий момент
            let rMotEnc = rightMotor.angle() - rMotEncPrev; // Значение энкодера с правого мотора в текущий момент
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
            leftMotor.run(u); rightMotor.run(-u); // Передаём управляющее воздействие на моторы
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
        leftMotor.setBrake(true); rightMotor.setBrake(true); // Установка тормоз с удержанием на моторы
        leftMotor.stop(); rightMotor.stop(); // Остановка моторов
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
    //% group="Умные повороты с регулятором"
    export function SmartPivotTurn(deg: number, wheelPivot: WheelPivot, params?: params.LineFollowInterface, debug: boolean = false) {
        if (deg == 0) return;
        if (params) {
            if (params.speed) smartPivotTurnSpeed = params.speed;
            if (params.Kp) smartPivotTurnKp = params.Kp;
            if (params.Ki) smartPivotTurnKi = params.Ki;
            if (params.Kd) smartPivotTurnKd = params.Kd;
            if (params.N) smartPivotTurnN = params.N;
        }

        leftMotor.setBrake(true); rightMotor.setBrake(true); // Установить жёсткий тормоз для моторов
        let motEncPrev = 0; // Инициализируем переменную хранения значения с энкодера мотора
        if (wheelPivot == WheelPivot.LeftWheel) { // Записываем текущее значение с энкодера нужного мотора и ставим тормоз нужному мотору
            leftMotor.stop(); // Тормоз на мотор
            motEncPrev = rightMotor.angle(); // Если вращаться нужно вокруг левого, тогда записываем с правого
        } else if (wheelPivot == WheelPivot.RightWheel) {
            rightMotor.stop(); // Тормоз на мотор
            motEncPrev = leftMotor.angle(); // Если вращаться нужно вокруг правого, тогда записываем с левого
        }
        let calcMotRot = Math.round(((deg * getBaseLength()) / getWheelRadius()) * 2); // Рассчитываем сколько градусов вращать мотор
        
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
            if (wheelPivot == WheelPivot.LeftWheel) motEnc = rightMotor.angle() - motEncPrev; // Значение левого энкодера мотора в текущий момент
            else if (wheelPivot == WheelPivot.RightWheel) motEnc = leftMotor.angle() - motEncPrev; // Значение правого энкодера мотора в текущий момент
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
        leftMotor.stop(); rightMotor.stop(); // Остановить моторы
    }

    /**
     * Поворот на линию.
     * @param rotateSide в какую сторону вращаться в поиске линии, eg: TurnRotateSide.Left
     * @param speed скорость вращения, eg: 40
     * @param debug отладка на экран, eg: false
    */
    //% blockId="SpinTurnToLine"
    //% block="turn to line $rotateSide at $speed\\% relative to center of wheel axis||debug $debug"
    //% block.loc.ru="поворот до линии $rotateSide на $speed\\% относительно центра оси колёс||отдалка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Повороты на линию"
    export function SpinTurnToLine(rotateSide: TurnRotateSide, speed: number, debug: boolean = false) {
        let sensor: sensors.ColorSensor; // Инициализируем переменную сенсора
        if (rotateSide == TurnRotateSide.Left) sensor = (sensors.leftLineSensor as sensors.ColorSensor);
        else if (rotateSide == TurnRotateSide.Right) sensor = (sensors.rightLineSensor as sensors.ColorSensor);
        sensor.rgbRaw(); // Обращаемся к режиму датчика заранее, чтобы тот включился

        const emlPrev = leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        const emrPrev = rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        let calcMotRot = Math.round(30 * getBaseLength() / getWheelRadius()); // Расчитать градусы для поворота в градусы для мотора

        if (rotateSide == TurnRotateSide.Left) {
            advmotctrls.syncMotorsConfig(-speed, speed);
            calcMotRot *= -1; // Умножаем на -1, чтобы вращаться влево
        } else if (rotateSide == TurnRotateSide.Right) {
            advmotctrls.syncMotorsConfig(speed, -speed);
        }

        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор

        let preTurnIsDone = false; // Переменная - флажок о том, что предварительный поворот выполнен
        let lineIsFound = false; // Переменная - флажок о том, что чёрная линия найдена
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Поворачиваем изначально, чтобы повернуться от линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            let eml = leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if (!preTurnIsDone && (Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) preTurnIsDone = true; // Если предвариательный поворот ещё не выполнен, то проверяем условия
            if (preTurnIsDone) { // Если предварительный поворот выполнен
                const rgbCS = sensor.rgbRaw(); // Получаем от сенсора RGB
                const hsvlCS = sensors.RgbToHsvlConverter(rgbCS); // Переводим RGB в HSV
                const colorCS = sensors.HsvlToColorNum(hsvlCS, sensors.HsvlToColorNumParams(50, 10, 1, 25, 30, 100, 180, 260)); // Узнаём какой цвет
                if (!lineIsFound && colorCS == 1) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && colorCS == 6) break; // Нашли белую часть посли линии
            }
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            leftMotor.run(powers.pwrLeft);
            rightMotor.run(powers.pwrRight);
            control.pauseUntilTime(currTime, 5); // Ожидание выполнения цикла
        }
        levelings.LinePositioning(100, null, debug); // Позиционируемся на линии
    }
    
}