namespace motions {

    let lineRefThreshold = 50; // Среднее значение серого для определения границы линии
    let lineFollowRefThreshold = 40; // Пороговое значение определения заезда на перекрёсток
    let lineFollowSetPoint = lineRefThreshold; // Среднее значение серого (уставка) для движения по линии

    let lineFollowByOneSensorConditionMaxErr = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    let steeringAtSearchLine = 25; // Подруливание при поиске линии для последущего движени одним датчиком

    let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    let distRollingAfterIntersection = 30; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    let distContinueRollFromLineAfterIntersection = 20; // Дистанция прокатки на перекрёстке для съезда с него в мм

    export let lineFollowCrossIntersection2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersection2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка

    export let lineFollowRightIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка

    export let lineFollowToDistance2SensorSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistance2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками на расстояние

    export let lineFollowToDistanceLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceLeftSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком на расстояние

    export let lineFollowToDistanceRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKp = 0.7; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceRightSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком на расстояние

    export const pidLineFollow = new automation.PIDController(); // PID для регулирования движения по линии

    /**
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param dist дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterIntersection"
    //% block="set distance $dist mm rolling after intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function setDistRollingAfterIntersection(dist: number) {
        distRollingAfterIntersection = dist;
    }

    /**
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterIntersection"
    //% block="get distance rolling after intersection in mm"
    //% block.loc.ru="дистанция прокатки после перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
    export function getDistRollingAfterIntersection(): number {
        return distRollingAfterIntersection;
    }

    /**
     * Установить дистанцию для прокатки на перекрёстке без торможения. Например, чтобы не определять повторно линию.
     * @param dist дистанция прокатки после перекрёстка, eg: 20
     */
    //% blockId="SetDistRollingFromLineAfterIntersection"
    //% block="set distance $dist mm rolling exit an intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки съезда с перекрёстка"
    //% inlineInputMode="inline"
    //% weight="97" blockGap="8"
    //% group="Свойства движения"
    //% deprecated=true
    export function setDistRollingFromLineAfterIntersection(dist: number) {
        distContinueRollFromLineAfterIntersection = dist;
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
        lineRefThreshold = reflection;
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
        lineFollowRefThreshold = reflection;
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
        lineFollowSetPoint = reflectionSetPoint;
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
     * @param maxErr максимальное значение ошибки движения по линии, eg: 40
     */
    //% blockId="SetLineFollowOneSensorConditionMaxErr"
    //% block="set line follow max error $maxErr at moving by one sensor"
    //% block.loc.ru="установить максимальую ошибку $maxErr при движении одним датчиком"
    //% inlineInputMode="inline"
    //% weight="79" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowOneSensorConditionMaxErr(maxErr: number) {
        lineFollowByOneSensorConditionMaxErr = maxErr;
    }

