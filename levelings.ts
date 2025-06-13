namespace levelings {

    export let lineAlignmentMaxSpeed = 50; // Переменная для хранения максимальной скорости при регулировании на линии
    export let lineAlignmentTimeOut = 1000; // Переменная для хранения максимального времени выравнивания

    export let lineAlignmentLeftSideKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    export let lineAlignmentRightSideKp = 0.4; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии правой стороны

    export let linePositioningMaxSpeed = 50; // Переменная для хранения максимальной скорости при позиционировании на линии
    export let linePositioningTimeOut = 1000; // Переменная для хранения максимального времени позиционирования

    export let linePositioningKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let linePositioningKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let linePositioningKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let linePositioningKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    let distanceBetweenLineSensors = 0; // Переменная для хранения расстояния между датчиками линии

    let lineAlignmentOrPositioningLoopDt = 10; // Переменная для хренения времени в мс для итерирования цикла

    const pidLeftSideLineAlignment = new automation.PIDController(); // PID регулятор для выравнивании на линии левой стороны
    const pidRightSideLineAlignment = new automation.PIDController(); // PID регулятор для выравнивании на линии правой стороны

    const pidLinePositioning = new automation.PIDController(); // PID регулятор для позиционирования на линии

    /**
     * Установить dt для циклов регулирования при выравнивания и позиционирования.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineAlignmentOrPositioningLoopDt"
    //% block="set dt = $dt for line alignment and positioning adjustment loops"
    //% block.loc.ru="установить dt = $dt для регулирования выравнивания и позиционирования на линии"
    //% inlineInputMode="inline"
    //% weight="69"
    //% group="Свойства"
    export function setLineAlignmentOrPositioningLoopDt(dt: number) {
        lineAlignmentOrPositioningLoopDt = dt;
    }

    /**
     * Установить расстояние между двумя датчиками линии в мм.
     * @param dist расстояние между датчиками в мм, eg: 32
     */
    //% blockId="SetDistanceBetweenLineSensors"
    //% block="set distance $dist mm between line sensors"
    //% block.loc.ru="установить расстояние между датчиками линии $dist мм"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства"
    export function setDistanceBetweenLineSensors(dist: number) {
        distanceBetweenLineSensors = dist;
    }

    /**
     * Выравнивание на линии перпендикулярно.
     * @param lineLocation наезжать спереди на линию или двигаться назад на линию, eg: VerticalLineLocation.Front
     * @param regulatorTime время дорегулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignment"
    //% block="line alignment $lineLocation at $regulatorTime ms||params: $params|debug $debug"
    //% block.loc.ru="выравнивание на линии $lineLocation за $regulatorTimeмс||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineAlignmentEmptyParams"
    //% weight="99"
    //% group="Линия"
    export function lineAlignment(lineLocation: VerticalLineLocation, regulatorTime: number, params?: params.LineAlignment, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed >= 0) lineAlignmentMaxSpeed = Math.abs(params.maxSpeed);
            if (params.timeOut >= 0) lineAlignmentTimeOut = Math.abs(params.timeOut);
            if (params.leftKp >= 0) lineAlignmentLeftSideKp = params.leftKp;
            if (params.leftKi >= 0) lineAlignmentLeftSideKi = params.leftKi;
            if (params.leftKd >= 0) lineAlignmentLeftSideKd = params.leftKd;
            if (params.leftKf >= 0) lineAlignmentLeftSideKf = params.leftKf;
            if (params.rightKp >= 0) lineAlignmentRightSideKp = params.rightKp;
            if (params.rightKi >= 0) lineAlignmentRightSideKi = params.rightKi;
            if (params.rightKd >= 0) lineAlignmentRightSideKd = params.rightKd;
            if (params.rightKf >= 0) lineAlignmentRightSideKf = params.rightKf;
        }

        pidLeftSideLineAlignment.setGains(lineAlignmentLeftSideKp, lineAlignmentLeftSideKi, lineAlignmentLeftSideKd); // Установка значений регулятору для левой стороны
        pidRightSideLineAlignment.setGains(lineAlignmentRightSideKp, lineAlignmentRightSideKi, lineAlignmentRightSideKd); // Установка значений регулятору для правой стороны
        pidLeftSideLineAlignment.setDerivativeFilter(lineAlignmentLeftSideKf); // Установить фильтр дифференциального регулятора для левой стороны
        pidRightSideLineAlignment.setDerivativeFilter(lineAlignmentRightSideKf); // Установить фильтр дифференциального регулятора для правой стороны
        pidLeftSideLineAlignment.setControlSaturation(-100, 100); // Устанавливаем ограничения левому регулятору
        pidRightSideLineAlignment.setControlSaturation(-100, 100);// Устанавливаем ограничения правому регулятору
        pidLeftSideLineAlignment.reset(); // Сброс регулятора левой стороны
        pidRightSideLineAlignment.reset(); // Сброс регулятора правой стороны

        control.timer7.reset(); // Сброс таймера
        const timeOut = (regulatorTime > lineAlignmentTimeOut ? regulatorTime : lineAlignmentTimeOut); // Максимальное время регулирования для защиты
        const regulatorMultiplier = (lineLocation == VerticalLineLocation.Front ? -1 : 1); // MovementOnLine.Front - линия спереди, а MovementOnLine.Backword - назад
        
        let isOnLine = false; // Переменная флажок, что робот на линии датчиками для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < timeOut) { // Цикл работает пока время не вышло
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            if (isOnLine && control.timer8.millis() >= regulatorTime) break; // Условие выхода из цикла при дорегулировании
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let errorL = motions.getLineFollowSetPoint() - refLeftLS, errorR = motions.getLineFollowSetPoint() - refRightLS; // Вычисляем ошибки регулирования
            if (!isOnLine && Math.abs(errorL) <= motions.getLineFollowSetPoint() && Math.abs(errorR) <= motions.getLineFollowSetPoint()) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового знначения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.playToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки (нахождения линии) достигнуто
            }
            pidLeftSideLineAlignment.setPoint(errorL); pidRightSideLineAlignment.setPoint(errorR); // Передаём ошибки регуляторам
            let uL = pidLeftSideLineAlignment.compute(dt, 0) * regulatorMultiplier; // Регулятор левой стороны
            let uR = pidRightSideLineAlignment.compute(dt, 0) * regulatorMultiplier; // Регулятор правой стороны
            uL = Math.constrain(uL, -lineAlignmentMaxSpeed, lineAlignmentMaxSpeed); // Ограничиваем скорость левой стороны
            uR = Math.constrain(uR, -lineAlignmentMaxSpeed, lineAlignmentMaxSpeed); // Ограничиваем скорость правой стороны
            chassis.setSpeedsCommand(uL, uR); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLeftLS", refLeftLS, 1);
                brick.showValue("refRightLS", refRightLS, 2);
                brick.showValue("errorL", errorL, 3);
                brick.showValue("errorR", errorR, 4);
                brick.showValue("uL", uL, 5);
                brick.showValue("uR", uR, 6);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        chassis.stop(Braking.Hold);
    }

    /**
     * Позиционирование (выравнивание) датчиками на линии.
     * @param regTime время регулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LinePositioning"
    //% block="positioning on line at $regTime ms||params: $params|debug $debug"
    //% block.loc.ru="спозиционироваться на линии за время $regTime мс||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LinePositioningEmptyParams"
    //% weight="98"
    //% group="Линия"
    export function linePositioning(regTime: number, params?: params.LinePositioning, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed >= 0) linePositioningMaxSpeed = Math.abs(params.maxSpeed);
            if (params.timeOut >= 0) linePositioningTimeOut = Math.abs(params.timeOut);
            if (params.Kp >= 0) linePositioningKp = params.Kp;
            if (params.Ki >= 0) linePositioningKi = params.Ki;
            if (params.Kd >= 0) linePositioningKd = params.Kd;
            if (params.Kf >= 0) linePositioningKf = params.Kf;
        }

        pidLinePositioning.setGains(linePositioningKp, linePositioningKi, linePositioningKd); // Установка значений регулятору
        pidLinePositioning.setDerivativeFilter(linePositioningKf); // Установить фильтр дифференциального регулятора
        pidLinePositioning.setControlSaturation(-100, 100); // Ограничение ПИДа
        pidLinePositioning.reset(); // Сброс ПИДа
        
        control.timer7.reset(); // Сброс таймера
        const timeOut = (regTime > linePositioningTimeOut ? regTime : linePositioningTimeOut); // Максимальное время регулирования для защиты
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < linePositioningTimeOut) { // Пока время не вышло
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            if (isOnLine && control.timer8.millis() >= regTime) break; // Условие выхода из цикла при дорегулировании
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = refLeftLS - refRightLS; // Находим ошибку
            if (!isOnLine && Math.abs(error) <= motions.getLineFollowSetPoint()) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового значения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.playToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки достигнуто
            }
            pidLinePositioning.setPoint(error); // Устанавливаем ошибку в регулятор
            let u = pidLinePositioning.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            u = Math.constrain(u, -linePositioningMaxSpeed, linePositioningMaxSpeed); // Ограничиваем скорость
            chassis.setSpeedsCommand(u, -u); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLeftLS", refLeftLS, 1);
                brick.showValue("refRightLS", refRightLS, 2);
                brick.showValue("error", error, 3);
                brick.showValue("u", u, 4);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        chassis.stop(Braking.Hold);
    }

    /**
     * Выравнивание на линии в движении.
     * Не используйте большие скорости. Поддерживается и выравнивание при движении назад.
     * @param speed скорость движения, eg: 30
     * @param actionAfterMotion действие после, eg: AfterMotion.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignmentInMotion"
    //% block="alignment on line in motion at $speed\\% after motion $actionAfterMotion||debug $debug"
    //% block.loc.ru="выравнивание на линии в движении при $speed\\% c действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="97"
    //% group="Линия"
    export function lineAlignmentInMotion(speed: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        // https://www.youtube.com/watch?v=DOPXPuB7Xhs
        if (distanceBetweenLineSensors <= 0) {
            chassis.stop(Braking.Hold);
            console.log("Error: the distance between the sensors is not set!");
            control.assert(false, 5);
        } else if (speed == 0) {
            chassis.stop(Braking.Hold);
            return;
        }
        let lMotEncPrev = chassis.leftMotor.angle(), rMotEncPrev = chassis.rightMotor.angle(); // Значения с энкодеров моторов до запуска
        let firstSide: string = null; // Инициализируем переменную для хранения какая сторона первой заехала на линию
        let encLeftMot1 = 0, encLeftMot2 = 0, encRightMot1 = 0, encRightMot2 = 0; // Инициализируем переменную хранения значения с энкодеров моторов
        let a = 0, b = distanceBetweenLineSensors, c = 0;
        chassis.regulatorSteering(0, speed); // Команда двигаться вперёд
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        // Первая часть - датчик, который замечает линию первым
        while (true) { // В цикле ждём, чтобы один из датчиков заметил линию
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS <= motions.getLineRefTreshold()) { // Левый датчик первый нашёл линию
                firstSide = "LEFT_SIDE";
                encRightMot1 = chassis.rightMotor.angle() - rMotEncPrev; // Считываем угол
                music.playToneInBackground(Note.D, 50); // Сигнал для понимация завершения
                break;
            } else if (refRightLS <= motions.getLineRefTreshold()) { // Правый датчик первый нашёл линию
                firstSide = "RIGHT_SIDE";
                encLeftMot1 = chassis.leftMotor.angle() - lMotEncPrev; // Считываем угол
                music.playToneInBackground(Note.D, 50); // Сигнал для понимация завершения
                break;
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 100); // Сигнал для понимация, что вышли из первого цикла
        prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Ждём, чтобы датчик с другой стороны нашёл линию
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            let refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (firstSide == "LEFT_SIDE") {
                if (refRightLS <= motions.getLineRefTreshold()) { // Левый датчик нашёл линию
                    encRightMot2 = chassis.rightMotor.angle() - rMotEncPrev; // Считываем угол по новой
                    a = Math.abs(encRightMot2 - encRightMot1); // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            } else if (firstSide == "RIGHT_SIDE") {
                if (refLeftLS <= motions.getLineRefTreshold()) { // Левый датчик нашёл линию
                    encLeftMot2 = chassis.leftMotor.angle() - lMotEncPrev; // Считываем угол по новой
                    a = Math.abs(encLeftMot2 - encLeftMot1); // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 100); // Сигнал для понимация, что вышли из второго цикла
        if (debug) {
            chassis.stop(Braking.Hold); // Жёсткое торможение для теста
            pause(1000);
        }
        a = (a / 360) * Math.PI * chassis.getWheelDiametr(); // Перевести в мм пройденное значение
        const alpha = Math.atan(a / b) * (180.0 / Math.PI); // Рассчитываем угол альфа в радианах и переводим в градусы
        if (firstSide == "LEFT_SIDE") chassis.pivotTurn(alpha, speed, WheelPivot.LeftWheel);
        else if (firstSide == "RIGHT_SIDE") chassis.pivotTurn(alpha, speed, WheelPivot.RightWheel);
        if (debug) { // Выводим на экран расчёты
            brick.clearScreen();
            brick.printValue("encLeftMot1", encLeftMot1, 1);
            brick.printValue("encLeftMot2", encLeftMot2, 2);
            brick.printValue("encRightMot1", encRightMot1, 3);
            brick.printValue("encRightMot2", encRightMot2, 4);
            brick.printValue("a", a, 5);
            brick.printValue("b", b, 6);
            brick.printValue("alpha", alpha, 7);
        }
        music.playToneInBackground(Note.D, 250); // Сигнал для понимация завершения
        motions.actionAfterMotion(actionAfterMotion, speed); // Действие после цикла управления
        if (debug) pause(3000);
    }
    
}