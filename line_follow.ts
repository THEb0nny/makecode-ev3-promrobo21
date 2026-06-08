namespace motions {

    let lineRefThreshold = 50; // Среднее значение серого для определения границы линии
    let lineFollowRefThreshold = 40; // Пороговое значение определения заезда на перекрёсток
    let lineFollowSetPoint = lineRefThreshold; // Среднее значение серого (уставка) для движения по линии

    let lineFollowBySingleSensorConditionMaxError = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    let steeringAtSearchLine = 25; // Подруливание при поиске линии для последущего движени одним датчиком

    let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    let distRollingAfterIntersection = 30; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    let distContinueRollFromLineAfterIntersection = 20; // Дистанция прокатки на перекрёстке для съезда с него (линии) в мм

    export let lineFollowCrossIntersection2SensorV = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftIntersectionV = 50; // Переменная для хранения скорости при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка

    export let lineFollowRightIntersectionV = 50; // Переменная для хранения скорости при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка

    export let lineFollowToDistance2SensorV = 50; // Переменная для хранения скорости при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками на расстояние

    export let lineFollowToDistanceLeftSensorV = 50; // Переменная для хранения скорости при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком на расстояние

    export let lineFollowToDistanceRightSensorV = 50; // Переменная для хранения скорости при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком на расстояние

    export const pidLineFollow = new automation.PIDController(); // PID для регулирования движения по линии

    /**
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param distance дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterIntersection"
    //% block="set rolling distance $distance mm after intersection"
    //% block.loc.ru="установить дистанцию $distance мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function setDistRollingAfterIntersection(distance: number) {
        if (distance < 0) console.log("Warning: distance is negative, using absolute value.");
        distRollingAfterIntersection = Math.abs(distance);
    }

    /**
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterIntersection"
    //% block="get rolling distance after intersection in mm"
    //% block.loc.ru="дистанция прокатки после перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
    export function getDistRollingAfterIntersection(): number {
        return distRollingAfterIntersection;
    }

    /**
     * Установить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     * @param distance дистанция прокатки после перекрёстка, eg: 20
     */
    //% blockId="SetDistRollingFromLineAfterIntersection"
    //% block="set rolling distance $distance mm exit an intersection"
    //% block.loc.ru="установить дистанцию $distance мм прокатки съезда с перекрёстка"
    //% inlineInputMode="inline"
    //% weight="97" blockGap="8"
    //% group="Свойства движения"
    //% deprecated=true
    export function setDistRollingFromLineAfterIntersection(distance: number) {
        if (distance < 0) console.log("Warning: distance is negative, using absolute value.");
        distContinueRollFromLineAfterIntersection = Math.abs(distance);
    }

    /**
     * Получить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     */
    //% blockId="GetDistRollingFromLineAfterIntersection"
    //% block="get rolling distance for exit from intersection in mm"
    //% block.loc.ru="дистанция прокатки для съезда с перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Свойства движения"
    //% deprecated=true
    export function getDistRollingFromLineAfterIntersection() {
        return distContinueRollFromLineAfterIntersection;
    }

    /**
     * Установить пороговое значение отражения для линии.
     * @param reflection значение отражения, eg: 50
     */
    //% blockId="SetLineRefThreshold"
    //% block="set reflection $reflection threshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineRefThreshold(reflection: number) {
        if (reflection < 0) console.log("Warning: reflection is negative, using absolute value.");
        lineRefThreshold = Math.abs(reflection);
    }

    /**
     * Получить пороговое значение отражения для линии.
     */
    //% blockId="GetLineRefThreshold"
    //% block="get reflection threshold"
    //% block.loc.ru="пороговое значение отражения"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Свойства для датчиков"
    export function getLineRefThreshold(): number {
        return lineRefThreshold;
    }

    /**
     * Установить пороговое значение отражения при движении по линии.
     * @param reflection значение отражения, eg: 40
     */
    //% blockId="SetLineFollowRefThreshold"
    //% block="set line follow $reflection reflection threshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="87" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowRefThreshold(reflection: number) {
        if (reflection < 0) console.log("Warning: reflection is negative, using absolute value.");
        lineFollowRefThreshold = Math.abs(reflection);
    }

    /**
     * Получить пороговое значение отражения при движении по линии.
     */
    //% blockId="GetLineFollowRefThreshold"
    //% block="get line follow reflection threshold"
    //% block.loc.ru="пороговое значение отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Свойства для датчиков"
    export function getLineFollowRefThreshold(): number {
        return lineFollowRefThreshold;
    }

    /**
     * Установить уставку (среднее значение) отражения для движения по линии.
     * @param reflectionSetPoint значение уставки движения по линии, eg: 50
     */
    //% blockId="SetLineFollowSetPoint"
    //% block="set line follow set point $reflectionSetPoint reflection"
    //% block.loc.ru="установить уставку $reflectionSetPoint движения по линии"
    //% inlineInputMode="inline"
    //% weight="85" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowSetPoint(reflectionSetPoint: number) {
        if (reflectionSetPoint < 0) console.log("Warning: reflectionSetPoint is negative, using absolute value.");
        lineFollowSetPoint = Math.abs(reflectionSetPoint);
    }

    /**
     * Получить уставку (среднее значение) отражения для движения по линии.
     */
    //% blockId="GetLineFollowSetPoint"
    //% block="get line follow set point"
    //% block.loc.ru="уставка движения по линии"
    //% inlineInputMode="inline"
    //% weight="84"
    //% group="Свойства для датчиков"
    export function getLineFollowSetPoint(): number {
        return lineFollowSetPoint;
    }

    /**
     * Установить максимальную ошибку условия движения одним датчиком по линии.
     * @param maxError максимальное значение ошибки движения по линии, eg: 40
     */
    //% blockId="SetLineFollowSingleSensorConditionMaxError"
    //% block="set line follow max error $maxError at moving by one sensor"
    //% block.loc.ru="установить максимальую ошибку $maxError при движении одним датчиком"
    //% inlineInputMode="inline"
    //% weight="79" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowSingleSensorConditionMaxError(maxError: number) {
        if (maxError < 0) console.log("Warning: maxError is negative, using absolute value.");
        lineFollowBySingleSensorConditionMaxError = Math.abs(maxError);
    }

    /**
     * Получить максимальную ошибку условия движения одним датчиком по линии.
     */
    //% blockId="GetLineFollowSingleSensorConditionMaxError"
    //% block="get line follow by one sensor max error"
    //% block.loc.ru="максимальая ошибка при движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Свойства для датчиков"
    export function getLineFollowSingleSensorConditionMaxError(): number {
        return lineFollowBySingleSensorConditionMaxError;
    }

    /**
     * Установить dt для циклов регулирования при движении по линии.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineFollowLoopDt"
    //% block="set dt = $dt for regulator at line follow"
    //% block.loc.ru="установить dt = $dt для регулирования движения по линии"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства"
    export function setLineFollowLoopDt(dt: number) {
        if (dt < 0) console.log("Warning: dt is negative, using absolute value.");
        lineFollowLoopDt = Math.abs(dt);
    }

    /**
     * Получить dt для циклов регулирования при движении по линии.
     */
    //% blockId="GetLineFollowLoopDt"
    //% block="get dt at regulator at line follow"
    //% block.loc.ru="dt при регулирования движения по линии"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства"
    export function getLineFollowLoopDt() {
        return lineFollowLoopDt;
    }

    /**
     * Установить рулевое управление для поиска линии при движение по линии одним датчиком.
     * @param steering получительное значение рулевого подворота к линии, eg: 25
     */
    //% blockId="SetSteeringAtSearchLineForLineFollowOneSensor"
    //% block="set steering $steering when searching line to follow line with one sensor"
    //% block.loc.ru="установить рулевое управление $steering при поиске линии в движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Свойства движения"
    export function setSteeringAtSearchLineForLineFollowOneSensor(steering: number) {
        if (steering < 0) console.log("Warning: steering is negative, using absolute value.");
        steeringAtSearchLine = Math.abs(steering);
    }

    /**
     * Получить рулевое управление для поиска линии при движение по линии одним датчиком.
     */
    //% blockId="GetSteeringAtSearchLineForLineFollowOneSensor"
    //% block="get steering when searching line to follow line with one sensor"
    //% block.loc.ru="рулевое управление при поиске линии в движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Свойства движения"
    export function getSteeringAtSearchLineForLineFollowOneSensor() {
        return steeringAtSearchLine;
    }

}

