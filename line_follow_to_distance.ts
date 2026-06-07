namespace motions {

    /**
     * Движение по линии на расстояние.
     * @param distance дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByDualSensors"
    //% block="line follow to distance $distance mm after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $distance мм с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="79"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceByDualSensors(distance: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v >= 0) lineFollowToDistance2SensorV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowToDistance2SensorKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowToDistance2SensorKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowToDistance2SensorKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowToDistance2SensorKf = Math.abs(params.Kf);
        }

        pidLineFollow.setGains(lineFollowToDistance2SensorKp, lineFollowToDistance2SensorKi, lineFollowToDistance2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistance2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.distanceToTicks(distance); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторов
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistance2SensorV); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, v: lineFollowToDistance2SensorV }); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние одним из датчиков.
     * @param followLineSensor выбранным сенсором и позицией, eg: FollowLineSensor.LeftInside
     * @param distance дистанция движения в мм eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceBySingleSensor"
    //% block="line follow $followLineSensor sensor to distance $distance mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии $followLineSensor датчиком на расстояние $distance мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="76"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceBySingleSensor(distance: number, followLineSensor: LineFollowSingleMode, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (followLineSensor == LineFollowSingleMode.LeftInside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Inside, distance, actionAfterMotion, params, debug);
        } else if (followLineSensor == LineFollowSingleMode.LeftOutside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Outside, distance, actionAfterMotion, params, debug);
        } else if (followLineSensor == LineFollowSingleMode.RightInside) {
            lineFollowToDistanceByRightSensor(LineLocation.Inside, distance, actionAfterMotion, params, debug);
        } else if (followLineSensor == LineFollowSingleMode.RightOutside) {
            lineFollowToDistanceByRightSensor(LineLocation.Outside, distance, actionAfterMotion, params, debug);
        }
    }

    /**
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param distance дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByLeftSensor"
    //% block="line follow left sensor at line $lineLocation to distance $distance mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии левым датчиком при линия $lineLocation на расстояние $distance мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="75"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByLeftSensor(lineLocation: LineLocation, distance: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v >= 0) lineFollowToDistanceLeftSensorV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowToDistanceLeftSensorKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowToDistanceLeftSensorKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowToDistanceLeftSensorKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowToDistanceLeftSensorKf = Math.abs(params.Kf);
        }

        pidLineFollow.setGains(lineFollowToDistanceLeftSensorKp, lineFollowToDistanceLeftSensorKi, lineFollowToDistanceLeftSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceLeftSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.distanceToTicks(distance); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionV);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторы
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistanceLeftSensorV); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, v: lineFollowToDistanceLeftSensorV }); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param distance дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByRightSensor"
    //% block="line follow right sensor at line $lineLocation to distance $distance mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии правым датчиком при линия $lineLocation на расстояние $distance мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="74" blockGap="8"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByRightSensor(lineLocation: LineLocation, distance: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v >= 0) lineFollowToDistanceRightSensorV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowToDistanceRightSensorKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowToDistanceRightSensorKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowToDistanceRightSensorKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowToDistanceRightSensorKf = Math.abs(params.Kf);
        }

        pidLineFollow.setGains(lineFollowToDistanceRightSensorKp, lineFollowToDistanceRightSensorKi, lineFollowToDistanceRightSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceRightSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.distanceToTicks(distance); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionV);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let prevTime = control.millis(); // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторы
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistanceRightSensorV); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, v: lineFollowToDistanceRightSensorV }); // Действие после алгоритма движения
    }

}