    /**
     * Получить максимальную ошибку условия движения одним датчиком по линии.
     */
    //% blockId="GetLineFollowOneSensorConditionMaxErr"
    //% block="get line follow by one sensor max error"
    //% block.loc.ru="максимальая ошибка при движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Свойства для датчиков"
    export function getLineFollowOneSensorConditionMaxErr(): number {
        return lineFollowByOneSensorConditionMaxErr;
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
        lineFollowLoopDt = dt;
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
     * @param newSteering получительное значение рулевого подворота к линии, eg: 15
     */
    //% blockId="SetSteeringAtSearchLineForLineFollowOneSensor"
    //% block="set steering $newSteering when searching line to follow line with one sensor"
    //% block.loc.ru="установить рулевое управление $newSteering при поиске линии в движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Свойства движения"
    export function setSteeringAtSearchLineForLineFollowOneSensor(newSteering: number) {
        newSteering = Math.abs(newSteering);
        steeringAtSearchLine = newSteering;
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

    export function printDubugLineFollow(refLeftLS: number, refRightLS: number, error: number, U: number, dt: number) {
        brick.clearScreen(); // Очистка экрана
        brick.printValue("refLeftLS", refLeftLS, 1);
        brick.printValue("refRightLS", refRightLS, 2);
        brick.printValue("error", error, 3);
        brick.printValue("U", U, 4);
        brick.printValue("dt", dt, 12);
    }

    // Функция, которая выполняет действие после цикла с движением по линии
    export function actionAfterLineMotion(actionAfterMotion: AfterLineMotion, speed?: number) {
        if (actionAfterMotion == AfterLineMotion.Rolling) { // Прокатка, чтобы встать на линию после определния перекрёстка
            chassis.linearDistMove(motions.getDistRollingAfterIntersection(), speed, MotionBraking.Hold);
        } else if (actionAfterMotion == AfterLineMotion.SmoothRolling) { // Прокатка, чтобы вставать на линию с мягким торможением после определния перекрёстка
            chassis.decelFinishLinearDistMove(speed, minPwrAtEndMovement, AfterMotion.HoldStop, motions.getDistRollingAfterIntersection());
        } else if (actionAfterMotion == AfterLineMotion.ContinueRoll) { // Прокатка с линии
            // motions.rollingMoveOutFromLine(motions.getDistRollingFromLineAfterIntersection(), speed);
            chassis.linearDistMove(motions.getDistRollingFromLineAfterIntersection(), speed, MotionBraking.Coasting);
        } else if (actionAfterMotion == AfterLineMotion.LineRolling) { // Прокатка с движением по линии с тормозом
            rollingLineFollowing(motions.getDistRollingAfterIntersection(), speed, AfterMotion.HoldStop);
        } else if (actionAfterMotion == AfterLineMotion.LineSmoothRolling) { // Прокатка с движением по линии с плавным торможением
            rampRollingLineFollowingByTwoSensors(motions.getDistRollingAfterIntersection(), speed, MotionBraking.Hold);
        } else if (actionAfterMotion == AfterLineMotion.LineContinueRoll) { // Прокатка с движением по линии для съезда с линии с продолжением движения
            if (true) {
                rollingLineFollowing(motions.getDistRollingFromLineAfterIntersection(), speed, AfterMotion.NoStop);
            } else if (false) {
                
            } else if (false) {

            } else {
                return;
            }
        } else if (actionAfterMotion == AfterLineMotion.HoldStop) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(Braking.Hold);
        } else if (actionAfterMotion == AfterLineMotion.FloatStop) { // Тормоз с особождением мотора, т.е. прокаткой по инерции
            chassis.stop(Braking.Float);
        } else if (actionAfterMotion == AfterLineMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            chassis.steeringCommand(0, speed);
        }
    }

    // Вспомогательная функция для движения по линии одним датчиком и для того, чтобы подрулувать с ожиданием нахождения линии
    export function steeringUntilFindLine(lineSensor: LineSensor, steering: number, speed: number) {
        const { speedLeft, speedRight } = chassis.getSpeedsAtSteering(steering, speed);

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка диапазона регулирования регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сброс ПИД регулятора

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // We read the value from the encoder from the left and right motor before starting

        let prevTime = control.millis(); // Last time time variable for loop
        while (true) { // Synchronized motion control cycle
            const currTime = control.millis();
            const dt = currTime - prevTime;
            prevTime = currTime;
            const refLS = sensors.getNormalizedReflectionValue(lineSensor); // Нормализованное значение с датчика линии
            if (refLS < getLineFollowSetPoint()) break;
            const eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Get left motor and right motor encoder current value
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, speedLeft, speedRight); // Find out the error in motor speed control
            const u = chassis.pidChassisSync.compute(dt, -error); // Find out and record the control action of the regulator
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, speedLeft, speedRight); // Find out the power of motors for regulation
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight); // Set power/speed motors
            control.pauseUntilTime(currTime, 1); // Wait until the control cycle reaches the set amount of time passed
        }
    }

    // Вспомогательная функция движения по линии на расстояние при обнаружении линии, для съезда с линии и последующего движения по ней
    export function rollingLineFollowing(rollingDist: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        const calcMotRot = Math.calculateDistanceToEncRotate(rollingDist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору, временное
        // Сбрасывать регулятор не требуется, т.е. его состояние будет дальше использоваться с предыдущей функции

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, speed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        motions.actionAfterMotion(actionAfterMotion, speed);
    }
    
}

namespace motions {

    function lineFollowToIntersection(actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        
    }