namespace motions {

    interface LineMotionOptions {
        actionAfterMotion: AfterLineMotion,
        v?: number,
        lineFollowMode?: LineFollowMode
    }

    // Функция для вывода на экран отладочной информации при движении по линии
    export function printDubugLineFollow(refLeftLS: number, refRightLS: number, error: number, u: number, dt: number) {
        brick.clearScreen(); // Очистка экрана
        brick.printValue("refLeftLS", refLeftLS, 1);
        brick.printValue("refRightLS", refRightLS, 2);
        brick.printValue("error", error, 3);
        brick.printValue("u", u, 4);
        brick.printValue("dt", dt, 12);
    }

    // Функция расчёта ошибки от одного датчика
    export function getLineFollowError(lineFollowMode: LineFollowMode | LineFollowSingleMode, refLeftLS: number, refRightLS: number): number {
        if (lineFollowMode == LineFollowMode.DualSensors) return refLeftLS - refRightLS;
        else if (lineFollowMode == LineFollowSingleMode.LeftInside) return refLeftLS - getLineFollowSetPoint();
        else if (lineFollowMode == LineFollowSingleMode.LeftOutside) return getLineFollowSetPoint() - refLeftLS;
        else if (lineFollowMode == LineFollowSingleMode.RightInside) return getLineFollowSetPoint() - refRightLS;
        else if (lineFollowMode == LineFollowSingleMode.RightOutside) return refRightLS - getLineFollowSetPoint();
        return 0;
    }

