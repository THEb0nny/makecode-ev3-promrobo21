namespace motions {

    // Функция, которая выполняет действие после цикла с движением
    export function ActionAfterMotion(speed: number, actionAfterMotion: AfterMotion | AfterMotionShort) {
        if (actionAfterMotion == AfterMotion.Rolling) { // Прокатка после определния перекрёстка
            chassis.LinearDistMove(motions.GetDistRollingAfterIntersection(), speed, Braking.Hold);
        } else if (actionAfterMotion == AfterMotion.DecelRolling) { // Прокатка с мягким торможением после определния перекрёстка
            chassis.RampLinearDistMove(10, speed, motions.GetDistRollingAfterIntersection(), 0, motions.GetDistRollingAfterIntersection());
        } else if (actionAfterMotion == AfterMotion.RollingNoStop) { // Команда прокатка на расстояние, но без торможения, нужна для съезда с перекрёстка
            motions.RollingMoveOutFromLine(motions.GetDistRollinFromLineAfterIntersection(), speed);
        } else if (actionAfterMotion == AfterMotion.BreakStop) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(true);
        } else if (actionAfterMotion == AfterMotion.NoBreakStop) { // Тормоз с прокаткой по инерции
            chassis.stop(false);
        } else if (actionAfterMotion == AfterMotion.NoStop) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            // CHASSIS_MOTORS.steer(0, speed);
            chassis.steeringCommand(0, speed);
        }
    }
    
    // Вспомогательная функция для типа торможения движения на расстоние без торможения
    // Например, для съезда с линии, чтобы её не считал алгоритм движения по линии повторно
    export function RollingMoveOutFromLine(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            chassis.stop(true);
            return;
        }
        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = math.CalculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно пройти
        //CHASSIS_MOTORS.steer(0, speed); // Команда вперёд
        chassis.steeringCommand(0, speed); // Команда вперёд
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let lMotEnc = chassis.leftMotor.angle() - lMotEncPrev, rMotEnc = chassis.rightMotor.angle() - rMotEncPrev; // Значения с энкодеров моторы
            if (Math.abs(lMotEnc) >= Math.abs(calcMotRot) || Math.abs(rMotEnc) >= Math.abs(calcMotRot)) break;
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла
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
    //% speed.shadow="motorSpeedPicker"
    //% weight="99"
    //% group="Move"
    export function ChassisControlCommand(u: number, speed: number) {
        let mB = speed + u, mC = speed - u;
        // let z = speed / Math.max(Math.abs(mB), Math.abs(mC));
        // mB *= z; mC *= z;
        chassis.setSpeedsCommand(mB, mC);
    }

}

