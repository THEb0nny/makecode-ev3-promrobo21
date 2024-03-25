namespace motions {

    /**
     * Функция движения по линии до перекрёстка.
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToIntersaction"
    //% block="движение по линии до перекрёстка на $speed|\\% c действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="1"
    //% group="Движение по линии"
    export function LineFollowToIntersaction(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        automation.pid1.setGains(LW_KP_2S, LW_KI_2S, LW_KD_2S); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            if (refLCS < LW_TRESHOLD && refRCS < LW_TRESHOLD) break; // Проверка на перекрёсток
            let error = refLCS - refRCS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refRCS", refRCS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

    /**
     * Движение по линии на расстояние. Очень грубый метод.
     * @param dist скорость движения, eg: 250
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDist"
    //% block="движение по линии на расстояние $dist|на %speed|\\% с действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="2"
    //% group="Движение по линии"
    export function LineFollowToDist(dist: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        let lMotEncPrev = CHASSIS_L_MOTOR.angle(), rMotEncPrev = CHASSIS_R_MOTOR.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * WHEELS_D)) * 360; // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(LW_KP_2S, LW_KI_2S, LW_KD_2S); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = CHASSIS_L_MOTOR.angle(), rMotEnc = CHASSIS_R_MOTOR.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = LW_SET_POINT - refRCS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refRCS", refRCS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

    /**
     * Функция движения по линии для определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersaction"
    //% block="движение по линии до перекрёстка слева $lineLocation|на $speed|\\% c действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% inlineInputMode="inline"
    //% weight="1"
    //% group="Движение по линии"
    export function LineFollowToLeftIntersaction(lineLocation: LineLocation, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        if (lineLocation == LineLocation.Inside) {
            LineFollowToLeftIntersactionInside(speed, actionAfterMotion, debug);
        } else if (lineLocation == LineLocation.Outside) {
            LineFollowToLeftIntersactionOutside(speed, actionAfterMotion, debug);
        }
    }

    // Функция движения по линии правым датчиком до перекрёстка слева с линией между датчиками
    function LineFollowToLeftIntersactionInside(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        automation.pid1.setGains(LW_KP_RS, LW_KI_RS, LW_KD_RS); // Установка коэффицентов регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора
        
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = LW_SET_POINT - refRCS; // Ошибка регулирования
            if (Math.abs(error) <= LW_CONDITION_DETECT_MAX_ERR && refLCS < LW_TRESHOLD) break; // Проверка на перекрёсток, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            brick.clearScreen(); // Очистка экрана
            brick.printValue("refLCS", refLCS, 1);
            brick.printValue("refRCS", refRCS, 2);
            brick.printValue("error", error, 3);
            brick.printValue("U", U, 4);
            brick.printValue("dt", dt, 12);
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

    // Функция движения по линии правым датчиком до перекрёстка слева с линией извне
    function LineFollowToLeftIntersactionOutside(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        automation.pid1.setGains(LW_KP_RS, LW_KI_RS, LW_KD_RS); // Установка коэффицентов регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора
        
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = refRCS - LW_SET_POINT; // Ошибка регулирования
            if (Math.abs(error) <= LW_CONDITION_DETECT_MAX_ERR && refLCS < LW_TRESHOLD) break; // Проверка на перекрёсток, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refRCS", refRCS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

    /**
     * Функция движения по линии для определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToRightIntersaction"
    //% block="движение по линии до перекрёстка справа $lineLocation|на $speed|\\% c действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% inlineInputMode="inline"
    //% weight="1"
    //% group="Движение по линии"
    export function LineFollowToRightIntersaction(lineLocation: LineLocation, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        if (lineLocation == LineLocation.Inside) {
            LineFollowToRightIntersactionInside(speed, actionAfterMotion, debug);
        } else if (lineLocation == LineLocation.Outside) {
            LineFollowToRightIntersactionOutside(speed, actionAfterMotion, debug);
        }
    }

    // Функция движения по линии левым датчиком до перекрёстка справа
    function LineFollowToRightIntersactionInside(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        automation.pid1.setGains(LW_KP_LS, LW_KI_LS, LW_KD_LS); // Установка коэффицентов регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора
        
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = refLCS - LW_SET_POINT; // Ошибка регулирования
            if (Math.abs(error) <= LW_CONDITION_DETECT_MAX_ERR && refRCS < LW_TRESHOLD) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refRCS", refRCS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

    // Функция движения по линии левым датчиком до перекрёстка справа с линией извне
    function LineFollowToRightIntersactionOutside(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        automation.pid1.setGains(LW_KP_LS, LW_KI_LS, LW_KD_LS); // Установка коэффицентов регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора

        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = L_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_CS.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = LW_SET_POINT - refLCS; // Ошибка регулирования
            if (Math.abs(error) <= LW_CONDITION_DETECT_MAX_ERR && refRCS < LW_TRESHOLD) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздейвствие
            CHASSIS_MOTORS.steer(U, speed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refRCS", refRCS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(speed, actionAfterMotion);
    }

}