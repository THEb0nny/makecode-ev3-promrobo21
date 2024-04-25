namespace chassis {

    /**
     * Управление моторами шасси.
     * @param dir направление поворота, eg: 0
     * @param speed скорость движения, eg: 80
     */
    //% blockId="ChassisControl"
    //% block="движение по направлению $dir| на $speed|\\%"
    //% inlineInputMode="inline"
    //% dir.shadow="motorTurnRatioPicker"
    //% dir.min="-200" dir.max="200"
    //% speed.shadow="motorSpeedPicker"
    //% weight="99"
    //% group="Move"
    export function ChassisControl(dir: number, speed: number) {
        // let mB = speed + dir, mC = speed - dir;
        // let z = speed / Math.max(Math.abs(mB), Math.abs(mC));
        // mB *= z; mC *= z;
        const mB = speed + dir, mC = speed - dir;
        chassis.leftMotor.run(mB); chassis.rightMotor.run(mC);
    }

    /**
     * Остановить моторы шасси.
     * @param setBreak жёсткое торможение или торможение по инерции, eg: true
     */
    //% blockId="ChassisStop"
    //% block="остановить моторы c жёстким тормозом $setBreak"
    //% inlineInputMode="inline"
    //% setBreak.shadow="toggleOnOff"
    //% weight="98"
    //% group="Move"
    export function ChassisStop(setBreak: boolean) {
        chassis.leftMotor.setPauseOnRun(false); chassis.rightMotor.setPauseOnRun(false); // Отключаем у моторов ожидание выполнения
        chassis.leftMotor.setBrake(setBreak); chassis.rightMotor.setBrake(setBreak);
        chassis.leftMotor.stop(); chassis.rightMotor.stop();
        chassis.leftMotor.setPauseOnRun(true); chassis.rightMotor.setPauseOnRun(true); // Включаем обратно у моторов ожидание выполнения ???
    }

    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion | AfterMotionShort) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            chassis.DistMove(motions.distRollingAfterIntersection, speed, true);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            chassis.RampDistMove(motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection / 2, speed);
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            chassis.RollingMoveOut(motions.distRollingAfterIntersectionMoveOut, speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением
            // CHASSIS_MOTORS.setBrake(true);
            // CHASSIS_MOTORS.stop();
            chassis.ChassisStop(true);
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            // CHASSIS_MOTORS.setBrake(false);
            // CHASSIS_MOTORS.stop();
            chassis.ChassisStop(false);
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            // CHASSIS_MOTORS.steer(0, speed);
            chassis.ChassisControl(0, speed);
        }
    }

    // Вспомогательная функция для типа торможения движения на расстоние без торможения. Например, для съезда с линии, чтобы её не считал алгоритм движения по линии.
    export function RollingMoveOut(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            //CHASSIS_MOTORS.stop();
            ChassisStop(true);
            return;
        }
        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Дистанция в мм, которую нужно пройти
        //CHASSIS_MOTORS.steer(0, speed); // Команда вперёд
        ChassisControl(0, speed);

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
     * Движение на расстояние в мм.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость движения, eg: 60
     * @param setBreak тип торможения, с удержанием позиции при истине, eg: true
     */
    //% blockId="DistMove"
    //% block="движение на расстояние $dist|на $speed|\\% жёсткий тормоз $setBreak"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% setBreak.shadow="toggleOnOff"
    //% weight="89"
    //% group="Move"
    export function DistMove(dist: number, speed: number, setBreak: boolean = true) {
        if (dist == 0 || speed == 0) {
            //CHASSIS_MOTORS.stop();
            ChassisStop(true);
            return;
        }
        
        // CHASSIS_MOTORS.setBrake(setBreak); // Удерживать при тормозе
        // let mRotCalc = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Подсчёт по формуле
        // CHASSIS_MOTORS.tank(speed, speed, mRotCalc, MoveUnit.Degrees); // Передаём команду моторам
        // chassis.leftMotor.pauseUntilReady(); chassis.rightMotor.pauseUntilReady(); // Ждём выполнения моторами команды
        // chassis.leftMotor.setBrake(setBreak); chassis.rightMotor.setBrake(setBreak); // Установить жёсткий тип торможения
        // const mRotCalc = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Расчёт угла поворота на дистанцию
        // chassis.leftMotor.setPauseOnRun(false); chassis.rightMotor.setPauseOnRun(false); // Отключаем у моторов ожидание выполнения
        // chassis.leftMotor.run(speed, mRotCalc, MoveUnit.Degrees); chassis.rightMotor.run(speed, mRotCalc, MoveUnit.Degrees); // Передаём команды движения на моторы
        // chassis.leftMotor.pauseUntilReady(); chassis.rightMotor.pauseUntilReady(); // Ждём выполнения моторами команды
        // chassis.leftMotor.setPauseOnRun(true); chassis.rightMotor.setPauseOnRun(true); // Включаем обратно у моторов ожидание выполнения ???

        const mRotCalc = (dist / (Math.PI * chassis.getWheelRadius())) * 360; // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speed, speed, mRotCalc, MoveUnit.Degrees);
    }

    /**
     * Движение на заданное расстояние с ускорением и замедлением в мм.
     * @param totalDist общее расстояние в мм, eg: 150
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 100
     * @param speed скорость движения, eg: 60
     */
    //% blockId="RampDistMove"
    //% block="движение на расстояние $totalDist|c расстоянием ускорения $accelDist| замедления $decelDist| со скоростью $speed|\\%"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="88"
    //% group="Move"
    export function RampDistMove(totalDist: number, accelDist: number, decelDist: number, speed: number) {
        // chassis.leftMotor.pauseUntilReady(); chassis.rightMotor.pauseUntilReady(); // Ждём выполнения моторами команды ???????
        // chassis.leftMotor.setBrake(true); chassis.rightMotor.setBrake(true); // Установить торможение с удержанием
        // let mRotAccelCalc = (accelDist == 0 ? 0 : Math.round((accelDist / (Math.PI * chassis.getWheelRadius())) * 360)); // Расчитываем расстояние ускорения
        // let mRotDecelCalc = (decelDist == 0 ? 0 : Math.round((decelDist / (Math.PI * chassis.getWheelRadius())) * 360)); // Расчитываем расстояние замедления
        // let mRotNormCalc = Math.round((totalDist / (Math.PI * chassis.getWheelRadius())) * 360) - mRotAccelCalc - mRotDecelCalc; // Рассчитываем общюю дистанцию
        // chassis.leftMotor.setPauseOnRun(false); chassis.rightMotor.setPauseOnRun(false); // Отключаем у моторов ожидание выполнения
        // // Передаём команды движения на моторы
        // chassis.leftMotor.ramp(speed, mRotNormCalc, MoveUnit.Degrees, mRotAccelCalc, mRotDecelCalc);
        // chassis.rightMotor.ramp(speed, mRotNormCalc, MoveUnit.Degrees, mRotAccelCalc, mRotDecelCalc);
        // chassis.leftMotor.pauseUntilReady(); chassis.rightMotor.pauseUntilReady(); // Ждём выполнения моторами команды
        // chassis.leftMotor.setPauseOnRun(true); chassis.rightMotor.setPauseOnRun(true); // Включаем обратно у моторов ожидание выполнения ???
        
        let mRotAccelCalc = (accelDist == 0 ? 0 : Math.round((accelDist / (Math.PI * chassis.getWheelRadius())) * 360)); // Расчитываем расстояние ускорения
        let mRotDecelCalc = (decelDist == 0 ? 0 : Math.round((decelDist / (Math.PI * chassis.getWheelRadius())) * 360)); // Расчитываем расстояние замедления
        // let mRotNormCalc = Math.round((totalDist / (Math.PI * chassis.getWheelRadius())) * 360) - mRotAccelCalc - mRotDecelCalc; // Рассчитываем общюю дистанцию
        chassis.syncRampMovement(5, speed, mRotAccelCalc, mRotDecelCalc, totalDist);
    }

    /**
     * Движение вперёд до зоны с определённым отражением.
     * @param SensorSelection определение датчиками, eg: SensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Condition.Larger
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param dir нпарвление движения, eg: 0
     * @param speed скорость движения, eg: 80
     * @param actionAfterMotion действие после, eg: AfterMotion.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToRefZone"
    //% block="move in direction $dir| before determining reflection $sensorsCondition|$refCondition|$refTreshold at $speed|\\% action after $actionAfterMotion|| debug $debug"
    //% block.loc.ru="двигаться по направлению $dir| до отражения $sensorsCondition|$refCondition|$refTreshold на $speed|\\% действие после $actionAfterMotion|| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% dir.shadow="motorTurnRatioPicker"
    //% dir.min="-100" dir.max="100"
    //% speed.shadow="motorSpeedPicker"
    //% weight="79"
    //% group="Move"
    export function MoveToRefZone(sensorsCondition: SensorSelection, refCondition: LogicalOperators, refTreshold: number, dir: number, speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        ChassisControl(dir, speed); // Команда двигаться по направлению и скоростью
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
                if (refCondition == LogicalOperators.Greater) { // Больше
                    if (refLeftLS > refTreshold && refRightLS > refTreshold) break;
                } else if (refCondition == LogicalOperators.GreaterOrEqual) { // Больше или равно
                    if (refLeftLS >= refTreshold && refRightLS >= refTreshold) break;
                } else if (refCondition == LogicalOperators.Less) { // Меньше
                    if (refLeftLS < refTreshold && refRightLS < refTreshold) break;
                } else if (refCondition == LogicalOperators.LessOrEqual) { // Меньше или равно
                    if (refLeftLS <= refTreshold && refRightLS <= refTreshold) break;
                } else if (refCondition == LogicalOperators.Equal) { // Равно
                    if (refLeftLS == refTreshold && refRightLS == refTreshold) break;
                }
            } else if (sensorsCondition == SensorSelection.LeftOrRight) { // Левый или правый датчик
                if (refCondition == LogicalOperators.Greater) { // Больше
                    if (refLeftLS > refTreshold || refRightLS > refTreshold) break;
                } else if (refCondition == LogicalOperators.GreaterOrEqual) { // Больше или равно
                    if (refLeftLS >= refTreshold || refRightLS >= refTreshold) break;
                } else if (refCondition == LogicalOperators.Less) { // Меньше
                    if (refLeftLS < refTreshold || refRightLS < refTreshold) break;
                } else if (refCondition == LogicalOperators.LessOrEqual) { // Меньше или равно
                    if (refLeftLS <= refTreshold || refRightLS <= refTreshold) break;
                } if (refCondition == LogicalOperators.Equal) { // Равно
                    if (refLeftLS == refTreshold || refRightLS == refTreshold) break;
                }
            } else if (sensorsCondition == SensorSelection.OnlyLeft) { // Только левый датчик
                if (refCondition == LogicalOperators.Greater) { // Больше
                    if (refLeftLS > refTreshold) break;
                } else if (refCondition == LogicalOperators.GreaterOrEqual) { // Больше или равно
                    if (refLeftLS >= refTreshold) break;
                } else if (refCondition == LogicalOperators.Less) { // Меньше
                    if (refLeftLS < refTreshold) break;
                } else if (refCondition == LogicalOperators.LessOrEqual) { // Меньше или равно
                    if (refLeftLS <= refTreshold) break;
                } else if (refCondition == LogicalOperators.Equal) { // Равно
                    if (refLeftLS == refTreshold) break;
                }
            } else if (sensorsCondition == SensorSelection.OnlyRight) { // Только правый датчик
                if (refCondition == LogicalOperators.Greater) { // Больше
                    if (refRightLS > refTreshold) break;
                } else if (refCondition == LogicalOperators.GreaterOrEqual) { // Больше или равно
                    if (refRightLS >= refTreshold) break;
                } else if (refCondition == LogicalOperators.Less) { // Меньше
                    if (refRightLS < refTreshold) break;
                } else if (refCondition == LogicalOperators.LessOrEqual) { // Меньше или равно
                    if (refRightLS <= refTreshold) break;
                } else if (refCondition == LogicalOperators.Equal) { // Равно
                    if (refRightLS == refTreshold) break;
                }
            }
            ChassisControl(dir, speed); // Дублирую команду двигаться по направлению и скоростью
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