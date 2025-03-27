namespace motions {

    let lineRefTreshold = 50; // Среднее значение серого (уставка) для определения границы линии
    let lineFollowRefTreshold = 35; // Пороговое значение определения перекрёстка
    let lineFollowSetPoint = lineFollowRefTreshold; // Среднее значение серого

    let distRollingAfterIntersection = 30; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    let distRollingFromLineAfterIntersection = 20; // Дистанция прокатки на перекрёстке для съезда с него в мм

    let lineFollowWithOneSensorConditionMaxErr = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    export let steeringAtSearchLine = 15; // Подруливание при поиске линии для последущего движени одним датчиком
    export let speedAtSearchLine = 30; // Скорость при поиске линии для последующего движения один датчиком
    
    let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    export let lineFollowCrossIntersectionSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка

    export let lineFollowRightIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка

    export let lineFollowToDistanceSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками на расстояние

    export let lineFollowToDistanceWithLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком на расстояние

    export let lineFollowToDistanceWithRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком на расстояние

    export let rampLineFollow2SensorStartSpeed = 10; // Переменная для хранения минимальной скорости на старте при движения по линии двумя датчиками
    export let rampLineFollow2SensorMaxSpeed = 50; // Переменная для хранения максимальной скорости при движения по линии двумя датчиками
    export let rampLineFollow2SensorFinishSpeed = 10; // Переменная для хранения минимальной скорости при окончании движения по линии двумя датчиками
    export let rampLineFollow2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export const pidLineFollow = new automation.PIDController(); // PID для регулирования движения по линии

    /**
     * Set the driving distance after determining the intersection for rolling in mm.
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param dist дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterIntersection"
    //% block="set distance $dist mm rolling after intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function SetDistRollingAfterIntersection(dist: number) {
        distRollingAfterIntersection = dist;
    }

    /**
     * Get the driving distance after determining the intersection for rolling in mm.
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterIntersection"
    //% block="get distance rolling after intersection in mm"
    //% block.loc.ru="дистанция прокатки после перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
    export function GetDistRollingAfterIntersection(): number {
        return distRollingAfterIntersection;
    }

    /**
     * Set the distance for rolling at the intersection without braking. For example, in order not to redefine the line.
     * Установить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     * @param dist дистанция прокатки после перекрёстка, eg: 20
     */
    //% blockId="SetDistRollingFromLineAfterIntersection"
    //% block="set distance $dist mm rolling exit an intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки съезда с перекрёстка"
    //% inlineInputMode="inline"
    //% weight="97" blockGap="8"
    //% group="Свойства движения"
    export function SetDistRollingFromLineAfterIntersection(dist: number) {
        distRollingFromLineAfterIntersection = dist;
    }

    /**
     * Get the distance for rolling at the intersection without braking. For example, in order not to redefine the line.
     * Получить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     */
    //% blockId="GetDistRollingFromLineAfterIntersection"
    //% block="get rolling distance for exit from intersection in mm"
    //% block.loc.ru="дистанция прокатки для съезда с перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Свойства движения"
    export function GetDistRollinFromLineAfterIntersection() {
        return distRollingFromLineAfterIntersection;
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

    export function GetLineFollowLoopDt() {
        return lineFollowLoopDt;
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
            if (params.speed) lineFollowCrossIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowCrossIntersectionKp = params.Kp;
            if (params.Ki) lineFollowCrossIntersectionKi = params.Ki;
            if (params.Kd) lineFollowCrossIntersectionKd = params.Kd;
            if (params.N) lineFollowCrossIntersectionN = params.N;
        }

        pidLineFollow.setGains(lineFollowCrossIntersectionKp, lineFollowCrossIntersectionKi, lineFollowCrossIntersectionKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowCrossIntersectionN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < motions.GetLineFollowRefTreshold() && refRightLS < motions.GetLineFollowRefTreshold()) break; // Проверка на перекрёсток
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowCrossIntersectionSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowCrossIntersectionSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * The function of moving along the line to determine the intersection on the left with the right sensor.
     * Функция движения по линии до определения перекрёстка слева или справа.
     * Если слева, тогда движение осуществляется правым датчиком и левый отвечает за определение.
     * Если справа, тогда за движение отвечает левый датчик, а правый отвечает за определение перекрёстка.
     * @param sideIntersection перекрёсток слева или справа, eg: SideIntersection.Left
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToSideIntersection"
    //% block="line follow to intersection $sideIntersection after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка $sideIntersection с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="89"
    //% group="Движение по линии до перекрёстка"
    export function LineFollowToSideIntersection(sideIntersection: SideIntersection, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (sideIntersection == SideIntersection.LeftInside) {
            LineFollowToLeftIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.LeftOutside) {
            LineFollowToLeftIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightInside) {
            LineFollowToRightIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightOutside) {
            LineFollowToRightIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        } else return;
    }

    // Вспомогательная линия, чтобы подрулить и ждать нахождения линии
    function SteeringUntilFindLine(sideIntersection: SideIntersection, steering: number, speed: number) {
        let lineSensor: LineSensor;
        if (sideIntersection == SideIntersection.LeftInside || sideIntersection == SideIntersection.LeftOutside) lineSensor = LineSensor.Right;
        else if (sideIntersection == SideIntersection.RightInside || sideIntersection == SideIntersection.RightOutside) lineSensor = LineSensor.Left;
        // Подруливаем плавно к линии
        if (sideIntersection == SideIntersection.LeftInside || sideIntersection == SideIntersection.RightOutside) chassis.steeringCommand(steering, speed);
        else if (sideIntersection == SideIntersection.LeftOutside || sideIntersection == SideIntersection.RightInside) chassis.steeringCommand(-steering, speed);
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            let refLS = sensors.GetNormalizedReflectionValue(lineSensor); // Нормализованное значение с правого датчика линии
            if (refLS < motions.GetLineFollowSetPoint()) break;
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
    }

    /**
     * The function of moving along the line to determine the intersection on the left with the right sensor.
     * Функция движения по линии до определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersection"
    //% block="line follow to left intersection $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка слева $lineLocation c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="88" blockGap="8"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
    export function LineFollowToLeftIntersection(lineLocation: LineLocation, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowLeftIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowLeftIntersectionKp = params.Kp;
            if (params.Ki) lineFollowLeftIntersectionKi = params.Ki;
            if (params.Kd) lineFollowLeftIntersectionKd = params.Kd;
            if (params.N) lineFollowLeftIntersectionN = params.N;
        }

        pidLineFollow.setGains(lineFollowLeftIntersectionKp, lineFollowLeftIntersectionKi, lineFollowLeftIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowLeftIntersectionN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        SteeringUntilFindLine(lineLocation == LineLocation.Inside ? SideIntersection.LeftInside : SideIntersection.LeftOutside, steeringAtSearchLine, speedAtSearchLine);

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = motions.GetLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - motions.GetLineFollowSetPoint(); // Ошибка регулирования
            if (Math.abs(error) <= motions.GetLineFollowConditionMaxErr() && refLeftLS < motions.GetLineFollowRefTreshold()) break; // Проверка на перекрёсток, когда робот едет по линии
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowLeftIntersectionSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowLeftIntersectionSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * The function of moving along the line to determine the intersection on the right with the left sensor.
     * Функция движения по линии до определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
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
    export function LineFollowToRightIntersection(lineLocation: LineLocation, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowRightIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowRightIntersectionKp = params.Kp;
            if (params.Ki) lineFollowRightIntersectionKi = params.Ki;
            if (params.Kd) lineFollowRightIntersectionKd = params.Kd;
            if (params.N) lineFollowRightIntersectionN = params.N;
        }

        pidLineFollow.setGains(lineFollowRightIntersectionKp, lineFollowRightIntersectionKi, lineFollowRightIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowRightIntersectionN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        SteeringUntilFindLine(lineLocation == LineLocation.Inside ? SideIntersection.LeftInside : SideIntersection.LeftOutside, steeringAtSearchLine, speedAtSearchLine);

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - motions.GetLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = motions.GetLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= motions.GetLineFollowConditionMaxErr() && refRightLS < motions.GetLineFollowRefTreshold()) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowRightIntersectionSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowRightIntersectionSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

}

namespace motions {

    /**
     * Movement along the line for a distance. A very crude method.
     * Движение по линии на расстояние. Очень грубый метод.
     * @param dist дистанция движения в мм, eg: 250
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
            if (params.speed) lineFollowToDistanceSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceKp = params.Kp;
            if (params.Ki) lineFollowToDistanceKi = params.Ki;
            if (params.Kd) lineFollowToDistanceKd = params.Kd;
            if (params.N) lineFollowToDistanceN = params.N;
        }

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = math.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        pidLineFollow.setGains(lineFollowToDistanceKp, lineFollowToDistanceKi, lineFollowToDistanceKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowToDistanceSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowToDistanceSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние одним из датчиков.
     * @param lineSensor позиция линии для движения, eg: LineSensor.Left
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм eg: 250
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
    export function LineFollowToDistanceWithOneSensor(lineSensor: LineSensor, lineLocation: LineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (lineSensor == LineSensor.Left) {
            LineFollowToDistanceWithLeftSensor(lineLocation, dist, actionAfterMotion, params, debug);
        } else if (lineSensor == LineSensor.Right) {
            LineFollowToDistanceWithRightSensor(lineLocation, dist, actionAfterMotion, params, debug);
        }
    }

    /**
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
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
    export function LineFollowToDistanceWithLeftSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowToDistanceWithLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceWithLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowToDistanceWithLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowToDistanceWithLeftSensorKd = params.Kd;
            if (params.N) lineFollowToDistanceWithLeftSensorN = params.N;
        }

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = math.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        pidLineFollow.setGains(lineFollowToDistanceWithLeftSensorKp, lineFollowToDistanceWithLeftSensorKi, lineFollowToDistanceWithLeftSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceWithLeftSensorN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - motions.GetLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = motions.GetLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowToDistanceWithLeftSensorSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowToDistanceWithLeftSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние правым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
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
    export function LineFollowToDistanceWithRightSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterMotion, params?: params.LineFollowInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowToDistanceWithRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceWithRightSensorKp = params.Kp;
            if (params.Ki) lineFollowToDistanceWithRightSensorKi = params.Ki;
            if (params.Kd) lineFollowToDistanceWithRightSensorKd = params.Kd;
            if (params.N) lineFollowToDistanceWithRightSensorN = params.N;
        }

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = math.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии

        pidLineFollow.setGains(lineFollowToDistanceWithRightSensorKp, lineFollowToDistanceWithRightSensorKi, lineFollowToDistanceWithRightSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceWithRightSensorN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = motions.GetLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - motions.GetLineFollowSetPoint(); // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, lineFollowToDistanceWithRightSensorSpeed); // Команда моторам
            if (debug) {
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("error", error, 3);
                brick.printValue("U", U, 4);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        motions.ActionAfterMotion(lineFollowToDistanceWithRightSensorSpeed, actionAfterMotion); // Действие после алгоритма движения
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
    //% block="ramp line follow to distance $totalDist mm acceleration $accelDist deceleration $decelDist|braking $braking||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist|торможение $braking||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="RampLineFollowEmptyParams"
    //% weight="78"
    //% group="Движение по линии с ускорениями"
    export function RampLineFollowToDistance(totalDist: number, accelDist: number, decelDist: number, braking: Braking, params?: params.RampLineFollowInterface, debug: boolean = false) {
        if (totalDist < 0 || accelDist < 0 || decelDist < 0 || Math.abs(accelDist) + Math.abs(decelDist) > totalDist) {
            music.playSoundEffect(sounds.systemGeneralAlert);
            control.panic(40);
        } else if (totalDist == 0) {
            chassis.stop();
            return;
        }
        
        if (params) { // Если были переданы параметры
            if (params.startSpeed) rampLineFollow2SensorStartSpeed = Math.abs(params.startSpeed);
            if (params.maxSpeed) rampLineFollow2SensorMaxSpeed = Math.abs(params.maxSpeed);
            if (params.finishSpeed) rampLineFollow2SensorFinishSpeed = Math.abs(params.finishSpeed);
            if (params.Kp) rampLineFollow2SensorKp = params.Kp;
            if (params.Ki) rampLineFollow2SensorKi = params.Ki;
            if (params.Kd) rampLineFollow2SensorKd = params.Kd;
            if (params.N) rampLineFollow2SensorN = params.N;
        }

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const mRotAccelCalc = math.CalculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения
        const mRotDecelCalc = math.CalculateDistanceToEncRotate(Math.abs(decelDist)); // Расчитываем расстояние замедления
        const mRotTotalCalc = math.CalculateDistanceToEncRotate(Math.abs(totalDist)); // Рассчитываем общюю дистанцию

        advmotctrls.accTwoEncConfig(rampLineFollow2SensorStartSpeed, rampLineFollow2SensorMaxSpeed, rampLineFollow2SensorFinishSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);
        pidLineFollow.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(rampLineFollow2SensorN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.ControlCommand(U, out.pwrOut); // Команда моторам
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 300); // Издаём сигнал завершения
        if (braking == Braking.Hold) chassis.stop(true); // Торможение с удержанием
        else if (braking == Braking.NoBreak) chassis.stop(false); // Торможение без удержания
        else chassis.setSpeedsCommand(rampLineFollow2SensorFinishSpeed, rampLineFollow2SensorFinishSpeed); // Команда моторам вперёд
    }

}

/*
namespace motions {

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

        pidLineFollow.setGains(lineFollow2SensorKp, lineFollow2SensorKi, lineFollow2SensorKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollow2SensorN); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.reset(); // Сброс регулятора

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
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
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
                U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            }
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
            control.pauseUntilTime(currTime, GetLineFollowLoopDt()); // Ожидание выполнения цикла
        }
    }

}
*/