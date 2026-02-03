namespace motions {

    let minPwrAtEndMovement = 25; // Минимальная мощность при завершении движения

    /**
     * Установить минимальную мощность при завершений движений при фазе замедления.
     * @param pwr минимальное значение мощности, eg: 20
     */
    //% blockId="SetMinPwrAtEndMovement"
    //% block="set $pwr min pwr at deceleration"
    //% block.loc.ru="установить $pwr минимальную мощность при замедлениях"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function setMinPwrAtEndMovement(pwr: number) {
        if (pwr < 0) console.log("Warning: min pwr is negative, using absolute value.");
        minPwrAtEndMovement = Math.abs(pwr);
    }

    /**
     * Получить минимальную мощность при завершений движений при фазе замедления.
     */
    //% blockId="GetMinPwrAtEndMovement"
    //% block="get min pwr at deceleration"
    //% block.loc.ru="получить минимальную мощность при замедлениях"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
    export function getMinPwrAtEndMovement() {
        return minPwrAtEndMovement;
    }

    // Функция, которая выполняет действие после цикла с движением
    export function actionAfterMotion(actionAfterMotion: AfterMotion | MotionBraking, v?: number) { // 
        if (actionAfterMotion == AfterMotion.HoldStop || actionAfterMotion == MotionBraking.Hold) { // Тормоз с жёстким торможением (удержанием)
            chassis.stop(Braking.Hold);
        } else if (actionAfterMotion == AfterMotion.FloatStop || actionAfterMotion == MotionBraking.Float) { // Тормоз с особождением мотора, т.е. прокаткой по инерции
            chassis.stop(Braking.Float);
        } else if (actionAfterMotion == AfterMotion.NoStop || actionAfterMotion == MotionBraking.Continue) { // NoStop не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            chassis.steeringCommand(0, v);
        }
    }

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
     * @param v скорость движения, eg: 50
     * @param sensorsSelection определение датчиками, eg: LineSensorSelection.LeftAndRight
     * @param refCondition отражение больше или меньше, eg: Comparison.Greater
     * @param refTreshold пороговое значение отражения света, eg: 50
     * @param actionAfterMotion действие после, eg: AfterMotion.HoldStop
     * @param debug отладка, eg: false
     */
    //% blockId="MoveToReflectionZone"
    //% block="move in direction $turnRatio at $v\\%| before determining reflection $sensorsSelection $refCondition $refTreshold|action after $actionAfterMotion||debug $debug"
    //% block.loc.ru="движение по направлению $turnRatio на $v\\%| до определения отражения $sensorsSelection $refCondition $refTreshold|действие после $actionAfterMotion||отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% debug.shadow="toggleOnOff"
    //% turnRatio.shadow="motorTurnRatioPicker"
    //% v.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function moveToReflectionZone(turnRatio: number, v: number, sensorsSelection: LineSensorSelection, refCondition: Comparison, refTreshold: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        const { speedLeft, speedRight } = chassis.getSpeedsAtSteering(turnRatio, v);
        
        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл работает пока отражение не будет больше/меньше на датчиках
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (sensorsReflectionCondition(sensorsSelection, refCondition, refTreshold, refLeftLS, refRightLS)) break; // Проверка условия выхода
            const eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            const emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, speedLeft, speedRight);
            const u = chassis.pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, speedLeft, speedRight);
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
        motions.actionAfterMotion(actionAfterMotion, v); // Действие после цикла управления
    }

    /**
     * Поворот на линию с помощью датчиков линии.
     * После поворота выполняется позиционирование на линии за 100 мсек, поэтому нужно заранее установить значения регулятора этому алгоритму.
     * @param rotateSide в какую сторону вращаться в поиске линии, eg: TurnSide.Left
     * @param v скорость вращения, eg: 50
     * @param debug отладка на экран, eg: false
    */
    //% blockId="SpinTurnToLine"
    //% block="turn to line $rotateSide at $v\\% relative to center of wheel axis||params: $params|debug $debug"
    //% block.loc.ru="поворот до линии $rotateSide на $v\\% относительно центра оси колёс||параметры: $params|отладка $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% debug.shadow="toggleOnOff"
    //% v.shadow="motorSpeedPicker"
    //% params.shadow="LinePositioningEmptyParams"
    //% weight="99"
    //% group="Поворот на линию"
    export function spinTurnToLine(rotateSide: TurnSide, v: number, params?: params.LinePositioning, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.vMax >= 0) levelings.linePositioningMaxV = Math.abs(params.vMax);
            if (params.timeOut >= 0) levelings.linePositioningTimeOut = Math.abs(params.timeOut);
            if (params.Kp >= 0) levelings.linePositioningKp = Math.abs(params.Kp);
            if (params.Ki >= 0) levelings.linePositioningKi = Math.abs(params.Ki);
            if (params.Kd >= 0) levelings.linePositioningKd = Math.abs(params.Kd);
            if (params.Kf >= 0) levelings.linePositioningKf = Math.abs(params.Kf);
        }

        if (sensors.leftLineSensor instanceof sensors.ColorSensor && sensors.rightLineSensor instanceof sensors.ColorSensor) {
            spinTurnToLineAtColorSensor(rotateSide, v, debug);
        } else if (sensors.leftLineSensor instanceof sensors.NXTLightSensor && sensors.rightLineSensor instanceof sensors.NXTLightSensor) {
            spinTurnToLineAtNxtLightSensor(rotateSide, v, debug);
        }
    }

    // Функция поворота на линию датчиком цвета ev3
    function spinTurnToLineAtColorSensor(rotateSide: TurnSide, v: number, debug: boolean = false) {
        let sensor: sensors.ColorSensor; // Инициализируем переменную сенсора
        if (rotateSide == TurnSide.Left) sensor = (sensors.leftLineSensor as sensors.ColorSensor);
        else if (rotateSide == TurnSide.Right) sensor = (sensors.rightLineSensor as sensors.ColorSensor);
        sensor.rgbRaw(); // Обращаемся к режиму датчика заранее, чтобы тот включился в нужном режиме

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        const calcMotRot = Math.round(Math.calculateRotateToEncRotate(30)); // Расчёт угла поворота моторов для поворота

        // const [vLeft, vRight] = rotateSide == TurnSide.Left ? [-v, v] : [v, -v];
        const vLeft = rotateSide == TurnSide.Left ? -v : v;
        const vRight = rotateSide == TurnSide.Left ? v : -v;

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        let preTurnIsDone = false; // Переменная - флажок о том, что предварительный поворот выполнен
        let lineIsFound = false; // Переменная - флажок о том, что чёрная линия найдена
        let prevTime = control.millis(); // Переменная предыдущего времения для цикла регулирования
        while (true) { // Поворачиваем изначально, чтобы повернуться от линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            const eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            const emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if (!preTurnIsDone && (Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) preTurnIsDone = true; // Если предвариательный поворот ещё не выполнен, то проверяем условия
            if (preTurnIsDone) { // Если предварительный поворот выполнен
                const rgbCS = sensor.rgbRaw(); // Получаем от сенсора RGB
                const hsvlCS = sensors.convertRgbToHsvl(rgbCS); // Переводим RGB в HSV
                const colorCS = sensors.convertHsvlToColorNum(hsvlCS, sensors.getHsvlToColorNumParams(sensor)); // Узнаём какой цвет
                if (!lineIsFound && colorCS == 1) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && colorCS == 6) break; // Нашли белую часть после линии
            }
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            const u = chassis.pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, vLeft, vRight);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 5); // Ожидание выполнения цикла
        }
        levelings.linePositioning(100, null, debug); // Позиционируемся на линии
    }

    // Функция поворота на лицию датчиком отражения nxt
    function spinTurnToLineAtNxtLightSensor(rotateSide: TurnSide, v: number, debug: boolean = false) {
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

        const emlPrev = chassis.leftMotor.angle(), emrPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска

        const calcMotRot = Math.round(Math.calculateRotateToEncRotate(30)); // Расчёт угла поворота моторов для поворота

        const vLeft = rotateSide == TurnSide.Left ? -v : v;
        const vRight = rotateSide == TurnSide.Left ? v : -v;

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов ПИД регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сбросить ПИД регулятор

        let preTurnIsDone = false; // Переменная - флажок о том, что предварительный поворот выполнен
        let lineIsFound = false; // Переменная - флажок о том, что чёрная линия найдена
        let prevTime = control.millis(); // Переменная предыдущего времения для цикла регулирования
        while (true) { // Поворачиваем изначально, чтобы повернуться от линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время выполнения итерации цикла
            prevTime = currTime; // Обновляем переменную предыдущего времени на текущее время для следующей итерации
            const eml = chassis.leftMotor.angle() - emlPrev; // Значение энкодера с левого мотора в текущий момент
            const emr = chassis.rightMotor.angle() - emrPrev; // Значение энкодера с правого мотора в текущий момент
            if (!preTurnIsDone && (Math.abs(eml) + Math.abs(emr)) / 2 >= Math.abs(calcMotRot)) preTurnIsDone = true; // Если предвариательный поворот ещё не выполнен, то проверяем условия
            if (preTurnIsDone) { // Если предварительный поворот выполнен
                const refLS = sensors.getNormalizedReflectionValue(sensorSide); // Нормализованное значение с датчика линии
                if (!lineIsFound && refLS <= 15) lineIsFound = true; // Ищем чёрный цвет, т.е. линию
                if (lineIsFound && refLS >= 80) break; // Нашли белую часть посли линии
            }
            const error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, vLeft, vRight);
            const u = chassis.pidChassisSync.compute(dt == 0 ? 1 : dt, -error);
            const powers = advmotctrls.getPwrSyncMotorsAtPwr(u, vLeft, vRight);
            chassis.setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1); // Ожидание выполнения цикла
        }
        levelings.linePositioning(100, null, debug); // Позиционируемся на линии
    }

}