    // Функция, которая выполняет действие после цикла с движением по линии
    export function actionAfterLineMotion(options: LineMotionOptions) {
        if (options.actionAfterMotion == AfterLineMotion.Rolling) { // Прокатка, чтобы встать на линию после определния перекрёстка
            chassis.linearDistMove(motions.getDistRollingAfterIntersection(), options.v, MotionBraking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.SmoothRolling) { // Прокатка, чтобы вставать на линию с мягким торможением после определния перекрёстка
            chassis.decelFinishLinearDistMove(options.v, motions.getMinPwrAtEndMovement(), motions.getDistRollingAfterIntersection(), motions.getDistRollingAfterIntersection(), AfterMotion.HoldStop);
        } else if (options.actionAfterMotion == AfterLineMotion.LineRolling) { // Прокатка с движением по линии на расстояние и торможением
            rollingLineFollowing(LineFollowMode.DualSensors, motions.getDistRollingAfterIntersection(), options.v, AfterMotion.HoldStop);
        } else if (options.actionAfterMotion == AfterLineMotion.LineSmoothRolling) { // Прокатка с движением по линии и плавным торможением
            rampRollingLineFollowingByDualSensors(motions.getDistRollingAfterIntersection(), options.v, MotionBraking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.LineContinueRoll) { // Прокатка с движением по линии для съезда с линии с продолжением движения
            if (options.lineFollowMode == undefined) return; // Ошибка!
            rollingLineFollowing(options.lineFollowMode, motions.getDistRollingFromLineAfterIntersection(), options.v, AfterMotion.NoStop);
        } else if (options.actionAfterMotion == AfterLineMotion.HoldStop) { // Тормоз c удержанием
            chassis.stop(Braking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.FloatStop) { // Тормоз с освобождением мотора, т.е. прокаткой по инерции
            chassis.stop(Braking.Coast);
        } else if (options.actionAfterMotion == AfterLineMotion.Continue) { // В continue не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            chassis.steeringCommand(0, options.v);
        }
    }

    // Вспомогательная функция для движения по линии одним датчиком и для того, чтобы подрулувать с ожиданием нахождения линии
    export function steeringUntilFindLine(lineSensor: LineSensor, steering: number, v: number) {
        const { speedLeft, speedRight } = chassis.getSpeedsAtSteering(steering, v);

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка диапазона регулирования регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сброс ПИД регулятора

        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        let prevTime = control.millis(); // Last time time variable for loop
        while (true) { // Synchronized motion control cycle
            const currTime = control.millis();
            const dt = currTime - prevTime;
            prevTime = currTime;
            const refLS = sensors.getNormalizedReflectionValue(lineSensor); // Нормализованное значение с датчика линии
            if (refLS < getLineFollowSetPoint()) break;
            const eml = chassis.leftMotor.angle() - emlPrev; // Get left motor and right motor encoder current value
            const emr = chassis.rightMotor.angle() - emrPrev;
            const error = advmotctrls.getErrorSyncMotors(eml, emr, speedLeft, speedRight); // Find out the error in motor speed control
            const u = chassis.pidChassisSync.compute(dt == 0 ? 1 : dt, -error); // Find out and record the control action of the regulator
            const powers = advmotctrls.getPwrSyncMotors(u, speedLeft, speedRight); // Find out the power of motors for regulation
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight); // Set power/speed motors
            control.pauseUntilTimeMs(currTime, 1); // Wait until the control cycle reaches the set amount of time passed
        }
    }

    // Вспомогательная функция движения по линии на расстояние, для съезда с линии и последующего движения
    export function rollingLineFollowing(lineFollowMode: LineFollowMode, rollingDist: number, v: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        const calcMotRot = Math.distanceToTicks(rollingDist); // Дистанция в мм, которую нужно проехать по линии

        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору, временное
        // Сбрасывать регулятор не требуется, т.е. его состояние будет дальше использоваться с предыдущей функции

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
            const error = getLineFollowError(lineFollowMode, refLeftLS, refRightLS); // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        motions.actionAfterMotion(actionAfterMotion, v);
    }
    
}