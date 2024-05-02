namespace chassis {

    /**
     * Linear movement over a distance in mm at a constant speed.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * Линейное движение на расстояние в мм с постоянной скоростью.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость движения, eg: 60
     * @param braking тип торможения, eg: Braking.Hold
     */
    //% blockId="LinearDistMove"
    //% block="linear distance moving $dist|mm at $speed|\\%| braking $braking"
    //% block.loc.ru="линейное движение на расстояние $dist|мм на $speed|\\%| торможение $braking"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="79" blockGap="8"
    //% group="Синхронизированное движение"
    export function LinearDistMove(dist: number, speed: number, braking: Braking = Braking.Hold) {
        if (dist <= 0 || speed == 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const mRotCalc = Math.abs((dist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speed, speed, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Movement over a distance in mm with independent speeds on motors.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Движение на расстояние в мм с независимыми скоростями на моторы.
     * @param dist дистанция движения в мм, eg: 100
     * @param speedLeft скорость левого мотора, eg: 50
     * @param speedRight скорость правого мотора, eg: 50
     * @param braking тип торможения, eg: Braking.Hold
     */
    //% blockId="DistMove"
    //% block="distance moving $dist|mm at $speedLeft|\\%| $speedRight|\\%| braking $braking"
    //% block.loc.ru="движение на расстояние $dist|мм на $speedLeft|\\%| $speedRight|\\%| торможение $braking"
    //% inlineInputMode="inline"
    //% speedLeft.shadow="motorSpeedPicker"
    //% speedRight.shadow="motorSpeedPicker"
    //% weight="78"
    //% group="Синхронизированное движение"
    export function DistMove(dist: number, speedLeft: number, speedRight: number, braking: Braking = Braking.Hold) {
        if (dist <= 0 || speedLeft == 0 && speedRight == 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const mRotCalc = Math.abs((dist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speedLeft, speedRight, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Linear movement over a given distance with acceleration and deceleration in mm. It is not recommended to use a minimum speed of less than 10.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * The speed values must have the same sign!
     * Линейное движение на заданное расстояние с ускорением и замедлением в мм. Не рекомендуется использоваться минимальную скорость меньше 10.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Значения скоростей должны иметь одинаковый знак!
     * @param minSpeed начальная скорость движения, eg: 10
     * @param maxSpeed максимальная скорость движения, eg: 50
     * @param totalDist общее расстояние в мм, eg: 300
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 100
     */
    //% blockId="RampLinearDistMove"
    //% block="linear distance moving $totalDist|mm at acceleration $accelDist| deceleration $decelDist| min speed $minSpeed|\\%| max $maxSpeed|\\%"
    //% block.loc.ru="линейное движение на расстояние $totalDist|мм при ускорении $accelDist| замедлении $decelDist| c мин скоростью $minSpeed|\\%| макс $maxSpeed|\\%"
    //% inlineInputMode="inline"
    //% minSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% weight="77" blockGap="8"
    //% group="Синхронизированное движение"
    export function RampLinearDistMove(minSpeed: number, maxSpeed: number, totalDist: number, accelDist: number, decelDist: number) {
        if (maxSpeed == 0 || Math.abs(minSpeed) >= Math.abs(maxSpeed) || (minSpeed < 0 && maxSpeed > 0) || (minSpeed > 0 && maxSpeed < 0) || totalDist <= 0 || accelDist < 0 || decelDist < 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        let mRotAccelCalc = Math.abs((accelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние ускорения
        let mRotDecelCalc = Math.abs((decelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние замедления
        let mRotTotalCalc = Math.abs((totalDist / (Math.PI * chassis.getWheelRadius())) * 360); // Рассчитываем общюю дистанцию
        chassis.syncRampMovement(minSpeed, maxSpeed, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
    }

    /**
     * Synchronization with smooth acceleration in straight-line motion without braking. It is not recommended to set the minimum speed to less than 10.
     * Синхронизация с плавным ускорением при прямолинейном движении без торможения. Не рекомендуется устанавливать минимальную скорость меньше 10.
     * @param totalDist total length encoder value at, eg. 500
     * @param accelDist accelerate length encoder value, eg. 50
     * @param minSpeed start motor speed, eg. 10
     * @param maxSpeed max motor speed, eg. 50
     */
    //% blockId="RampLinearDistMoveWithoutBraking"
    //% block="linear distance moving $totalDist|mm at acceleration $accelDist| min speed $minSpeed|\\%| max $maxSpeed|\\%| without braking"
    //% block.loc.ru="линейное движение на расстояние $totalDist|мм при ускорении $accelDist| c мин скоростью $minSpeed|\\%| макс $maxSpeed|\\%| без торможения"
    //% inlineInputMode="inline"
    //% minSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% weight="76"
    //% group="Синхронизированное движение"
    export function RampLinearDistMoveWithoutBraking(minSpeed: number, maxSpeed: number, totalDist: number, accelDist: number) {
        //if (!motorsPair) return;
        if (maxSpeed == 0 || totalDist == 0) {
            stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const emlPrev = leftMotor.angle(); // Перед запуском мы считываем значение с энкодера на левом двигателе
        const emrPrev = rightMotor.angle(); // Перед запуском мы считываем значение с энкодера на правом двигателе
        advmotctrls.accTwoEncConfig(minSpeed, maxSpeed, accelDist, 0, totalDist);
        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Setting the regulator coefficients
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор
        let prevTime = 0;
        while (true) {
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let eml = leftMotor.angle() - emlPrev;
            let emr = rightMotor.angle() - emrPrev;
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break;
            let error = advmotctrls.getErrorSyncMotorsInPwr(eml, emr, out.pwrOut, out.pwrOut);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotorsInPwr(U, out.pwrOut, out.pwrOut);
            chassis.leftMotor.run(powers.pwrLeft);
            chassis.rightMotor.run(powers.pwrRight);
            control.pauseUntilTime(currTime, 5);
        }
        // Без команды торможения
    }

    // /**
    //  * Movement over a given distance with acceleration and deceleration in mm. It is not recommended to set the minimum speed to less than 10.
    //  * Движение на заданное расстояние с ускорением и замедлением в мм. Не рекомендуется устанавливать минимальную скорость меньше 10.
    //  * @param speedLeft скорость движения, eg: 50
    //  * @param speedRight скорость движения, eg: 50
    //  * @param totalDist общее расстояние в мм, eg: 300
    //  * @param accelDist расстояние ускорения в мм, eg: 100
    //  * @param decelDist расстояние замедления в мм, eg: 100
    //  */
    // //% blockId="RampDistMove"
    // //% block="distance moving $totalDist|mm acceleration $accelDist| deceleration $decelDist| at speed $speed|\\%"
    // //% block.loc.ru="движение на расстояние $totalDist|мм ускорения $accelDist| замедления $decelDist| со скоростью $speed|\\%"
    // //% inlineInputMode="inline"
    // //% speed.shadow="motorSpeedPicker"
    // //% weight="76"
    // //% group="Синхронизированное движение"
    // //% blockHidden="true"
    // export function RampDistMove(speedLeft: number, speedRight: number, totalDist: number, accelDist: number, decelDist: number) {
    //     if (speedLeft == 0 || speedRight == 0) {
    //         chassis.stop(true);
    //         music.playSoundEffect(sounds.systemGeneralAlert);
    //         pause(2000);
    //         return;
    //     }
    //     let mRotAccelCalc = Math.abs((accelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние ускорения
    //     let mRotDecelCalc = Math.abs((decelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние замедления
    //     let mRotTotalCalc = Math.abs((totalDist / (Math.PI * chassis.getWheelRadius())) * 360); // Рассчитываем общюю дистанцию
    // }

}

namespace motions {

    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion | AfterMotionShort) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            chassis.LinearDistMove(motions.distRollingAfterIntersection, speed, Braking.Hold);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            // chassis.RampLinearDistMove(motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection / 2, speed);
            // chassis.RampLinearDistMove(5, speed, motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection / 2);
            chassis.RampLinearDistMove(5, speed, motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection);
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            motions.RollingMoveOut(motions.distRollingAfterIntersectionMoveOut, speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(true);
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            chassis.stop(false);
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            // CHASSIS_MOTORS.steer(0, speed);
            motions.ChassisControlCommand(0, speed);
        }
    }

    // Вспомогательная функция для типа торможения движения на расстоние без торможения. Например, для съезда с линии, чтобы её не считал алгоритм движения по линии.
    export function RollingMoveOut(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно пройти
        //CHASSIS_MOTORS.steer(0, speed); // Команда вперёд
        motions.ChassisControlCommand(0, speed); // Команда вперёд
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = chassis.leftMotor.angle(), rMotEnc = chassis.rightMotor.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        // Команды для остановки не нужно, в этом и смысл функции
    }

    /**
     * Chassis motor control command.
     * Команда управления моторами шасси. Предназначена для регуляторов.
     * @param u управляющее воздействие, eg: 0
     * @param speed скорость движения, eg: 60
     */
    //% blockId="ChassisControlCommand"
    //% block="direction command u = $u| speed = $speed|\\%"
    //% block.loc.ru="команда движения по u = $u| скорость = $speed|\\%"
    //% inlineInputMode="inline"
    //% u.shadow="motorTurnRatioPicker"
    //% u.min="-200" u.max="200"
    //% speed.shadow="motorSpeedPicker"
    //% weight="99"
    //% group="Move"
    export function ChassisControlCommand(u: number, speed: number) {
        let mB = speed + u, mC = speed - u;
        // let z = speed / Math.max(Math.abs(mB), Math.abs(mC));
        // mB *= z; mC *= z;
        chassis.leftMotor.run(mB); chassis.rightMotor.run(mC);
    }

    /**
     * Moving in a direction with a constant speed to a zone with a certain reflection.
     * Движение по направлению с постоянной скоростью до зоны с определённым отражением.
     * @param dir направление движения, eg: 0
     * @param SensorSelection определение датчиками, eg: SensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Condition.Larger
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param speed скорость движения, eg: 50
     * @param actionAfterMotion действие после, eg: AfterMotion.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToRefZone"
    //% block="move in direction $dir| before determining reflection $sensorsCondition| $refCondition| $refTreshold at $speed|\\%| action after $actionAfterMotion|| debug $debug"
    //% block.loc.ru="двигаться по направлению $dir| до отражения $sensorsCondition| $refCondition| $refTreshold на $speed|\\%| действие после $actionAfterMotion|| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% debug.shadow="toggleOnOff"
    //% dir.shadow="motorTurnRatioPicker"
    //% dir.min="-100" dir.max="100"
    //% speed.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function MoveToRefZone(sensorsCondition: SensorSelection, refCondition: LogicalOperators, refTreshold: number, dir: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        // motions.ChassisControlCommand(dir, speed); // Команда двигаться по направлению и скоростью
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (sensorsCondition == SensorSelection.LeftAndRight) { // Левый и правый датчик
                if (refCondition == LogicalOperators.Greater && (refLeftLS > refTreshold && refRightLS > refTreshold)) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && (refLeftLS >= refTreshold && refRightLS >= refTreshold)) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && (refLeftLS < refTreshold && refRightLS < refTreshold)) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && (refLeftLS <= refTreshold && refRightLS <= refTreshold)) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && (refLeftLS == refTreshold && refRightLS == refTreshold)) break; // Равно
            } else if (sensorsCondition == SensorSelection.LeftOrRight) { // Левый или правый датчик
                if (refCondition == LogicalOperators.Greater && (refLeftLS > refTreshold || refRightLS > refTreshold)) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && (refLeftLS >= refTreshold || refRightLS >= refTreshold)) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && (refLeftLS < refTreshold || refRightLS < refTreshold)) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && (refLeftLS <= refTreshold || refRightLS <= refTreshold)) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && (refLeftLS == refTreshold || refRightLS == refTreshold)) break; // Равно
            } else if (sensorsCondition == SensorSelection.OnlyLeft) { // Только левый датчик
                if (refCondition == LogicalOperators.Greater && refLeftLS > refTreshold) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && refLeftLS >= refTreshold) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && refLeftLS < refTreshold) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && refLeftLS <= refTreshold) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && refLeftLS == refTreshold) break; // Равно
            } else if (sensorsCondition == SensorSelection.OnlyRight) { // Только правый датчик
                if (refCondition == LogicalOperators.Greater && refRightLS > refTreshold) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && refRightLS >= refTreshold) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && refRightLS < refTreshold) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && refRightLS <= refTreshold) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && refRightLS == refTreshold) break; // Равно
            }
            motions.ChassisControlCommand(dir, speed); // Дублирую команду двигаться по направлению и скоростью
            if (debug) { // Отладка
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, motions.lineFollowLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(277, 200); // Сигнал о завершении
        motions.ActionAfterMotion(speed, actionAfterMotion); // Действие после цикла управления
    }

}