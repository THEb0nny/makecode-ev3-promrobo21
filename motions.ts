namespace motions {

    export let minPwrAtEndMovement = 10; // Минимальная мощность при завершении движения

    // Функция, которая выполняет действие после цикла с движением
    export function actionAfterMotion(actionAfterMotion: AfterMotion | MotionBraking, speed?: number) { // 
        if (actionAfterMotion == AfterMotion.HoldStop || actionAfterMotion == MotionBraking.Hold) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(Braking.Hold);
        } else if (actionAfterMotion == AfterMotion.FloatStop || actionAfterMotion == MotionBraking.Float) { // Тормоз с особождением мотора, т.е. прокаткой по инерции
            chassis.stop(Braking.Float);
        } else if (actionAfterMotion == AfterMotion.NoStop || actionAfterMotion == MotionBraking.Coasting) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            chassis.steeringCommand(0, speed);
        }
    }

    // Вспомогательная функция для типа торможения движения на расстоние без торможения
    // Например, для съезда с линии, чтобы её не считал алгоритм движения по линии повторно
    /*
    export function rollingMoveOutFromLine(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            chassis.stop(true);
            return;
        }

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const calcMotRot = Math.calculateDistanceToEncRotate(dist); // Дистанция в мм, которую нужно пройти
        advmotctrls.syncMotorsConfig(speed, speed);

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if ((Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) break;
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            chassis.pidChassisSync.setPoint(error);
            let U = chassis.pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла
        }
        // Команды для остановки не нужно, в этом и смысл функции
    }
    */

}

namespace motions {

    // Вспомогательная функция для проверки условия выхода MoveToRefZone
    function sensorsReflectionCondition(sensorsSelection: LineSensorSelection, refCondition: Comparison, refTreshold: number, refLeftLS: number, refRightLS: number): boolean {
        if (sensorsSelection == LineSensorSelection.LeftAndRight) { // Левый и правый датчик
            if (refCondition == Comparison.Greater && (refLeftLS > refTreshold && refRightLS > refTreshold)) return true; // Больше
            else if (refCondition == Comparison.GreaterOrEqual && (refLeftLS >= refTreshold && refRightLS >= refTreshold)) return true; // Больше или равно
            else if (refCondition == Comparison.Less && (refLeftLS < refTreshold && refRightLS < refTreshold)) return true; // Меньше
            else if (refCondition == Comparison.LessOrEqual && (refLeftLS <= refTreshold && refRightLS <= refTreshold)) return true; // Меньше или равно
            else if (refCondition == Comparison.Equal && (refLeftLS == refTreshold && refRightLS == refTreshold)) return true; // Равно
        } else if (sensorsSelection == LineSensorSelection.LeftOrRight) { // Левый или правый датчик
            if (refCondition == Comparison.Greater && (refLeftLS > refTreshold || refRightLS > refTreshold)) return true; // Больше
            else if (refCondition == Comparison.GreaterOrEqual && (refLeftLS >= refTreshold || refRightLS >= refTreshold)) return true; // Больше или равно
            else if (refCondition == Comparison.Less && (refLeftLS < refTreshold || refRightLS < refTreshold)) return true; // Меньше
            else if (refCondition == Comparison.LessOrEqual && (refLeftLS <= refTreshold || refRightLS <= refTreshold)) return true; // Меньше или равно
            else if (refCondition == Comparison.Equal && (refLeftLS == refTreshold || refRightLS == refTreshold)) return true; // Равно
        } else if (sensorsSelection == LineSensorSelection.OnlyLeft) { // Только левый датчик
            if (refCondition == Comparison.Greater && refLeftLS > refTreshold) return true; // Больше
            else if (refCondition == Comparison.GreaterOrEqual && refLeftLS >= refTreshold) return true; // Больше или равно
            else if (refCondition == Comparison.Less && refLeftLS < refTreshold) return true; // Меньше
            else if (refCondition == Comparison.LessOrEqual && refLeftLS <= refTreshold) return true; // Меньше или равно
            else if (refCondition == Comparison.Equal && refLeftLS == refTreshold) return true; // Равно
        } else if (sensorsSelection == LineSensorSelection.OnlyRight) { // Только правый датчик
            if (refCondition == Comparison.Greater && refRightLS > refTreshold) return true; // Больше
            else if (refCondition == Comparison.GreaterOrEqual && refRightLS >= refTreshold) return true; // Больше или равно
            else if (refCondition == Comparison.Less && refRightLS < refTreshold) return true; // Меньше
            else if (refCondition == Comparison.LessOrEqual && refRightLS <= refTreshold) return true; // Меньше или равно
            else if (refCondition == Comparison.Equal && refRightLS == refTreshold) return true; // Равно
        }
        return false;
    }