    /**
     * Функция движения по линии до перекрёстка двумя датчиками.
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
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
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    export function lineFollowToCrossIntersection(actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowCrossIntersection2SensorSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowCrossIntersection2SensorKp = params.Kp;
            if (params.Ki >= 0) lineFollowCrossIntersection2SensorKi = params.Ki;
            if (params.Kd >= 0) lineFollowCrossIntersection2SensorKd = params.Kd;
            if (params.Kf >= 0) lineFollowCrossIntersection2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowCrossIntersection2SensorKp, lineFollowCrossIntersection2SensorKi, lineFollowCrossIntersection2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowCrossIntersection2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < getLineFollowRefThreshold() && refRightLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowCrossIntersection2SensorSpeed); // Команда моторам
            // console.log(`refLS: ${refLeftLS} ${refRightLS}, error: ${error}, u: ${u}`);
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowCrossIntersection2SensorSpeed); // Действие после алгоритма движения
    }


    /**
     * Функция движения по линии до определения перекрёстка слева или справа.
     * Если слева, тогда движение осуществляется правым датчиком и левый отвечает за определение.
     * Если справа, тогда за движение отвечает левый датчик, а правый отвечает за определение перекрёстка.
     * @param sideIntersection перекрёсток слева или справа, eg: SideIntersection.LeftInside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
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
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    export function lineFollowToSideIntersection(sideIntersection: SideIntersection, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (sideIntersection == SideIntersection.LeftInside) {
            lineFollowToLeftIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.LeftOutside) {
            lineFollowToLeftIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightInside) {
            lineFollowToRightIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightOutside) {
            lineFollowToRightIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        } else return;
    }

    /**
     * Функция движения по линии до определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param AfterLineMotion действие после перекрёстка, eg: AfterMotion.Rolling
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
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
    export function lineFollowToLeftIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowLeftIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowLeftIntersectionKp = params.Kp;
            if (params.Ki >= 0) lineFollowLeftIntersectionKi = params.Ki;
            if (params.Kd >= 0) lineFollowLeftIntersectionKd = params.Kd;
            if (params.Kf >= 0) lineFollowLeftIntersectionKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowLeftIntersectionKp, lineFollowLeftIntersectionKi, lineFollowLeftIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowLeftIntersectionKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowOneSensorConditionMaxErr() && refLeftLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток, когда робот едет по линии
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowLeftIntersectionSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowLeftIntersectionSpeed); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии до определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
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
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
    export function lineFollowToRightIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowRightIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowRightIntersectionKp = params.Kp;
            if (params.Ki >= 0) lineFollowRightIntersectionKi = params.Ki;
            if (params.Kd >= 0) lineFollowRightIntersectionKd = params.Kd;
            if (params.Kf >= 0) lineFollowRightIntersectionKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowRightIntersectionKp, lineFollowRightIntersectionKi, lineFollowRightIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowRightIntersectionKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Left, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? 1 : -1), lineFollowRightIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowOneSensorConditionMaxErr() && refRightLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowRightIntersectionSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowRightIntersectionSpeed); // Действие после алгоритма движения
    }

}

namespace motions {

    /**
     * Движение по линии на расстояние.
     * @param dist дистанция движения в мм, eg: 250
    * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByTwoSensors"
    //% block="line follow to distance $dist mm after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $dist мм с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="79"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceByTwoSensors(dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowToDistance2SensorSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowToDistance2SensorKp = params.Kp;
            if (params.Ki >= 0) lineFollowToDistance2SensorKi = params.Ki;
            if (params.Kd >= 0) lineFollowToDistance2SensorKd = params.Kd;
            if (params.Kf >= 0) lineFollowToDistance2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistance2SensorKp, lineFollowToDistance2SensorKi, lineFollowToDistance2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistance2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistance2SensorSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistance2SensorSpeed); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние одним из датчиков.
     * @param followLineSensor выбранным сенсором и позицией, eg: FollowLineSensor.LeftInside
     * @param dist дистанция движения в мм eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByOneSensor"
    //% block="line follow $followLineSensor sensor to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии $followLineSensor датчиком на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="76"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceByOneSensor(followLineSensor: FollowLineSensor, dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (followLineSensor == FollowLineSensor.LeftInside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Inside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.LeftOutside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Outside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.RightInside) {
            lineFollowToDistanceByRightSensor(LineLocation.Inside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.RightOutside) {
            lineFollowToDistanceByRightSensor(LineLocation.Outside, dist, actionAfterMotion, params, debug);
        }
    }

    /**
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByLeftSensor"
    //% block="line follow left sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии левым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="75"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByLeftSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowToDistanceLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowToDistanceLeftSensorKp = params.Kp;
            if (params.Ki >= 0) lineFollowToDistanceLeftSensorKi = params.Ki;
            if (params.Kd >= 0) lineFollowToDistanceLeftSensorKd = params.Kd;
            if (params.Kf >= 0) lineFollowToDistanceLeftSensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistanceLeftSensorKp, lineFollowToDistanceLeftSensorKi, lineFollowToDistanceLeftSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceLeftSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistanceLeftSensorSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistanceLeftSensorSpeed); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByRightSensor"
    //% block="line follow right sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии правым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="74" blockGap="8"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByRightSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed >= 0) lineFollowToDistanceRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp >= 0) lineFollowToDistanceRightSensorKp = params.Kp;
            if (params.Ki >= 0) lineFollowToDistanceRightSensorKi = params.Ki;
            if (params.Kd >= 0) lineFollowToDistanceRightSensorKd = params.Kd;
            if (params.Kf >= 0) lineFollowToDistanceRightSensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistanceRightSensorKp, lineFollowToDistanceRightSensorKi, lineFollowToDistanceRightSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceRightSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = control.millis(); // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            const u = pidLineFollow.compute(dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowToDistanceRightSensorSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistanceRightSensorSpeed); // Действие после алгоритма движения
    }

}