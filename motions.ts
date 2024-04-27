namespace chassis {

    /**
     * Chassis motor control command.
     * Команда управления моторами шасси.
     * @param dir направление поворота, eg: 0
     * @param speed скорость движения, eg: 80
     */
    //% blockId="ChassisControlCommand"
    //% block="движение по направлению $dir| на $speed|\\%"
    //% inlineInputMode="inline"
    //% dir.shadow="motorTurnRatioPicker"
    //% dir.min="-200" dir.max="200"
    //% speed.shadow="motorSpeedPicker"
    //% weight="99"
    //% group="Move"
    export function ChassisControlCommand(dir: number, speed: number) {
        let mB = speed + dir, mC = speed - dir;
        // let z = speed / Math.max(Math.abs(mB), Math.abs(mC));
        // mB *= z; mC *= z;
        chassis.leftMotor.run(mB); chassis.rightMotor.run(mC);
    }

    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion | AfterMotionShort) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            chassis.LinearDistMove(motions.distRollingAfterIntersection, speed, true);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            chassis.RampLinearDistMove(motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection / 2, speed);
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            chassis.RollingMoveOut(motions.distRollingAfterIntersectionMoveOut, speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(true);
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            chassis.stop(false);
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            // CHASSIS_MOTORS.steer(0, speed);
            chassis.ChassisControlCommand(0, speed);
        }
    }

    // Вспомогательная функция для типа торможения движения на расстоние без торможения. Например, для съезда с линии, чтобы её не считал алгоритм движения по линии.
    export function RollingMoveOut(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            chassis.stop(true);
            return;
        }
        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно пройти
        //CHASSIS_MOTORS.steer(0, speed); // Команда вперёд
        ChassisControlCommand(0, speed); // Команда вперёд
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
     * Linear movement over a distance in mm at a constant speed.
     * Линейное движение на расстояние в мм с постоянной скоростью.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость движения, eg: 60
     * @param setBreak тип торможения, с удержанием позиции при истине, eg: true
     */
    //% blockId="LinearDistMove"
    //% block="linear distance moving $dist| at $speed|\\%| brake $setBreak"
    //% block.loc.ru="линейное движение на расстояние $dist| на $speed|\\%| тормоз с удержанием $setBreak"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% setBreak.shadow="toggleOnOff"
    //% weight="89"
    //% group="Move"
    export function LinearDistMove(dist: number, speed: number, setBreak: boolean = true) {
        if (dist == 0 || speed == 0) {
            chassis.stop(true);
            return;
        }
        const mRotCalc = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speed, speed, mRotCalc, MoveUnit.Degrees, setBreak);
    }

    /**
     * Linear movement over a given distance with acceleration and deceleration in mm.
     * Линейное движение на заданное расстояние с ускорением и замедлением в мм.
     * @param speed скорость движения, eg: 60
     * @param totalDist общее расстояние в мм, eg: 300
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 100
     */
    //% blockId="RampLinearDistMove"
    //% block="linear distance moving $totalDist| acceleration $accelDist| deceleration $decelDist| at speed $speed|\\%"
    //% block.loc.ru="линейное движение на расстояние $totalDist| ускорения $accelDist| замедления $decelDist| со скоростью $speed|\\%"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="88"
    //% group="Move"
    export function RampLinearDistMove(speed: number, totalDist: number, accelDist: number, decelDist: number) {
        let mRotAccelCalc = (accelDist / (Math.PI * chassis.getWheelRadius())) * 360; // Расчитываем расстояние ускорения
        let mRotDecelCalc = (decelDist / (Math.PI * chassis.getWheelRadius())) * 360; // Расчитываем расстояние замедления
        let mRotTotalCalc = (totalDist / (Math.PI * chassis.getWheelRadius())) * 360; // Рассчитываем общюю дистанцию
        chassis.syncRampMovement(5, speed, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
    }

    /**
     * Moving in a direction with a constant speed to a zone with a certain reflection.
     * Движение по направлению с постоянной скоростью до зоны с определённым отражением.
     * @param dir нпарвление движения, eg: 0
     * @param SensorSelection определение датчиками, eg: SensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Condition.Larger
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param speed скорость движения, eg: 80
     * @param actionAfterMotion действие после, eg: AfterMotion.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToRefZone"
    //% block="move in direction $dir| before determining reflection $sensorsCondition|$refCondition|$refTreshold at $speed|\\%| action after $actionAfterMotion|| debug $debug"
    //% block.loc.ru="двигаться по направлению $dir| до отражения $sensorsCondition|$refCondition|$refTreshold на $speed|\\%| действие после $actionAfterMotion|| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% dir.shadow="motorTurnRatioPicker"
    //% dir.min="-100" dir.max="100"
    //% speed.shadow="motorSpeedPicker"
    //% weight="79"
    //% group="Move"
    export function MoveToRefZone(sensorsCondition: SensorSelection, refCondition: LogicalOperators, refTreshold: number, dir: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        ChassisControlCommand(dir, speed); // Команда двигаться по направлению и скоростью
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refRawLeftLS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика линии
            let refRawRightLS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика линии
            let refLeftLS = sensors.GetNormRefCS(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRefCS(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
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
                else if (refCondition == LogicalOperators.LessOrEqual || (refLeftLS <= refTreshold || refRightLS <= refTreshold)) break; // Меньше или равно
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
            ChassisControlCommand(dir, speed); // Дублирую команду двигаться по направлению и скоростью
            if (debug) { // Отладка
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, 10); // Ждём 10 мс выполнения итерации цикла
        }
        music.playToneInBackground(277, 500); // Сигнал о завершении
        ActionAfterMotion(speed, actionAfterMotion); // Действие после цикла управления
    }

}