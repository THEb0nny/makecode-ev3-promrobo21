namespace motions {

    // Интерфейс перадачи параметров для алгоритма с регулятором
    export interface LineFollowInreface {
        speed?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        N?: number;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="SetEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% blockHidden=true
    //% weight="99"
    //% group="Params"
    export function SetEmptyParams(): LineFollowInreface {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="Set1Params"
    //% block="speed = $newSpeed\\%"
    //% block.loc.ru="скорость = $newSpeed\\%"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="98"
    //% group="Params"
    export function Set1Params(newSpeed?: number): LineFollowInreface {
        return {
            speed: newSpeed
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp.
     */
    //% blockId="Set2Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="97"
    //% group="Params"
    export function Set2Params(newSpeed?: number, newKp?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="Set4Params"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="96"
    //% group="Params"
    export function Set4Params(newSpeed?: number, newKp?: number, newKd?: number, newN?: number): LineFollowInreface {
        return {
            speed: newSpeed,
            Kp: newKp,
            Kd: newKd,
            N: newN
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
     */
    //% blockId="SetAllParams"
    //% block="speed = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% block.loc.ru="скорость = $newSpeed\\%| Kp = $newKp| Ki = $newKi| Kd = $newKd|| N = $newN"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% newSpeed.defl="50"
    //% newKp.defl="1"
    //% weight="95"
    //% group="Params"
    export function SetAllParams(newSpeed?: number, newKp?: number, newKi?: number, newKd?: number, newN?: number): LineFollowInreface {
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

    let lineFollow2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    let lineFollow2SensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    let lineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    let lineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    let lineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    let lineFollowLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком
    let lineFollowLeftSensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком
    let lineFollowLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком
    let lineFollowLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком
    let lineFollowLeftSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком

    let lineFollowRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком
    let lineFollowRightSensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком
    let lineFollowRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком
    let lineFollowRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком
    let lineFollowRightSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком

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
    //% params.shadow=SetEmptyParams
    //% weight="99"
    //% group="Движение по линии"
    export function LineFollowToIntersection(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) lineFollow2SensorSpeed = params.speed;
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
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
        custom.ActionAfterMotion(lineFollow2SensorSpeed, actionAfterMotion); // Действие после алгоритма движения
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
    //% params.shadow=SetEmptyParams
    //% weight="98"
    //% group="Движение по линии"
    export function LineFollowToDistance(dist: number, actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) lineFollow2SensorSpeed = params.speed;
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        let lMotEncPrev = CHASSIS_L_MOTOR.angle(), rMotEncPrev = CHASSIS_R_MOTOR.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * WHEELS_D)) * 360; // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
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
        custom.ActionAfterMotion(lineFollow2SensorSpeed, actionAfterMotion); // Действие после алгоритма движения
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
    //% params.shadow=SetEmptyParams
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
            if (params.speed) lineFollowRightSensorSpeed = params.speed;
            if (params.Kp) lineFollowRightSensorKp = params.Kp;
            if (params.Ki) lineFollowRightSensorKi = params.Ki;
            if (params.Kd) lineFollowRightSensorKd = params.Kd;
            if (params.N) lineFollowRightSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowRightSensorKp, lineFollowRightSensorKi, lineFollowRightSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowRightSensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollowRightSensorSpeed); // Команда моторам
            brick.clearScreen(); // Очистка экрана
            brick.printValue("refLCS", refLCS, 1);
            brick.printValue("refRCS", refRCS, 2);
            brick.printValue("error", error, 3);
            brick.printValue("U", U, 4);
            brick.printValue("dt", dt, 12);
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        music.PlayToneInParallel(262, BeatFraction.Half); // Издаём сигнал завершения
        custom.ActionAfterMotion(lineFollowRightSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    // Функция движения по линии правым датчиком до перекрёстка слева с линией извне
    function LineFollowToLeftIntersectionOutside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) lineFollowRightSensorSpeed = params.speed;
            if (params.Kp) lineFollowRightSensorKp = params.Kp;
            if (params.Ki) lineFollowRightSensorKi = params.Ki;
            if (params.Kd) lineFollowRightSensorKd = params.Kd;
            if (params.N) lineFollowRightSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowRightSensorKp, lineFollowRightSensorKi, lineFollowRightSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowRightSensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollowRightSensorSpeed); // Команда моторам
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
        custom.ActionAfterMotion(lineFollowRightSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
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
    //% params.shadow=SetEmptyParams
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
            if (params.speed) lineFollowLeftSensorSpeed = params.speed;
            if (params.Kp) lineFollowLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowLeftSensorKd = params.Kd;
            if (params.N) lineFollowLeftSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowLeftSensorKp, lineFollowLeftSensorKi, lineFollowLeftSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowLeftSensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
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
        custom.ActionAfterMotion(lineFollowLeftSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    // Функция движения по линии левым датчиком до перекрёстка справа с линией извне
    function LineFollowToRightIntersectionOutside(actionAfterMotion: AfterMotion, params?: LineFollowInreface, debug: boolean = false) {
        if (params) {
            if (params.speed) lineFollowLeftSensorSpeed = params.speed;
            if (params.Kp) lineFollowLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowLeftSensorKd = params.Kd;
            if (params.N) lineFollowLeftSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowLeftSensorKp, lineFollowLeftSensorKi, lineFollowLeftSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowLeftSensorN); // Установить фильтр дифференциального регулятора
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
            CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
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
        custom.ActionAfterMotion(lineFollowLeftSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

}