namespace motions {

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
    //% speed.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function MoveToRefZone(turnRatio: number, speed: number, sensorsCondition: LineSensorSelection, refCondition: LogicalOperators, refTreshold: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        const emlPrev = chassis.leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        const emrPrev = chassis.rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        
        const { speedLeft, speedRight } = chassis.getMotorsSpeedsAtSteering(turnRatio, speed);
        advmotctrls.syncMotorsConfig(speedLeft, speedRight);
        
        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.GetNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.GetNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
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
            let eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            if (debug) { // Отладка
                brick.clearScreen(); // Очистка экрана
                brick.printValue("refLeftLS", refLeftLS, 1);
                brick.printValue("refRightLS", refRightLS, 2);
                brick.printValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, 1); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(277, 200); // Сигнал о завершении
        motions.ActionAfterMotion(speed, actionAfterMotion); // Действие после цикла управления
    }

    /**
     * Поворот на линию.
     * @param rotateSide в какую сторону вращаться в поиске линии, eg: TurnRotateSide.Left
     * @param speed скорость вращения, eg: 40
     * @param debug отладка на экран, eg: false
    */
    //% blockId="SpinTurnToLine"
    //% block="turn to line $rotateSide at $speed\\% relative to center of wheel axis||debug $debug"
    //% block.loc.ru="поворот до линии $rotateSide на $speed\\% относительно центра оси колёс||отдалка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Поворот на линию"
    export function SpinTurnToLine(rotateSide: TurnRotateSide, speed: number, debug: boolean = false) {
        if (sensors.leftLineSensor instanceof sensors.ColorSensor && sensors.rightLineSensor instanceof sensors.ColorSensor) {
            SpinTurnToLineAtColorSensor(rotateSide, speed, debug);
        } else if (sensors.leftLineSensor instanceof sensors.NXTLightSensor && sensors.rightLineSensor instanceof sensors.NXTLightSensor) {
            SpinTurnToLineAtNxtLightSensor(rotateSide, speed, debug);
        }
    }

    // Функция поворота на линию датчиком цвета ev3
    function SpinTurnToLineAtColorSensor(rotateSide: TurnRotateSide, speed: number, debug: boolean = false) {
        let sensor: sensors.ColorSensor; // Инициализируем переменную сенсора
        if (rotateSide == TurnRotateSide.Left) sensor = (sensors.leftLineSensor as sensors.ColorSensor);
        else if (rotateSide == TurnRotateSide.Right) sensor = (sensors.rightLineSensor as sensors.ColorSensor);
        sensor.rgbRaw(); // Обращаемся к режиму датчика заранее, чтобы тот включился

        const emlPrev = chassis.leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        const emrPrev = chassis.rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        let calcMotRot = Math.round(30 * chassis.getBaseLength() / chassis.getWheelDiametr()); // Расчитать градусы для поворота в градусы для мотора

        if (rotateSide == TurnRotateSide.Left) {
            advmotctrls.syncMotorsConfig(-speed, speed);
            calcMotRot *= -1; // Умножаем на -1, чтобы вращаться влево
        } else if (rotateSide == TurnRotateSide.Right) {
            advmotctrls.syncMotorsConfig(speed, -speed);
        }

        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор

        let preTurnIsDone = false; // Переменная - флажок о том, что предварительный поворот выполнен
        let lineIsFound = false; // Переменная - флажок о том, что чёрная линия найдена
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Поворачиваем изначально, чтобы повернуться от линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            let eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if (!preTurnIsDone && (Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) preTurnIsDone = true; // Если предвариательный поворот ещё не выполнен, то проверяем условия
            if (preTurnIsDone) { // Если предварительный поворот выполнен
                const rgbCS = sensor.rgbRaw(); // Получаем от сенсора RGB
                const hsvlCS = sensors.RgbToHsvlConverter(rgbCS); // Переводим RGB в HSV
                const colorCS = sensors.HsvlToColorNum(hsvlCS, sensors.HsvlToColorNumParams(50, 10, 1, 25, 30, 100, 180, 260)); // Узнаём какой цвет
                if (!lineIsFound && colorCS == 1) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && colorCS == 6) break; // Нашли белую часть посли линии
            }
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 5); // Ожидание выполнения цикла
        }
        levelings.LinePositioning(100, null, debug); // Позиционируемся на линии
    }

    // Функция поворота на лицию датчиком отражения nxt
    function SpinTurnToLineAtNxtLightSensor(rotateSide: TurnRotateSide, speed: number, debug: boolean = false) {
        let sensorSide: LineSensor; // Инициализируем переменную сенсора
        let sensorBlackRefRaw = 0, sensorWhiteRefRaw = 0;
        if (rotateSide == TurnRotateSide.Left) {
            sensorSide = LineSensor.Left;
            sensorBlackRefRaw = sensors.bRefRawLeftLineSensor;
            sensorWhiteRefRaw = sensors.wRefRawLeftLineSensor;
        } else if (rotateSide == TurnRotateSide.Right) {
            sensorSide = LineSensor.Right;
            sensorBlackRefRaw = sensors.bRefRawRightLineSensor;
            sensorWhiteRefRaw = sensors.wRefRawRightLineSensor;
        }
        sensors.GetLineSensorRawRefValue(sensorSide); // Обращаемся к режиму датчика заранее, чтобы тот включился

        const emlPrev = chassis.leftMotor.angle(); // Считываем значение с энкодера левого мотора перед стартом алгаритма
        const emrPrev = chassis.rightMotor.angle(); //Считываем значение с энкодера правого мотора перед стартом алгаритма
        let calcMotRot = Math.round(30 * chassis.getBaseLength() / chassis.getWheelDiametr()); // Расчитать градусы для поворота в градусы для мотора

        if (rotateSide == TurnRotateSide.Left) {
            advmotctrls.syncMotorsConfig(-speed, speed);
            calcMotRot *= -1; // Умножаем на -1, чтобы вращаться влево
        } else if (rotateSide == TurnRotateSide.Right) {
            advmotctrls.syncMotorsConfig(speed, -speed);
        }

        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор

        let preTurnIsDone = false; // Переменная - флажок о том, что предварительный поворот выполнен
        let lineIsFound = false; // Переменная - флажок о том, что чёрная линия найдена
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Поворачиваем изначально, чтобы повернуться от линии
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            let eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if (!preTurnIsDone && (Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) preTurnIsDone = true; // Если предвариательный поворот ещё не выполнен, то проверяем условия
            if (preTurnIsDone) { // Если предварительный поворот выполнен
                let refLS = sensors.GetNormalizedReflectionValue(sensorSide); // Нормализованное значение с датчика линии
                if (!lineIsFound && refLS <= 15) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && refLS >= 80) break; // Нашли белую часть посли линии
            }
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла
        }
        levelings.LinePositioning(100, null, debug); // Позиционируемся на линии
    }

}