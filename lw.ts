namespace motions {

    export let lineRefTreshold = 50; // Среднее значение серого (уставка) для определения границы линии
    export let lineFollowRefTreshold = 35; // Пороговое значение определения перекрёстка
    export let lineFollowSetPoint = lineFollowRefTreshold; // Среднее значение серого

    export let distRollingAfterIntersection = 0; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    export let distRollingAfterIntersectionMoveOut = 0; // Дистанция прокатки на перекрёстке для съезда с него в мм

    export let lineFollowWithOneSensorConditionMaxErr = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    export let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    export let lineFollow2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollow2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком
    export let lineFollowLeftSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком
    export let lineFollowLeftSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком

    export let lineFollowRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком
    export let lineFollowRightSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком
    export let lineFollowRightSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком

    export let rampLineFollow2SensorStartSpeed = 10; // Переменная для хранения минимальной скорости на старте при движения по линии двумя датчиками
    export let rampLineFollow2SensorMaxSpeed = 50; // Переменная для хранения максимальной скорости при движения по линии двумя датчиками
    export let rampLineFollow2SensorEndSpeed = 10; // Переменная для хранения минимальной скорости при окончании движения по линии двумя датчиками
    export let rampLineFollow2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    /**
     * Set the driving distance after determining the intersection for rolling in mm.
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param dist дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterInsetsection"
    //% block="set distance $dist mm rolling after intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function SetDistRollingAfterInsetsection(dist: number) {
        distRollingAfterIntersection = dist;
    }

    /**
     * Get the driving distance after determining the intersection for rolling in mm.
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterInsetsection"
    //% block="get distance rolling after intersection in mm"
    //% block.loc.ru="дистанция прокатки после перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
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
    //% group="Свойства движения"
    export function SetDistRollingAfterIntersectionMoveOut(dist: number) {
        distRollingAfterIntersectionMoveOut = dist;
    }

    /**
     * Get the distance for rolling at the intersection without braking. For example, in order not to redefine the line.
     * Получить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     */
    //% blockId="GetDistRollingAfterIntersectionMoveOut"
    //% block="get distance rolling exit an intersection in mm"
    //% block.loc.ru="дистанция прокатки съезда с перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Свойства движения"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
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
    //% group="Свойства для датчиков"
    export function GetLineFollowConditionMaxErr(): number {
        return lineFollowWithOneSensorConditionMaxErr;
    }

    /**
     * Set dt for adjustment cycles when line follow.
     * Установить dt для циклов регулирования при движении по линии.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineFollowLoopDt"
    //% block="set dt = $dt for loops regulator at line follow"
    //% block.loc.ru="установить dt = $dt для циклов регулирования движения по линии"
    //% inlineInputMode="inline"
    //% weight="69"
    //% group="Свойства для датчиков"
    export function SetLineFollowLoopDt(dt: number) {
        lineFollowLoopDt = dt;
    }

}

namespace motions {

    /**
     * Function of moving along a line to an intersection using two sensors.
     * Функция движения по линии до перекрёстка двумя датчиками.
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToCrossIntersection"
    //% block="line follow to intersection after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="99"
    //% group="Движение по линии до перекрёстка"
    export function LineFollowToCrossIntersection(actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < motions.lineFollowRefTreshold && refRightLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed); // Команда моторам
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
     * Функция движения по линии до определения перекрёстка слева или справа.
     * Если слева, тогда движение осуществляется правым датчиком и левый отвечает за определение.
     * Если справа, тогда за движение отвечает левый датчик, а правый отвечает за определение перекрёстка.
     * @param junction перекрёсток слева или справа, eg: SideJunctionType.Left
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToSideIntersection"
    //% block="line follow to intersection $junction line $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка $junction линия $lineLocation с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="89"
    //% group="Движение по линии до перекрёстка"
    export function LineFollowToSideIntersection(junction: SideJunctionType, lineLocation: HorizontalLineLocation, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (junction == SideJunctionType.Left) {
            LineFollowToLeftIntersaction(lineLocation, actionAfterMotion, params, debug);
        } else if (junction == SideJunctionType.Right) {
            LineFollowToRightIntersection(lineLocation, actionAfterMotion, params, debug);
        }
    }

    /**
     * The function of moving along the line to determine the intersection on the left with the right sensor.
     * Функция движения по линии до определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersaction"
    //% block="line follow to left intersection $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка слева $lineLocation c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="88" blockGap="8"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
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
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = motions.lineFollowSetPoint - refRightLS; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = refRightLS - motions.lineFollowSetPoint; // Ошибка регулирования
            if (Math.abs(error) <= motions.lineFollowWithOneSensorConditionMaxErr && refLeftLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowRightSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowRightSensorSpeed); // Команда моторам
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
        motions.ActionAfterMotion(lineFollowRightSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * The function of moving along the line to determine the intersection on the right with the left sensor.
     * Функция движения по линии до определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: HorizontalLineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToRightIntersection"
    //% block="line follow to right intersection $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка справа $lineLocation c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="87"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
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
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = refLeftLS - motions.lineFollowSetPoint; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = motions.lineFollowSetPoint - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= motions.lineFollowWithOneSensorConditionMaxErr && refRightLS < motions.lineFollowRefTreshold) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowLeftSensorSpeed); // Команда моторам
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
     * Movement along the line for a distance. A very crude method.
     * Движение по линии на расстояние. Очень грубый метод.
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistance"
    //% block="line follow to distance $dist mm after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $dist мм с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="79"
    //% group="Движение по линии на расстояние"
    export function LineFollowToDistance(dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        const lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = motions.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            // let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторов
            // if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev, rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значения с энкодеров моторов
            if (Math.abs(lMotEnc) >= Math.abs(calcMotRot) || Math.abs(rMotEnc) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed); // Команда моторам
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

}

namespace motions {

    /**
     * Movement along a line over a distance in mm with acceleration and deceleration.
     * Acceleration distance, deceleration distance cannot add up to more than the total distance.
     * Движение по линии на расстояние в мм с ускорением и замедлением.
     * Расстояние ускорения, расстояние замедления не могут быть в сумме больше, чем общая дистанция.
     * @param totalDist общее расстояние движения в мм, eg: 400
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param braking тип торможения, eg: Braking.Hold
     * @param debug отладка, eg: false
     */
    //% blockId="RampLineFollowToDistance"
    //% block="ramp line follow to distance $totalDist mm acceleration $accelDist deceleration $decelDist||braking $braking|params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist||торможение $braking|параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="RampLineFollowEmptyParams"
    //% weight="78"
    //% group="Движение по линии с ускорениями/замедлениями"
    export function RampLineFollowToDistance(totalDist: number, accelDist: number, decelDist: number, braking: Braking = Braking.Hold, params?: params.RampLineFollowInterface, debug: boolean = false) {
        if (totalDist < 0 || accelDist < 0 || decelDist < 0 || Math.abs(accelDist) + Math.abs(decelDist) > totalDist) {
            music.playSoundEffect(sounds.systemGeneralAlert);
            control.panic(40);
        } else if (totalDist == 0) {
            chassis.stop();
            return;
        }
        
        if (params) { // Если были переданы параметры
            if (params.minStartSpeed) rampLineFollow2SensorStartSpeed = Math.abs(params.minStartSpeed);
            if (params.maxSpeed) rampLineFollow2SensorMaxSpeed = Math.abs(params.maxSpeed);
            if (params.minEndSpeed) rampLineFollow2SensorEndSpeed = Math.abs(params.minEndSpeed);
            if (params.Kp) rampLineFollow2SensorKp = params.Kp;
            if (params.Ki) rampLineFollow2SensorKi = params.Ki;
            if (params.Kd) rampLineFollow2SensorKd = params.Kd;
            if (params.N) rampLineFollow2SensorN = params.N;
        }

        const lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const mRotAccelCalc = motions.CalculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения
        const mRotDecelCalc = motions.CalculateDistanceToEncRotate(Math.abs(decelDist)); // Расчитываем расстояние замедления
        const mRotTotalCalc = motions.CalculateDistanceToEncRotate(Math.abs(totalDist)); // Рассчитываем общюю дистанцию

        advmotctrls.accTwoEncConfig(rampLineFollow2SensorStartSpeed, rampLineFollow2SensorMaxSpeed, rampLineFollow2SensorEndSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);
        automation.pid1.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        automation.pid1.setDerivativeFilter(rampLineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev, rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(lMotEnc, rMotEnc);
            if (out.isDone) break; // Проверка условия окончания
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            motions.ChassisControlCommand(U, out.pwrOut); // Команда моторам
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        if (braking == Braking.Hold) chassis.stop(true); // Торможение с удержанием
        else if (braking == Braking.NoBreak) chassis.stop(false); // Торможение без удержания
        else chassis.setSpeedsCommand(rampLineFollow2SensorEndSpeed, rampLineFollow2SensorEndSpeed); // Команда моторам вперёд
    }

}

namespace motions {

    /**
     * Движение по линии на расстояние одним из датчиков.
     * @param lineSensor позиция линии для движения, eg: LineSensor.Left
     * @param lineLocation позиция линии для движения, eg: HorizontalLineLocation.Inside
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceWithOneSensor"
    //% block="line follow $lineSensor sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии $lineSensor датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="76"
    //% group="Движение по линии на расстояние"
    export function LineFollowToDistanceWithOneSensor(lineSensor: LineSensor, lineLocation: HorizontalLineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (lineSensor == LineSensor.Left) {
            LineFollowToDistanceWithLeftSensor(lineLocation, dist, actionAfterMotion, params, debug);
        } else if (lineSensor == LineSensor.Right) {
            LineFollowToDistanceWithRightSensor(lineLocation, dist, actionAfterMotion, params, debug);
        }
    }

    /**
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: HorizontalLineLocation.Inside
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceWithLeftSensor"
    //% block="line follow left sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии левым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="75"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function LineFollowToDistanceWithLeftSensor(lineLocation: HorizontalLineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowLeftSensorKd = params.Kd;
            if (params.N) lineFollowLeftSensorN = params.N;
        }

        const lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = motions.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollowLeftSensorKp, lineFollowLeftSensorKi, lineFollowLeftSensorKd); // Установка коэффицентов ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollowLeftSensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            // let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            // if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev, rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значения с энкодеров моторы
            if (Math.abs(lMotEnc) >= Math.abs(calcMotRot) || Math.abs(rMotEnc) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = refLeftLS - motions.lineFollowSetPoint; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = motions.lineFollowSetPoint - refLeftLS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollowLeftSensorSpeed); // Команда моторам
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
     * Движение по линии на расстояние правым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: HorizontalLineLocation.Inside
     * @param dist скорость движения, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceWithRightSensor"
    //% block="line follow right sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии правым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="74" blockGap="8"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function LineFollowToDistanceWithRightSensor(lineLocation: HorizontalLineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowRightSensorKp = params.Kp;
            if (params.Ki) lineFollowRightSensorKi = params.Ki;
            if (params.Kd) lineFollowRightSensorKd = params.Kd;
            if (params.N) lineFollowRightSensorN = params.N;
        }

        const lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = motions.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        automation.pid1.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            // let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            // if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev, rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значения с энкодеров моторы
            if (Math.abs(lMotEnc) >= Math.abs(calcMotRot) || Math.abs(rMotEnc) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == HorizontalLineLocation.Inside) error = motions.lineFollowSetPoint - refRightLS; // Ошибка регулирования
            else if (lineLocation == HorizontalLineLocation.Outside) error = refRightLS - motions.lineFollowSetPoint; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            //CHASSIS_MOTORS.steer(U, lineFollow2SensorSpeed); // Команда моторам
            motions.ChassisControlCommand(U, lineFollow2SensorSpeed); // Команда моторам
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

    /*
    export function LineFollow3Sensor(params?: automation.LineFollowInterface, debug: boolean = false) {
        // Движение по линии с волновым регулятором (PID + защита от слёта с линии)
        if (M_COLOR_SEN == undefined) return; // Если центрального сенсора нет
        
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollow2SensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollow2SensorKp = params.Kp;
            if (params.Ki) lineFollow2SensorKi = params.Ki;
            if (params.Kd) lineFollow2SensorKd = params.Kd;
            if (params.N) lineFollow2SensorN = params.N;
        }

        automation.pid1.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов регулятора
        automation.pid1.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        automation.pid1.reset(); // Сброс регулятора

        control.timer1.reset();
        let lastSensor = 2; // Переменная для хранения последнего сенсора, который видел линию, изначально центральный
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (brick.buttonEnter.wasPressed()) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawMCS = M_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRef(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refMCS = sensors.GetNormRef(refRawMCS, B_REF_RAW_MCS, W_REF_RAW_MCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRef(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = refLCS - refRCS; // Ошибка регулирования
            automation.pid1.setPoint(error); // Передать ошибку регулятору
            let U = 0;
            if (refLCS > LINE_REF_TRESHOLD) {
                control.timer1.reset();
                lastSensor = 1;
            } else if (refMCS > LINE_REF_TRESHOLD) {
                control.timer1.reset();
                lastSensor = 2;
            } else if (refRCS > LINE_REF_TRESHOLD) {
                control.timer1.reset();
                lastSensor = 3;
            } else if (control.timer1.millis() > 100) {
                U = (2 - lastSensor) * lineFollow2SensorSpeed;
            } else {
                U = automation.pid1.compute(dt, 0); // Управляющее воздействие
            }
            //CHASSIS_MOTORS.steer(U, lineFollowLeftSensorSpeed); // Команда моторам
            chassis.ChassisControl(U, lineFollow2SensorSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLCS", refLCS, 1);
                brick.printValue("refMCS", refMCS, 2);
                brick.printValue("refRCS", refRCS, 3);
                brick.printValue("error", error, 4);
                brick.printValue("U", U, 5);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ожидание выполнения цикла
        }
    }
    */

}