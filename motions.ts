namespace motions {

    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion | AfterMotionShort) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            chassis.LinearDistMove(motions.distRollingAfterIntersection, speed, Braking.Hold);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            chassis.RampLinearDistMove(5, speed, motions.distRollingAfterIntersection, 0, motions.distRollingAfterIntersection);
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            motions.RollingMoveOut(motions.distRollingAfterIntersectionMoveOut, speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(true);
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            chassis.stop(false);
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            // CHASSIS_MOTORS.steer(0, speed);
            // motions.ChassisControlCommand(0, speed);
            motions.ChassisSteeringCommand(0, speed);
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
     * @param speed скорость движения, eg: 50
     */
    //% blockId="ChassisControlCommand"
    //% block="u $u movement command at $speed\\%"
    //% block.loc.ru="команда движения по u $u на $speed\\%"
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
     * Chassis steer motor control command.
     * Команда рулевого управления моторами шасси.
     * @param turnRatio рулевой параметр, если больше 0 то поворачиваем вправо, а если меньше, то влево, eg: 0
     * @param speed скорость движения, eg: 50
     */
    //% blockId="ChassisSteeringCommand"
    //% block="steering command $turnRatio at $speed\\%"
    //% block.loc.ru="команда рулевого управления $turnRatio при движении на $speed\\%"
    //% inlineInputMode="inline"
    //% turnRatio.shadow="motorTurnRatioPicker"
    //% turnRatio.min="-200" turnRatio.max="200"
    //% speed.shadow="motorSpeedPicker"
    //% weight="98"
    //% group="Move"
    export function ChassisSteeringCommand(turnRatio: number, speed: number) {
        speed = Math.clamp(-100, 100, speed >> 0);
        turnRatio = Math.floor(turnRatio);
        turnRatio = Math.clamp(-200, 200, turnRatio >> 0);
        let speedLeft = 0, speedRight = 0;
        if (turnRatio > 0) { // Вправо
            // Расчет speedLeft и speedRight для других значений turnRatio
            if (turnRatio <= 100) {
                speedLeft = speed;
                speedRight = (100 - turnRatio) * speed / 100;
                // console.log(`${turnRatio} <= 100`);
            } else if (turnRatio > 100) { // Более 100
                speedLeft = speed;
                //speedRight = Math.max(-speed, -(turnRatio - 100) * (speed / 100));
                speedRight = -(turnRatio - 100) * (speed / 100);
                //  console.log(`${turnRatio} > 100`);
            }
        } else if (turnRatio < 0) { // Влево
            if (turnRatio >= -100) { // До -100 включительно
                speedLeft = (100 + turnRatio) * speed / 100;
                speedRight = speed;
                // console.log(`${turnRatio} >= -100`);
            } else if (turnRatio < -100) { // Более -100
                //speedLeft = Math.max(-speed, (turnRatio + 100) * (speed / 100));
                speedLeft = (turnRatio + 100) * (speed / 100);
                speedRight = speed;
                // console.log(`${turnRatio} < -100`);
            }
        } else { // Если turnRatio = 0
            speedLeft = speed;
            speedRight = speed;
        }
        chassis.leftMotor.run(speedLeft); chassis.rightMotor.run(speedRight);
        // return { speedLeft, speedRight };
        // console.log(`speedLeft: ${speedLeft}, speedRight: ${speedRight}`);
    }

    /**
     * Moving in a direction with a constant speed to a zone with a certain reflection.
     * Движение по направлению с постоянной скоростью до зоны с определённым отражением.
     * @param dir направление движения, eg: 0
     * @param speed скорость движения, eg: 50
     * @param LineSensorSelection определение датчиками, eg: SensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Condition.Larger
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param actionAfterMotion действие после, eg: AfterMotion.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToRefZone"
    //% block="move in direction $turnRatio at $speed\\%| before determining reflection $sensorsCondition $refCondition $refTreshold|action after $actionAfterMotion||debug $debug"
    //% block.loc.ru="движение по направлению $turnRatio на $speed\\%| до определения отражения $sensorsCondition $refCondition $refTreshold|действие после $actionAfterMotion||отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% debug.shadow="toggleOnOff"
    //% turnRatio.shadow="motorTurnRatioPicker"
    //% turnRatio.min="-100" turnRatio.max="100"
    //% speed.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function MoveToRefZone(turnRatio: number, speed: number, sensorsCondition: LineSensorSelection, refCondition: LogicalOperators, refTreshold: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        // motions.ChassisControlCommand(turnRatio, speed); // Команда двигаться по направлению и скоростью
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refRawLeftLS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRightLS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLeftLS = sensors.GetNormRef(refRawLeftLS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormRef(refRawRightLS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
            if (sensorsCondition == LineSensorSelection.LeftAndRight) { // Левый и правый датчик
                if (refCondition == LogicalOperators.Greater && (refLeftLS > refTreshold && refRightLS > refTreshold)) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && (refLeftLS >= refTreshold && refRightLS >= refTreshold)) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && (refLeftLS < refTreshold && refRightLS < refTreshold)) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && (refLeftLS <= refTreshold && refRightLS <= refTreshold)) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && (refLeftLS == refTreshold && refRightLS == refTreshold)) break; // Равно
            } else if (sensorsCondition == LineSensorSelection.LeftOrRight) { // Левый или правый датчик
                if (refCondition == LogicalOperators.Greater && (refLeftLS > refTreshold || refRightLS > refTreshold)) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && (refLeftLS >= refTreshold || refRightLS >= refTreshold)) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && (refLeftLS < refTreshold || refRightLS < refTreshold)) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && (refLeftLS <= refTreshold || refRightLS <= refTreshold)) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && (refLeftLS == refTreshold || refRightLS == refTreshold)) break; // Равно
            } else if (sensorsCondition == LineSensorSelection.OnlyLeft) { // Только левый датчик
                if (refCondition == LogicalOperators.Greater && refLeftLS > refTreshold) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && refLeftLS >= refTreshold) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && refLeftLS < refTreshold) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && refLeftLS <= refTreshold) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && refLeftLS == refTreshold) break; // Равно
            } else if (sensorsCondition == LineSensorSelection.OnlyRight) { // Только правый датчик
                if (refCondition == LogicalOperators.Greater && refRightLS > refTreshold) break; // Больше
                else if (refCondition == LogicalOperators.GreaterOrEqual && refRightLS >= refTreshold) break; // Больше или равно
                else if (refCondition == LogicalOperators.Less && refRightLS < refTreshold) break; // Меньше
                else if (refCondition == LogicalOperators.LessOrEqual && refRightLS <= refTreshold) break; // Меньше или равно
                else if (refCondition == LogicalOperators.Equal && refRightLS == refTreshold) break; // Равно
            }
            motions.ChassisControlCommand(turnRatio, speed); // Дублирую команду двигаться по направлению и скоростью
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