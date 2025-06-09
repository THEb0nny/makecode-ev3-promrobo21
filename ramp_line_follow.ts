namespace motions {

    export let rampLineFollowCrossIntersection2SensorStartSpeed = 20; // Переменная для хранения минимальной скорости на старте при движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorMaxSpeed = 50; // Переменная для хранения максимальной скорости при движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorFinishSpeed = 10; // Переменная для хранения минимальной скорости при окончании движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let rampLineFollowCrossIntersection2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export let rampLineFollowToDistance2SensorStartSpeed = 20; // Переменная для хранения минимальной скорости на старте при движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorMaxSpeed = 50; // Переменная для хранения максимальной скорости при движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorFinishSpeed = 10; // Переменная для хранения минимальной скорости при окончании движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorKi = 0; // Переменная для хранения коэффицента интегорального регулятора при движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    export let rampLineFollowToDistance2SensorKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    export function rampRollingLineFollowingByTwoSensors(rollingDist: number, speed: number, braking: MotionBraking, debug: boolean = false) {
        // pidLineFollow.setGains(rampLineFollow2SensorKp, rampLineFollow2SensorKi, rampLineFollow2SensorKd); // Установка коэффицентов ПИД регулятора
        // pidLineFollow.setDerivativeFilter(rampLineFollow2SensorKf); // Установить фильтр дифференциального регулятора
        // pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        // pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotDecelCalc = Math.calculateDistanceToEncRotate(Math.abs(rollingDist)); // Расчитываем расстояние замедления

        advmotctrls.accTwoEncConfig(0, speed, 10, 0, mRotDecelCalc, mRotDecelCalc);

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
     * Движение по линии на расстояние в мм с ускорением и замедлением.
     * Расстояние ускорения, расстояние замедления не могут быть в сумме больше, чем общая дистанция.
     * @param totalDist общее расстояние движения в мм, eg: 400
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param braking тип торможения, eg: MotionBraking.Hold
     * @param debug отладка, eg: false
     */
    //% blockId="RampLineFollowToDistanceByTwoSensors"
    //% block="ramp line follow to distance $totalDist mm acceleration $accelDist deceleration $decelDist|с действием после $braking||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist|с действием после $braking||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="RampLineFollowEmptyParams"
    //% weight="78"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние с ускорениями"
    export function rampLineFollowToDistanceByTwoSensors(totalDist: number, accelDist: number, decelDist: number, braking: MotionBraking, params?: params.RampLineFollow, debug: boolean = false) {
        if (totalDist < 0 || accelDist < 0 || decelDist < 0 || Math.abs(accelDist) + Math.abs(decelDist) > totalDist) {
            chassis.stop();
            console.log("Error: the distance values are negative or the sum of the acceleration and deceleration distances is greater than the total distance!");
            control.assert(false, 6);
        } else if (totalDist == 0) {
            chassis.stop();
            return;
        }

        if (params) { // Если были переданы параметры
            if (params.startSpeed) rampLineFollowToDistance2SensorStartSpeed = Math.abs(params.startSpeed);
            if (params.maxSpeed) rampLineFollowToDistance2SensorMaxSpeed = Math.abs(params.maxSpeed);
            if (params.finishSpeed) rampLineFollowToDistance2SensorFinishSpeed = Math.abs(params.finishSpeed);
            if (params.Kp) rampLineFollowToDistance2SensorKp = params.Kp;
            if (params.Ki) rampLineFollowToDistance2SensorKi = params.Ki;
            if (params.Kd) rampLineFollowToDistance2SensorKd = params.Kd;
            if (params.Kf) rampLineFollowToDistance2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(rampLineFollowToDistance2SensorKp, rampLineFollowToDistance2SensorKi, rampLineFollowToDistance2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(rampLineFollowToDistance2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(Math.abs(decelDist)); // Расчитываем расстояние замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(Math.abs(totalDist)); // Рассчитываем общюю дистанцию

        advmotctrls.accTwoEncConfig(rampLineFollowToDistance2SensorStartSpeed, rampLineFollowToDistance2SensorMaxSpeed, rampLineFollowToDistance2SensorFinishSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);

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
        actionAfterMotion(rampLineFollowToDistance2SensorFinishSpeed, braking); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии до перекрёстка думя датчиками с ускорениями и замедлениями.
     * @param totalDist общее расстояние движения в мм, eg: 400
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="RampLineFollowToCrossIntersection"
    //% block="движение по линии до перекрёстка на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist c действием после $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка на расстояние $totalDist мм с ускорением $accelDist замеделнием $decelDist c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="RampLineFollowEmptyParams"
    //% weight="99"
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка c фазами"
    export function rampLineFollowToCrossIntersection(totalDist: number, accelDist: number, decelDist: number, actionAfterMotion: AfterLineMotion, params?: params.RampLineFollow, debug: boolean = false) {
        if (totalDist < 0 || accelDist < 0 || decelDist < 0 || Math.abs(accelDist) + Math.abs(decelDist) > totalDist) {
            chassis.stop();
            console.log("Error: the distance values are negative or the sum of the acceleration and deceleration distances is greater than the total distance!");
            control.assert(false, 6);
        } else if (totalDist == 0) {
            chassis.stop();
            return;
        }
        // Проверка условия, что params.finishSpeed или rampLineFollowCrossIntersection2SensorFinishSpeed 0, робот не будет ехать по линии до перекрёстка
        
        if (params) { // Если были переданы параметры
            if (params.startSpeed) rampLineFollowCrossIntersection2SensorStartSpeed = Math.abs(params.startSpeed);
            if (params.maxSpeed) rampLineFollowCrossIntersection2SensorMaxSpeed = Math.abs(params.maxSpeed);
            if (params.finishSpeed) rampLineFollowCrossIntersection2SensorFinishSpeed = Math.abs(params.finishSpeed);
            if (params.Kp) rampLineFollowCrossIntersection2SensorKp = params.Kp;
            if (params.Ki) rampLineFollowCrossIntersection2SensorKi = params.Ki;
            if (params.Kd) rampLineFollowCrossIntersection2SensorKd = params.Kd;
            if (params.Kf) rampLineFollowCrossIntersection2SensorKf = params.Kf;
        }

        pidLineFollow.setGains(rampLineFollowCrossIntersection2SensorKp, rampLineFollowCrossIntersection2SensorKi, rampLineFollowCrossIntersection2SensorKd); // Установка коэффицентов ПИД регулятора
        pidLineFollow.setDerivativeFilter(rampLineFollowCrossIntersection2SensorKf); // Установить фильтр дифференциального регулятора
        pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
        pidLineFollow.reset(); // Сброс ПИД регулятора

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(Math.abs(accelDist)); // Расчитываем расстояние ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(Math.abs(decelDist)); // Расчитываем расстояние замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(Math.abs(totalDist)); // Рассчитываем общюю дистанцию

        advmotctrls.accTwoEncConfig(rampLineFollowCrossIntersection2SensorStartSpeed, rampLineFollowCrossIntersection2SensorMaxSpeed, rampLineFollowCrossIntersection2SensorFinishSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev, emr = chassis.rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (out.isDone && refLeftLS < getLineFollowRefTreshold() && refRightLS < getLineFollowRefTreshold()) break; // Проверка условия окончания движения на расстояние и на перекрёсток
            let error = refLeftLS - refRightLS; // Ошибка регулирования
            pidLineFollow.setPoint(error); // Передать ошибку регулятору
            let U = pidLineFollow.compute(dt, 0); // Управляющее воздействие
            chassis.regulatorSteering(U, out.pwr); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, U, dt);
            control.pauseUntilTime(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion(actionAfterMotion, rampLineFollowCrossIntersection2SensorFinishSpeed); // Действие после алгоритма движения
        // А если rampLineFollowCrossIntersection2SensorFinishSpeed установленна как 0?
    }

}