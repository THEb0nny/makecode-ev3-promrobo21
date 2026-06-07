namespace motions {

    function configureLineFollowPID(Kp: number, Ki: number, Kd: number, Kf: number) {
        pidLineFollow.setGains(Kp, Ki, Kd); // Установка коэффициентов регулятора
        pidLineFollow.setDerivativeFilter(Kf); // Фильтр дифференциальной составляющей
        pidLineFollow.setControlSaturation(-200, 200); // Ограничение выхода
        pidLineFollow.setPoint(0); // Нулевая уставка
        pidLineFollow.reset(); // Сброс состояния
    }

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
            if (params.v >= 0) lineFollowCrossIntersection2SensorV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowCrossIntersection2SensorKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowCrossIntersection2SensorKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowCrossIntersection2SensorKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowCrossIntersection2SensorKf = Math.abs(params.Kf);
        }

        configureLineFollowPID(lineFollowCrossIntersection2SensorKp, lineFollowCrossIntersection2SensorKi, lineFollowCrossIntersection2SensorKd, lineFollowCrossIntersection2SensorKf); // Конфигуряция пид регулятора

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < getLineFollowRefThreshold() && refRightLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, lineFollowCrossIntersection2SensorV); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, v: lineFollowCrossIntersection2SensorV }); // Действие после алгоритма движения
    }

    function updateLineFollowSideIntersectionParams(sideIntersection: SideIntersection, params?: params.LineFollow) {
        if (!params) return;
        if (sideIntersection == SideIntersection.LeftInside || sideIntersection == SideIntersection.LeftOutside) {
            if (params.v >= 0) lineFollowLeftIntersectionV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowLeftIntersectionKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowLeftIntersectionKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowLeftIntersectionKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowLeftIntersectionKf = Math.abs(params.Kf);
        } else if (sideIntersection == SideIntersection.RightInside || sideIntersection == SideIntersection.RightOutside) {
            if (params.v >= 0) lineFollowRightIntersectionV = Math.abs(params.v);
            if (params.Kp >= 0) lineFollowRightIntersectionKp = Math.abs(params.Kp);
            if (params.Ki >= 0) lineFollowRightIntersectionKi = Math.abs(params.Ki);
            if (params.Kd >= 0) lineFollowRightIntersectionKd = Math.abs(params.Kd);
            if (params.Kf >= 0) lineFollowRightIntersectionKf = Math.abs(params.Kf);
        }
    }

    function getLineFollowSideIntersectionParams(sideIntersection: SideIntersection) {
        if (sideIntersection == SideIntersection.LeftInside || sideIntersection == SideIntersection.LeftOutside) {
            return {
                v: lineFollowLeftIntersectionV,
                Kp: lineFollowLeftIntersectionKp,
                Ki: lineFollowLeftIntersectionKi,
                Kd: lineFollowLeftIntersectionKd,
                Kf: lineFollowLeftIntersectionKf,
                lineFollowMode: LineFollowMode.RightSensor,
                detectSensor: LineSensor.Left,
                followSensor: LineSensor.Right,
                steeringSign: -1
            };
        } else if (sideIntersection == SideIntersection.RightInside || sideIntersection == SideIntersection.RightOutside) {
            return {
                v: lineFollowRightIntersectionV,
                Kp: lineFollowRightIntersectionKp,
                Ki: lineFollowRightIntersectionKi,
                Kd: lineFollowRightIntersectionKd,
                Kf: lineFollowRightIntersectionKf,
                lineFollowMode: LineFollowMode.LeftSensor,
                detectSensor: LineSensor.Right,
                followSensor: LineSensor.Left,
                steeringSign: 1
            };
        }
        control.fail("Unknown SideIntersection");
        return null;
    }

    // Функция для проверки выполнения условия для движения по линии до перекрёстка слева/справа
    function isSideIntersectionDetected(detectRef: number, error: number): boolean {
        return Math.abs(error) <= getLineFollowSingleSensorConditionMaxError() && detectRef < getLineFollowRefThreshold();
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
        updateLineFollowSideIntersectionParams(sideIntersection, params);
        const p = getLineFollowSideIntersectionParams(sideIntersection);

        configureLineFollowPID(p.Kp, p.Ki, p.Kd, p.Kf); // Конфигуряция пид регулятора

        // Подруливаем плавно к линии
        steeringUntilFindLine(p.followSensor, getSteeringAtSearchLineForLineFollowOneSensor() * p.steeringSign, p.v);
        music.playToneInBackground(587, 50); // Издаём сигнал завершения

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = getLineFollowError(p.lineFollowMode, refLeftLS, refRightLS); // Ошибка регулирования
            if (isSideIntersectionDetected(p.detectSensor == LineSensor.Left ? refLeftLS : refRightLS, error)) break; // Проверка на перекрёсток, когда робот едет по линии
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, p.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, v: p.v }); // Действие после алгоритма движения
    }

}