    /**
     * Движение по направлению с постоянной скоростью до зоны с определённым отражением.
     * @param turnRatio рулевое направление движения, eg: 0
     * @param speed скорость движения, eg: 50
     * @param sensorsSelection определение датчиками, eg: LineSensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Comparison.Greater
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param actionAfterMotion действие после, eg: AfterMotion.HoldStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToReflectionZone"
    //% block="move in direction $turnRatio at $speed\\%| before determining reflection $sensorsSelection $refCondition $refTreshold|action after $actionAfterMotion||debug $debug"
    //% block.loc.ru="движение по направлению $turnRatio на $speed\\%| до определения отражения $sensorsSelection $refCondition $refTreshold|действие после $actionAfterMotion||отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% debug.shadow="toggleOnOff"
    //% turnRatio.shadow="motorTurnRatioPicker"
    //% speed.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function moveToReflectionZone(turnRatio: number, speed: number, sensorsSelection: LineSensorSelection, refCondition: Comparison, refTreshold: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const { speedLeft, speedRight } = chassis.getSpeedsAtSteering(turnRatio, speed);
        advmotctrls.syncMotorsConfig(speedLeft, speedRight);
        
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (sensorsReflectionCondition(sensorsSelection, refCondition, refTreshold, refLeftLS, refRightLS)) break; // Проверка условия выхода
            let eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            let emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            // chassis.pidChassisSync.setPoint(error);
            let U = chassis.pidChassisSync.compute(dt, -error);
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
        motions.actionAfterMotion(actionAfterMotion, speed); // Действие после цикла управления
    }

    /**
     * Поворот на линию с помощью датчиков линии.
     * После поворота выполняется позиционирование на линии за 100 мсек, поэтому нужно заранее установить значения регулятора этому алгоритму.
     * @param rotateSide в какую сторону вращаться в поиске линии, eg: TurnSide.Left
     * @param speed скорость вращения, eg: 50
     * @param debug отладка на экран, eg: false
    */
    //% blockId="SpinTurnToLine"
    //% block="turn to line $rotateSide at $speed\\% relative to center of wheel axis||params: $params|debug $debug"
    //% block.loc.ru="поворот до линии $rotateSide на $speed\\% относительно центра оси колёс||параметры: $params|отладка $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LinePositioningEmptyParams"
    //% weight="99"
    //% group="Поворот на линию"
    export function spinTurnToLine(rotateSide: TurnSide, speed: number, params?: params.LinePositioning, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed >= 0) levelings.linePositioningMaxSpeed = Math.abs(params.maxSpeed);
            if (params.timeOut >= 0) levelings.linePositioningTimeOut = Math.abs(params.timeOut);
            if (params.Kp >= 0) levelings.linePositioningKp = params.Kp;
            if (params.Ki >= 0) levelings.linePositioningKi = params.Ki;
            if (params.Kd >= 0) levelings.linePositioningKd = params.Kd;
            if (params.Kf >= 0) levelings.linePositioningKf = params.Kf;
        }

        if (sensors.leftLineSensor instanceof sensors.ColorSensor && sensors.rightLineSensor instanceof sensors.ColorSensor) {
            spinTurnToLineAtColorSensor(rotateSide, speed, debug);
        } else if (sensors.leftLineSensor instanceof sensors.NXTLightSensor && sensors.rightLineSensor instanceof sensors.NXTLightSensor) {
            spinTurnToLineAtNxtLightSensor(rotateSide, speed, debug);
        }
    }

    // Функция поворота на линию датчиком цвета ev3
    function spinTurnToLineAtColorSensor(rotateSide: TurnSide, speed: number, debug: boolean = false) {
        let sensor: sensors.ColorSensor; // Инициализируем переменную сенсора
        if (rotateSide == TurnSide.Left) sensor = (sensors.leftLineSensor as sensors.ColorSensor);
        else if (rotateSide == TurnSide.Right) sensor = (sensors.rightLineSensor as sensors.ColorSensor);
        sensor.rgbRaw(); // Обращаемся к режиму датчика заранее, чтобы тот включился

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = Math.round(30 * chassis.getBaseLength() / chassis.getWheelDiametr()); // Расчитать градусы для поворота в градусы для мотора

        if (rotateSide == TurnSide.Left) {
            advmotctrls.syncMotorsConfig(-speed, speed);
            calcMotRot *= -1; // Умножаем на -1, чтобы вращаться влево
        } else if (rotateSide == TurnSide.Right) {
            advmotctrls.syncMotorsConfig(speed, -speed);
        }

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
                const hsvlCS = sensors.convertRgbToHsvl(rgbCS); // Переводим RGB в HSV
                const colorCS = sensors.convertHsvlToColorNum(hsvlCS, sensors.getHsvlToColorNumParams(sensor)); // Узнаём какой цвет
                if (!lineIsFound && colorCS == 1) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && colorCS == 6) break; // Нашли белую часть посли линии
            }
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            // chassis.pidChassisSync.setPoint(error);
            let U = chassis.pidChassisSync.compute(dt, -error);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 5); // Ожидание выполнения цикла
        }
        levelings.linePositioning(100, null, debug); // Позиционируемся на линии
    }

    // Функция поворота на лицию датчиком отражения nxt
    function spinTurnToLineAtNxtLightSensor(rotateSide: TurnSide, speed: number, debug: boolean = false) {
        let sensorSide: LineSensor; // Инициализируем переменную сенсора
        let sensorBlackRefRaw = 0, sensorWhiteRefRaw = 0;
        if (rotateSide == TurnSide.Left) {
            sensorSide = LineSensor.Left;
            sensorBlackRefRaw = sensors.bRefRawLeftLineSensor;
            sensorWhiteRefRaw = sensors.wRefRawLeftLineSensor;
        } else if (rotateSide == TurnSide.Right) {
            sensorSide = LineSensor.Right;
            sensorBlackRefRaw = sensors.bRefRawRightLineSensor;
            sensorWhiteRefRaw = sensors.wRefRawRightLineSensor;
        }
        sensors.getLineSensorRawRefValue(sensorSide); // Обращаемся к режиму датчика заранее, чтобы тот включился

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = Math.round(30 * chassis.getBaseLength() / chassis.getWheelDiametr()); // Расчитать градусы для поворота в градусы для мотора

        if (rotateSide == TurnSide.Left) {
            advmotctrls.syncMotorsConfig(-speed, speed);
            calcMotRot *= -1; // Умножаем на -1, чтобы вращаться влево
        } else if (rotateSide == TurnSide.Right) {
            advmotctrls.syncMotorsConfig(speed, -speed);
        }

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
                let refLS = sensors.getNormalizedReflectionValue(sensorSide); // Нормализованное значение с датчика линии
                if (!lineIsFound && refLS <= 15) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && refLS >= 80) break; // Нашли белую часть посли линии
            }
            let error = advmotctrls.getErrorSyncMotors(eml, emr);
            // chassis.pidChassisSync.setPoint(error);
            let U = chassis.pidChassisSync.compute(dt, -error);
            let powers = advmotctrls.getPwrSyncMotors(U);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла
        }
        levelings.linePositioning(100, null, debug); // Позиционируемся на линии
    }

}