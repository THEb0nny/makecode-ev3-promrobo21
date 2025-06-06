namespace motions {

    let lineRefTreshold = 50; // Среднее значение серого (уставка) для определения границы линии
    let lineFollowRefTreshold = 35; // Пороговое значение определения перекрёстка
    let lineFollowSetPoint = lineFollowRefTreshold; // Среднее значение серого

    let distRollingAfterIntersection = 30; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    let distRollingFromLineAfterIntersection = 20; // Дистанция прокатки на перекрёстке для съезда с него в мм

    let lineFollowWithOneSensorConditionMaxErr = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    let steeringAtSearchLine = 25; // Подруливание при поиске линии для последущего движени одним датчиком

    let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    export let lineFollowCrossIntersectionSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let lineFollowCrossIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let lineFollowLeftIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка
    export let lineFollowLeftIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии правым датчиком до левого перекрёстка

    export let lineFollowRightIntersectionSpeed = 50; // Переменная для хранения скорости при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка
    export let lineFollowRightIntersectionKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движении по линии левым датчиком до правого перекрёстка

    export let lineFollowToDistanceSpeed = 50; // Переменная для хранения скорости при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками на расстояние
    export let lineFollowToDistanceKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками на расстояние

    export let lineFollowToDistanceWithLeftSensorSpeed = 50; // Переменная для хранения скорости при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии левым датчиком на расстояние
    export let lineFollowToDistanceWithLeftSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии левым датчиком на расстояние

    export let lineFollowToDistanceWithRightSensorSpeed = 50; // Переменная для хранения скорости при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии правым датчиком на расстояние
    export let lineFollowToDistanceWithRightSensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии правым датчиком на расстояние

    export let rampLineFollow2SensorStartSpeed = 10; // Переменная для хранения минимальной скорости на старте при движения по линии двумя датчиками
    export let rampLineFollow2SensorMaxSpeed = 50; // Переменная для хранения максимальной скорости при движения по линии двумя датчиками
    export let rampLineFollow2SensorFinishSpeed = 10; // Переменная для хранения минимальной скорости при окончании движения по линии двумя датчиками
    export let rampLineFollow2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let rampLineFollow2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

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
        distRollingFromLineAfterIntersection = dist;
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
        return distRollingFromLineAfterIntersection;
    }

    /**
     * Установить пороговое значение отражения для линии.
     * @param reflection значение отражения, eg: 50
     */
    //% blockId="SetLineRefTreshold"
    //% block="set reflection $reflection treshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineRefTreshold(reflection: number) {
        lineRefTreshold = reflection;
    }

    /**
     * Получить пороговое значение отражения для линии.
     */
    //% blockId="GetLineRefTreshold"
    //% block="get reflection treshold"
    //% block.loc.ru="пороговое значение отражения"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Свойства для датчиков"
    export function getLineRefTreshold(): number {
        return lineRefTreshold
    }

    /**
     * Установить пороговое значение отражения при движении по линии.
     * @param reflection значение отражения, eg: 35
     */
    //% blockId="SetLineFollowRefTreshold"
    //% block="set line follow $reflection reflection treshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="87" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowRefTreshold(reflection: number) {
        lineFollowRefTreshold = reflection;
    }

    /**
     * Получить пороговое значение отражения при движении по линии.
     */
    //% blockId="GetLineFollowRefTreshold"
    //% block="get line follow reflection treshold"
    //% block.loc.ru="пороговое значение отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Свойства для датчиков"
    export function getLineFollowRefTreshold(): number {
        return lineFollowRefTreshold;
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
     * @param maxErr максимальное значение ошибки движения по линии, eg: 30
     */
    //% blockId="SetLineFollowConditionMaxErr"
    //% block="set line follow max error $maxErr at moving with one sensor"
    //% block.loc.ru="установить максимальую ошибку $maxErr при движении одним датчиком"
    //% inlineInputMode="inline"
    //% weight="79" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowConditionMaxErr(maxErr: number) {
        lineFollowWithOneSensorConditionMaxErr = maxErr;
    }

    /**
     * Получить максимальную ошибку условия движения одним датчиком по линии.
     */
    //% blockId="GetLineFollowConditionMaxErr"
    //% block="get line follow max error"
    //% block.loc.ru="максимальая ошибка при движении по линии"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Свойства для датчиков"
    export function getLineFollowConditionMaxErr(): number {
        return lineFollowWithOneSensorConditionMaxErr;
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

    export function getLineFollowLoopDt() {
        return lineFollowLoopDt;
    }

    /**
     * Устновить рулевое управление для поиска линии при движение по линии одним датчиком.
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
            chassis.decelFinishLinearDistMove(speed, 15, motions.getDistRollingAfterIntersection());
        } else if (actionAfterMotion == AfterLineMotion.ContinueRoll) { // Прокатка с линии
            // motions.rollingMoveOutFromLine(motions.getDistRollingFromLineAfterIntersection(), speed);
            chassis.linearDistMove(motions.getDistRollingFromLineAfterIntersection(), speed, MotionBraking.NoStop);
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

        advmotctrls.syncMotorsConfig(speedLeft, speedRight); // Set motor speeds for subsequent regulation
        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Setting the regulator coefficients
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Regulator limitation
        chassis.pidChassisSync.reset(); // Reset pid controller

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // We read the value from the encoder from the left and right motor before starting

        let prevTime = 0; // Last time time variable for loop
        while (true) { // Synchronized motion control cycle
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refLS = sensors.getNormalizedReflectionValue(lineSensor); // Нормализованное значение с датчика линии
            if (refLS < getLineFollowSetPoint()) break;
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Get left motor and right motor encoder current value
            let error = advmotctrls.getErrorSyncMotors(eml, emr); // Find out the error in motor speed control
            chassis.pidChassisSync.setPoint(error); // Transfer control error to controller
            let U = chassis.pidChassisSync.compute(dt, 0); // Find out and record the control action of the regulator
            let powers = advmotctrls.getPwrSyncMotors(U); // Find out the power of motors for regulation
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight); // Set power/speed motors
            control.pauseUntilTime(currTime, 1); // Wait until the control cycle reaches the set amount of time passed
        }
    }

    // Вспомогательная функция движения по линии на расстояние при обнаружении линии, для съезда с линии и последующего движения по ней
    export function rollingLineFollowing(rollingDist: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        const calcMotRot = Math.calculateDistanceToEncRotate(rollingDist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        // Сбрасывать регулятор не требуется, т.е. его состояние будет дальше использоваться с предыдущей функции

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, speed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        motions.actionAfterMotion(actionAfterMotion, speed);
    }

    export function rampRollingLineFollowingByTwoSensors(rollingDist: number, speed: number, braking: MotionBraking, debug: boolean = false) {
        // pidLineFollow.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        // pidLineFollow.setDerivativeFilter(rampLineFollow2SensorKf); // Установить фильтр дифференциального регулятора
        // pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        // pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotDecelCalc = Math.calculateDistanceToEncRotate(Math.abs(rollingDist)); // Расчитываем расстояние замедления

        advmotctrls.accTwoEncConfig(0, speed, 0, 0, mRotDecelCalc, mRotDecelCalc);

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, out.pwr); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        actionAfterMotion(braking, 15); // Действие после алгоритма движения
    }
    
}

namespace motions {

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
            if (params.speed) lineFollowCrossIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowCrossIntersectionKp = params.Kp;
            if (params.Ki) lineFollowCrossIntersectionKi = params.Ki;
            if (params.Kd) lineFollowCrossIntersectionKd = params.Kd;
            if (params.Kf) lineFollowCrossIntersectionKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowCrossIntersectionKp, lineFollowCrossIntersectionKi, lineFollowCrossIntersectionKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowCrossIntersectionKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < getLineFollowRefTreshold() && refRightLS < getLineFollowRefTreshold()) break; // Проверка на перекрёсток
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowCrossIntersectionSpeed); // Команда моторам
            // console.log(`refLS: ${refLeftLS} ${refRightLS}, error: ${error}, U: ${U}`);
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowCrossIntersectionSpeed); // Действие после алгоритма движения
    }

    export function accelLineFollowToCrossIntersection(accelDist: number, actionAfterMotion: AfterLineMotion, params?: params.RampLineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.startSpeed) rampLineFollow2SensorStartSpeed = Math.abs(params.startSpeed);
            if (params.maxSpeed) rampLineFollow2SensorMaxSpeed = Math.abs(params.maxSpeed);
            if (params.Kp) rampLineFollow2SensorKp = params.Kp;
            if (params.Ki) rampLineFollow2SensorKi = params.Ki;
            if (params.Kd) rampLineFollow2SensorKd = params.Kd;
            if (params.Kf) rampLineFollow2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(rampLineFollow2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения

        advmotctrls.accTwoEncConfig(rampLineFollow2SensorStartSpeed, rampLineFollow2SensorMaxSpeed, rampLineFollow2SensorFinishSpeed, mRotAccelCalc, 0, mRotAccelCalc);

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, out.pwr); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowCrossIntersectionSpeed); // Действие после алгоритма движения
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
    export function lineFollowToSideIntersection(sideIntersection: SideIntersection, actionAfterMotion: AfterLineMotion, params?: params.AccelLineFollow, debug: boolean = false) {
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
            if (params.speed) lineFollowLeftIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowLeftIntersectionKp = params.Kp;
            if (params.Ki) lineFollowLeftIntersectionKi = params.Ki;
            if (params.Kd) lineFollowLeftIntersectionKd = params.Kd;
            if (params.Kf) lineFollowLeftIntersectionKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowLeftIntersectionKp, lineFollowLeftIntersectionKi, lineFollowLeftIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowLeftIntersectionKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowConditionMaxErr() && refLeftLS < getLineFollowRefTreshold()) break; // Проверка на перекрёсток, когда робот едет по линии
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowLeftIntersectionSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
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
            if (params.speed) lineFollowRightIntersectionSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowRightIntersectionKp = params.Kp;
            if (params.Ki) lineFollowRightIntersectionKi = params.Ki;
            if (params.Kd) lineFollowRightIntersectionKd = params.Kd;
            if (params.Kf) lineFollowRightIntersectionKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowRightIntersectionKp, lineFollowRightIntersectionKi, lineFollowRightIntersectionKd); // Установка коэффицентов регулятора
        pidLineFollow.setDerivativeFilter(lineFollowRightIntersectionKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка диапазона регулирования регулятора
        pidLineFollow.reset(); // Сброс регулятора

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Left, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? 1 : -1), lineFollowRightIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowConditionMaxErr() && refRightLS < getLineFollowRefTreshold()) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowRightIntersectionSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
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
    //% blockId="LineFollowToDistance"
    //% block="line follow to distance $dist mm after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $dist мм с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="79"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistance(dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.speed) lineFollowToDistanceSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceKp = params.Kp;
            if (params.Ki) lineFollowToDistanceKi = params.Ki;
            if (params.Kd) lineFollowToDistanceKd = params.Kd;
            if (params.Kf) lineFollowToDistanceKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistanceKp, lineFollowToDistanceKi, lineFollowToDistanceKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowToDistanceSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistanceSpeed); // Действие после алгоритма движения
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
            if (params.speed) lineFollowToDistanceWithLeftSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceWithLeftSensorKp = params.Kp;
            if (params.Ki) lineFollowToDistanceWithLeftSensorKi = params.Ki;
            if (params.Kd) lineFollowToDistanceWithLeftSensorKd = params.Kd;
            if (params.Kf) lineFollowToDistanceWithLeftSensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistanceWithLeftSensorKp, lineFollowToDistanceWithLeftSensorKi, lineFollowToDistanceWithLeftSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceWithLeftSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowToDistanceWithLeftSensorSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistanceWithLeftSensorSpeed); // Действие после алгоритма движения
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
            if (params.speed) lineFollowToDistanceWithRightSensorSpeed = Math.abs(params.speed);
            if (params.Kp) lineFollowToDistanceWithRightSensorKp = params.Kp;
            if (params.Ki) lineFollowToDistanceWithRightSensorKi = params.Ki;
            if (params.Kd) lineFollowToDistanceWithRightSensorKd = params.Kd;
            if (params.Kf) lineFollowToDistanceWithRightSensorKf = params.Kf;
        }

        pidLineFollow.setGains(lineFollowToDistanceWithRightSensorKp, lineFollowToDistanceWithRightSensorKi, lineFollowToDistanceWithRightSensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(lineFollowToDistanceWithRightSensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), lineFollowLeftIntersectionSpeed);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let error = 0; // Переменная для хранения ошибки регулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторы
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, lineFollowToDistanceWithRightSensorSpeed); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, lineFollowToDistanceWithRightSensorSpeed); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние в мм с ускорением и замедлением.
     * Расстояние ускорения, расстояние замедления не могут быть в сумме больше, чем общая дистанция.
     * @param totalDist общее расстояние движения в мм, eg: 400
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param braking тип торможения, eg: MotionBraking.Hold
     * @param debug отладка, eg: false
     */
    //% blockId="RampLineFollowToDistance"
    //% block="ramp line follow to distance $totalDist mm acceleration $accelDist deceleration $decelDist|с действием после $braking||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist|с действием после $braking||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="RampLineFollowEmptyParams"
    //% weight="78"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние с ускорениями"
    export function rampLineFollowToDistance(totalDist: number, accelDist: number, decelDist: number, braking: MotionBraking, params?: params.RampLineFollow, debug: boolean = false) {
        if (totalDist < 0 || accelDist < 0 || decelDist < 0 || Math.abs(accelDist) + Math.abs(decelDist) > totalDist) {
            console.log("Error: the distance values are negative or the sum of the acceleration and deceleration distances is greater than the total distance!");
            control.assert(false, 6);
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
            if (params.Kf) rampLineFollow2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(rampLineFollow2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(Math.abs(decelDist)); // Расчитываем расстояние замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(Math.abs(totalDist)); // Рассчитываем общюю дистанцию

        advmotctrls.accTwoEncConfig(rampLineFollow2SensorStartSpeed, rampLineFollow2SensorMaxSpeed, rampLineFollow2SensorFinishSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, out.pwr); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        actionAfterMotion(rampLineFollow2SensorFinishSpeed, braking); // Действие после алгоритма движения
    }

}