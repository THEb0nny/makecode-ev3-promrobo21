namespace motions {

    export let lineRefTreshold = 50; // Среднее значение серого (уставка) для определения границы линии
    export let lineFollowRefTreshold = 35; // Пороговое значение определения перекрёстка
    export let lineFollowSetPoint = lineFollowRefTreshold; // Среднее значение серого

    export let distRollingAfterIntersection = 0; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    export let distRollingAfterIntersectionMoveOut = 0; // Дистанция прокатки на перекрёстке для съезда с него в мм

    export let lineFollowWithOneSensorConditionMaxErr = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    export let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    export let lineFollow2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollow2SensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком
    export let lineFollowLeftSensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком

    export let lineFollowRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком
    export let lineFollowRightSensorKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком

    /**
     * Set the driving distance after determining the intersection for rolling in mm.
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param dist дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterInsetsection"
    //% block="set distance $dist|mm rolling after intersection"
    //% block.loc.ru="установить дистанцию $dist|мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Параметры"
    export function SetDistRollingAfterInsetsection(dist: number) {
        distRollingAfterIntersection = dist;
    }

    /**
     * Get the driving distance after determining the intersection for rolling in mm.
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterInsetsection"
    //% block="get distance rolling after intersection"
    //% block.loc.ru="дистанция прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Параметры"
    export function GetDistRollingAfterInsetsection(): number {
        return distRollingAfterIntersection;
    }

    /**
     * Set the distance for rolling at the intersection without braking. For example, in order not to redefine the line.
     * Установить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     * @param dist дистанция прокатки после перекрёстка, eg: 20
     */
    //% blockId="SetDistRollingAfterIntersectionMoveOut"
    //% block="set distance $dist mm rolling exit an intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки съезда с перекрёстка"
    //% inlineInputMode="inline"
    //% weight="97" blockGap="8"
    //% group="Параметры"
    export function SetDistRollingAfterIntersectionMoveOut(dist: number) {
        distRollingAfterIntersectionMoveOut = dist;
    }

    /**
     * Get the distance for rolling at the intersection without braking. For example, in order not to redefine the line.
     * Получить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     */
    //% blockId="GetDistRollingAfterIntersectionMoveOut"
    //% block="get distance rolling exit an intersection"
    //% block.loc.ru="дистанция прокатки съезда с перекрёстка"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Параметры"
    export function GetDistRollingAfterIntersectionMoveOut() {
        return distRollingAfterIntersectionMoveOut;
    }

    /**
     * Set the reflection threshold value for the line.
     * Установить пороговое значение отражения для линии.
     * @param reflection значение отражения, eg: 50
     */
    //% blockId="SetLineRefTreshold"
    //% block="set reflection $reflection treshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
    //% group="Параметры"
    export function SetLineRefTreshold(reflection: number) {
        lineRefTreshold = reflection;
    }

    /**
     * Get the reflection threshold value for the line.
     * Получить пороговое значение отражения для линии.
     */
    //% blockId="GetLineRefTreshold"
    //% block="get reflection treshold"
    //% block.loc.ru="пороговое значение отражения"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры"
    export function GetLineRefTreshold(): number {
        return lineRefTreshold
    }

    /**
     * Set the reflection threshold value when moving along the line.
     * Установить пороговое значение отражения при движении по линии.
     * @param reflection значение отражения, eg: 35
     */
    //% blockId="SetLineFollowRefTreshold"
    //% block="set line follow $reflection reflection treshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="87" blockGap="8"
    //% group="Параметры"
    export function SetLineFollowRefTreshold(reflection: number) {
        lineFollowRefTreshold = reflection;
    }

    /**
     * Get the reflection threshold value when moving along the line.
     * Получить пороговое значение отражения при движении по линии.
     */
    //% blockId="GetLineFollowRefTreshold"
    //% block="get line follow reflection treshold"
    //% block.loc.ru="пороговое значение отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры"
    export function GetLineFollowRefTreshold(): number {
        return lineFollowRefTreshold;
    }

    /**
     * Set the setpoint (average value) of reflection for movement along the line.
     * Установить уставку (среднее значение) отражения для движения по линии.
     * @param reflectionSetPoint значение уставки движения по линии, eg: 50
     */
    //% blockId="SetLineFollowSetPoint"
    //% block="set line follow set point $reflectionSetPoint reflection"
    //% block.loc.ru="установить уставку $reflectionSetPoint движения по линии"
    //% inlineInputMode="inline"
    //% weight="85" blockGap="8"
    //% group="Параметры"
    export function SetLineFollowSetPoint(reflectionSetPoint: number) {
        lineFollowSetPoint = reflectionSetPoint;
    }

    /**
     * Get the setpoint (average value) of reflection for movement along the line.
     * Получить уставку (среднее значение) отражения для движения по линии.
     */
    //% blockId="GetLineFollowSetPoint"
    //% block="get line follow set point"
    //% block.loc.ru="уставка движения по линии"
    //% inlineInputMode="inline"
    //% weight="84"
    //% group="Параметры"
    export function GetLineFollowSetPoint(): number {
        return lineFollowSetPoint;
    }

    /**
     * Set the maximum error of the driving condition with one sensor along the line.
     * Установить максимальную ошибку условия движения одним датчиком по линии.
     * @param maxErr максимальное значение ошибки движения по линии, eg: 30
     */
    //% blockId="SetLineFollowConditionMaxErr"
    //% block="set line follow max error $maxErr"
    //% block.loc.ru="установить максимальую ошибку $maxErr движения по линии"
    //% inlineInputMode="inline"
    //% weight="79" blockGap="8"
    //% group="Параметры"
    export function SetLineFollowConditionMaxErr(maxErr: number) {
        lineFollowWithOneSensorConditionMaxErr = maxErr;
    }

    /**
     * Get the maximum error of the driving condition with one sensor along the line.
     * Получить максимальную ошибку условия движения одним датчиком по линии.
     */
    //% blockId="GetLineFollowConditionMaxErr"
    //% block="get line follow max error"
    //% block.loc.ru="максимальая ошибка при движении по линии"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Параметры"
    export function GetLineFollowConditionMaxErr(): number {
        return lineFollowWithOneSensorConditionMaxErr;
    }

    /**
     * Set dt for line motion control cycles and line sensor operation.
     * Установить dt для циклов регулирования движения по линии и работы с датчиком линии.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineFollowLoopDt"
    //% block="set dt = $dt for loops line follow"
    //% block.loc.ru="установить dt = $dt для циклов движения по линии"
    //% inlineInputMode="inline"
    //% weight="69"
    //% group="Параметры"
    export function SetLineFollowLoopDt(dt: number) {
        lineFollowLoopDt = dt;
    }

    /**
     * The function of moving along the line to the intersection.
     * Функция движения по линии до перекрёстка.
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToIntersection"
    //% block="движение по линии до перекрёстка с действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="99" blockGap="8"
    //% group="Движение по линии"
    export function LineFollowToIntersection(actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (refLeftLS < motions.lineFollowRefTreshold && refRightLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed);
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollow2SensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Movement along the line for a distance. A very crude method.
     * Движение по линии на расстояние. Очень грубый метод.
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistance"
    //% block="движение по линии на расстояние $dist мм с действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="89"
    //% group="Движение по линии"
    export function LineFollowToDistance(dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed);
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollow2SensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Movement along the line for a distance with the left sensor. A very crude method.
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceWithLeftSensor"
    //% block="движение по линии левым датчиком на расстояние $dist мм| $lineLocation| c действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="88"
    //% group="Движение по линии"
    export function LineFollowToDistanceWithLeftSensor(lineLocation: HorizontalLineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowLeftSensorKd = params.Kd;
            if (params.N) lineFollowLeftSensorN = params.N;
        }

        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollowLeftSensorKp, lineFollowLeftSensorKi, lineFollowLeftSensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollowLeftSensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = refLeftLS - motions.lineFollowSetPoint; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = motions.lineFollowSetPoint - refLeftLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowLeftSensorSpeed);
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowLeftSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Movement along the line for a distance with the right sensor. A very crude method.
     * Движение по линии на расстояние правым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceWithRightSensor"
    //% block="движение по линии правым датчиком на расстояние $dist мм| $lineLocation| c действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="88" blockGap="8"
    //% group="Движение по линии"
    export function LineFollowToDistanceWithRightSensor(lineLocation: HorizontalLineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowRightSensorKp = params.Kp;
            if (params.Ki) lineFollowRightSensorKi = params.Ki;
            if (params.Kd) lineFollowRightSensorKd = params.Kd;
            if (params.N) lineFollowRightSensorN = params.N;
        }

        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов  ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = motions.lineFollowSetPoint - refRightLS; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = refRightLS - motions.lineFollowSetPoint; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed);
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollow2SensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * The function of moving along the line to determine the intersection on the left with the right sensor.
     * Функция движения по линии для определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersaction"
    //% block="движение по линии до перекрёстка слева $lineLocation c действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="79" blockGap="8"
    //% group="Движение по линии"
    export function LineFollowToLeftIntersaction(lineLocation: HorizontalLineLocation, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowRightSensorKp = params.Kp;
            if (params.Ki) lineFollowRightSensorKi = params.Ki;
            if (params.Kd) lineFollowRightSensorKd = params.Kd;
            if (params.N) lineFollowRightSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowRightSensorKp, lineFollowRightSensorKi, lineFollowRightSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowRightSensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = motions.lineFollowSetPoint - refRightLS; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = refRightLS - motions.lineFollowSetPoint; // Ошибка регулирования
            if (Math.abs(error) <= motions.lineFollowWithOneSensorConditionMaxErr && refLeftLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowRightSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowRightSensorSpeed);
            brick.clearScreen(); // Очистка экрана
            if (debug) {
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowRightSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * The function of moving along the line to determine the intersection on the right with the left sensor.
     * Функция движения по линии для определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: HorizontalLineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToRightIntersection"
    //% block="движение по линии до перекрёстка справа $lineLocation c действием после $actionAfterMotion|| параметры: $params| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="SetEmptyLineFollowParams"
    //% weight="78"
    //% group="Движение по линии"
    export function LineFollowToRightIntersection(lineLocation: HorizontalLineLocation, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowLeftSensorKd = params.Kd;
            if (params.N) lineFollowLeftSensorN = params.N;
        }

        automation.pid1.setGains(lineFollowLeftSensorKp, lineFollowLeftSensorKi, lineFollowLeftSensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollowLeftSensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = refLeftLS - motions.lineFollowSetPoint; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = motions.lineFollowSetPoint - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= motions.lineFollowWithOneSensorConditionMaxErr && refRightLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowLeftSensorSpeed);
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowLeftSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    // export function LineFollow3Sensor(params?: automation.LineFollowInterface, debug: boolean = false) {
    //     // Движение по линии с волновым регулятором (PID + защита от слёта с линии)
    //     if (M_COLOR_SEN == undefined) return; // Если центрального сенсора нет
        
    //     if (params) { // Если были переданы параметры
    //         if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
    //         if (params.Kp) lineFollow2SensorKp = params.Kp;
    //         if (params.Ki) lineFollow2SensorKi = params.Ki;
    //         if (params.Kd) lineFollow2SensorKd = params.Kd;
    //         if (params.N) lineFollow2SensorN = params.N;
    //     }

    //     automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов регулятора
    //     automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
    //     automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
    //     automation.pid1.reset(); // Сброс регулятора

    //     control.timer1.reset();
    //     let lastSensor = 2; // Переменная для хранения последнего сенсора, который видел линию, изначально центральный
    //     let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
    //     while (brick.buttonEnter.wasPressed()) {
    //         let currTime = control.millis(); // Текущее время
    //         let dt = currTime - prevTime; // Время за которое выполнился цикл
    //         prevTime = currTime; // Новое время в переменную предыдущего времени
    //         let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
    //         let refRawMCS = M_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
    //         let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
    //         let refLCS = sensors.GetNormRef(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
    //         let refMCS = sensors.GetNormRef(refRawMCS, B_REF_RAW_MCS, W_REF_RAW_MCS); // Нормализованное значение с левого датчика цвета
    //         let refRCS = sensors.GetNormRef(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
    //         let error = refLCS - refRCS; // Ошибка регулирования
    //         automation.pid1.setPoint(error); // Передать ошибку регулятору
    //         let U = 0;
    //         if (refLCS > LINE_REF_TRESHOLD) {
    //             control.timer1.reset();
    //             lastSensor = 1;
    //         } else if (refMCS > LINE_REF_TRESHOLD) {
    //             control.timer1.reset();
    //             lastSensor = 2;
    //         } else if (refRCS > LINE_REF_TRESHOLD) {
    //             control.timer1.reset();
    //             lastSensor = 3;
    //         } else if (control.timer1.millis() > 100) {
    //             U = (2 - lastSensor) * lineFollow2SensorSpeed;
    //         } else {
    //             U = automation.pid1.compute(dt, 0); // Управляющее воздействие
    //         }
    //         //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
    //         chassis.ChassisControl(U, lineFollow2SensorSpeed);
    //         if (debug) {
    //             brick.clearScreen(); // Очистка экрана
    //             brick.printValue("refLCS", refLCS, 1);
    //             brick.printValue("refMCS", refMCS, 2);
    //             brick.printValue("refRCS", refRCS, 3);
    //             brick.printValue("error", error, 4);
    //             brick.printValue("U", U, 5);
    //             brick.printValue("dt", dt, 12);
    //         }
    //         control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
    //     }
    // }

}