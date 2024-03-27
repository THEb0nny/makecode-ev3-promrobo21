namespace motions {

    // Интерфейс перадачи параметров движения по линии
    export interface LineFollowInreface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    /**
     * Пустые праметры для движения.
     */
    //% blockId="SetLineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden=true
    //% weight="99"
    //% group="Params"
    export function SetLineFollowEmptyParams(): LineFollowInreface {
        return null;
    }

    /**
     * Параметры для движения с возможностью установить скорость, Kp.
     */
    //% blockId="SetLineFollow1Params"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="98"
    //% group="Params"
    export function SetLineFollow1Params(newSpeed?: number): LineFollowInreface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Параметры для движения с возможностью установить скорость, Kp.
     */
    //% blockId="SetLineFollow2Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="97"
    //% group="Params"
    export function SetLineFollow2Params(newSpeed?: number, newKp?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp
        };
    }

    /**
     * Параметры для движения с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetLineFollow4Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="96"
    //% group="Params"
    export function SetLineFollow4Params(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Kd: newKd,
            N: newN
        };
    }

    /**
     * Параметры для движения с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetLineFollowAllParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="95"
    //% group="Params"
    export function SetLineFollowAllParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            N: newN
        };
    }

}

namespace motions {

    /**
     * Функция движения по линии до перекрёстка.
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToIntersection"
    //% block="движение по линии до перекрёстка с действием после $actionAfterMotion||параметры = $params| отладка $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% params.shadow=SetLineFollowEmptyParams
    //% weight="99"
    //% group="Движение по линии"
    export function LineFollowToIntersection(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_2S = params.speed;
            if (params.Kp) LW_KP_2S = params.Kp;
            if (params.Ki) LW_KI_2S = params.Ki;
            if (params.Kd) LW_KD_2S = params.Kd;
            if (params.N) LW_N_2S = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_2S); // Команда моторам
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
        custom.ActionAfterMotion(LW_SPEED_2S, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние. Очень грубый метод.
     * @param dist скорость движения, eg: 250
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistance"
    //% block="движение по линии на расстояние $dist|мм с действием после $actionAfterMotion||параметры = $params| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% params.shadow=SetLineFollowEmptyParams
    //% weight="98"
    //% group="Движение по линии"
    export function LineFollowToDistance(dist: number, actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_2S = params.speed;
            if (params.Kp) LW_KP_2S = params.Kp;
            if (params.Ki) LW_KI_2S = params.Ki;
            if (params.Kd) LW_KD_2S = params.Kd;
            if (params.N) LW_N_2S = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_2S); // Команда моторам
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
        custom.ActionAfterMotion(LW_SPEED_2S, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии для определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersaction"
    //% block="движение по линии до перекрёстка слева $lineLocation| c действием после $actionAfterMotion||параметры = $params| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Движение по линии"
    export function LineFollowToLeftIntersaction(lineLocation: LineLocation, actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (lineLocation == LineLocation.Inside) {
            LineFollowToLeftIntersectionInside(actionAfterMotion, params, debug);
        } else if (lineLocation == LineLocation.Outside) {
            LineFollowToLeftIntersectionOutside(actionAfterMotion, params, debug);
        }
    }

    // Функция движения по линии правым датчиком до перекрёстка слева с линией между датчиками
    function LineFollowToLeftIntersectionInside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_RS = params.speed;
            if (params.Kp) LW_KP_RS = params.Kp;
            if (params.Ki) LW_KI_RS = params.Ki;
            if (params.Kd) LW_KD_RS = params.Kd;
            if (params.N) LW_N_RS = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_RS); // Команда моторам
            brick.clearScreen(); // Очистка экрана
            brick.printValue("refLCS", refLCS, 1);
            brick.printValue("refRCS", refRCS, 2);
            brick.printValue("error", error, 3);
            brick.printValue("U", U, 4);
            brick.printValue("dt", dt, 12);
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(LW_SPEED_RS, actionAfterMotion); // Действие после алгоритма движения
    }

    // Функция движения по линии правым датчиком до перекрёстка слева с линией извне
    function LineFollowToLeftIntersectionOutside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_RS = params.speed;
            if (params.Kp) LW_KP_RS = params.Kp;
            if (params.Ki) LW_KI_RS = params.Ki;
            if (params.Kd) LW_KD_RS = params.Kd;
            if (params.N) LW_N_RS = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_RS); // Команда моторам
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
        custom.ActionAfterMotion(LW_SPEED_RS, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии для определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param speed скорость движения, eg: 60
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToRightIntersection"
    //% block="движение по линии до перекрёстка справа $lineLocation| c действием после $actionAfterMotion||параметры = $params| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% inlineInputMode="inline"
    //% weight="79"
    //% group="Движение по линии"
    export function LineFollowToRightIntersection(lineLocation: LineLocation, actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (lineLocation == LineLocation.Inside) {
            LineFollowToRightIntersectionInside(actionAfterMotion, params, debug);
        } else if (lineLocation == LineLocation.Outside) {
            LineFollowToRightIntersectionOutside(actionAfterMotion, params, debug);
        }
    }

    // Функция движения по линии левым датчиком до перекрёстка справа
    function LineFollowToRightIntersectionInside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_LS = params.speed;
            if (params.Kp) LW_KP_LS = params.Kp;
            if (params.Ki) LW_KI_LS = params.Ki;
            if (params.Kd) LW_KD_LS = params.Kd;
            if (params.N) LW_N_LS = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_LS); // Команда моторам
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
        custom.ActionAfterMotion(LW_SPEED_LS, actionAfterMotion); // Действие после алгоритма движения
    }

    // Функция движения по линии левым датчиком до перекрёстка справа с линией извне
    function LineFollowToRightIntersectionOutside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) LW_SPEED_LS = params.speed;
            if (params.Kp) LW_KP_LS = params.Kp;
            if (params.Ki) LW_KI_LS = params.Ki;
            if (params.Kd) LW_KD_LS = params.Kd;
            if (params.N) LW_N_LS = params.N;
        }

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
            CHASSIS_MOTORS.steer(U, LW_SPEED_LS); // Команда моторам
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
        custom.ActionAfterMotion(LW_SPEED_LS, actionAfterMotion); // Действие после алгоритма движения
    }

}