namespace levelings {

    export let lineAlignmentMaxSpeed = 50; // Переменная для хранения максимальной скорости при регулировании на линии
    export let lineAlignmentTimeOut = 1500; // Переменная для хранения максимального времени выравнивания

    export let lineAlignmentLeftSideKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    export let lineAlignmentRightSideKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии правой стороны

    export let linePositioningMaxSpeed = 50; // Переменная для хранения максимальной скорости при позиционировании на линии
    export let linePositioningTimeOut = 1000; // Переменная для хранения максимального времени позиционирования

    export let linePositioningKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let linePositioningKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let linePositioningKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let linePositioningN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    let distanceBetweenLineSensors = 0; // Переменная для хранения расстояния между датчиками линии

    let lineAlignmentOrPositioningLoopDt = 10; // Переменная для хренения времени в мс для итерирования цикла

    /**
     * Set dt for adjustment cycles during alignment and positioning.
     * Установить dt для циклов регулирования при выравнивания и позиционирования.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineAlignmentOrPositioningLoopDt"
    //% block="set dt = $dt for line alignment and positioning adjustment loops"
    //% block.loc.ru="установить dt = $dt для циклов регулирования выравнивания и позиционирования на линии"
    //% inlineInputMode="inline"
    //% weight="69"
    //% group="Параметры"
    export function SetLineAlignmentOrPositioningLoopDt(dt: number) {
        lineAlignmentOrPositioningLoopDt = dt;
    }

    /**
     * Set the distance between the two line sensors in mm.
     * Установить расстояние между двумя датчиками линии в мм.
     * @param dist расстояние между датчиками в мм, eg. 31.88
     */
    //% blockId="SetDistanceBetweenLineSensors"
    //% block="set distance $dist mm between line sensors"
    //% block.loc.ru="установить расстояние между датчиками линии $dist мм"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры"
    export function SetDistanceBetweenLineSensors(dist: number) {
        distanceBetweenLineSensors = dist;
    }

    /**
     * The alignment on the line is perpendicular.
     * Выравнивание на линии перпендикулярно.
     * @param lineLocation наезжать спереди на линию или двигаться назад на линию, eg: MovementOnLine.Front
     * @param regulatorTime время дорегулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignment"
    //% block="line alignment $lineLocation at $regulatorTime ms||params: $params|debug $debug"
    //% block.loc.ru="выравнивание на линии $lineLocation за $regulatorTimeмс||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="EmptyLineAlignmentParams"
    //% weight="99"
    //% group="Линия"
    export function LineAlignment(lineLocation: VerticalLineLocation, regulatorTime: number, params?: params.LineAlignmentInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) lineAlignmentMaxSpeed = Math.abs(params.maxSpeed);
            if (params.timeOut) lineAlignmentTimeOut = Math.abs(params.timeOut);
            if (params.leftKp) lineAlignmentLeftSideKp = params.leftKp;
            if (params.leftKi) lineAlignmentLeftSideKi = params.leftKi;
            if (params.leftKd) lineAlignmentLeftSideKd = params.leftKd;
            if (params.leftN) lineAlignmentLeftSideN = params.leftN;
            if (params.rightKp) lineAlignmentRightSideKp = params.rightKp;
            if (params.rightKi) lineAlignmentRightSideKi = params.rightKi;
            if (params.rightKd) lineAlignmentRightSideKd = params.rightKd;
            if (params.rightN) lineAlignmentRightSideN = params.rightN;
        }

        automation.pid3.setGains(lineAlignmentLeftSideKp, lineAlignmentLeftSideKi, lineAlignmentLeftSideKd); // Установка значений регулятору для левой стороны
        automation.pid4.setGains(lineAlignmentRightSideKp, lineAlignmentRightSideKi, lineAlignmentRightSideKd); // Установка значений регулятору для правой стороны
        automation.pid3.setDerivativeFilter(lineAlignmentLeftSideN); // Установить фильтр дифференциального регулятора для правой стороны
        automation.pid4.setDerivativeFilter(lineAlignmentRightSideN); // Установить фильтр дифференциального регулятора для левой стороны
        automation.pid3.setControlSaturation(-100, 100); // Устанавливаем ограничения левому регулятору
        automation.pid4.setControlSaturation(-100, 100);// Устанавливаем ограничения правому регулятору
        automation.pid3.reset(); // Сброс регулятора левой стороны
        automation.pid4.reset(); // Сброс регулятора правой стороны

        control.timer7.reset(); // Сброс таймера
        const timeOut = (regulatorTime > lineAlignmentTimeOut ? regulatorTime : lineAlignmentTimeOut); // Максимальное время регулирования для защиты
        const regulatorMultiplier = (lineLocation == VerticalLineLocation.Front ? -1 : 1); // MovementOnLine.Front - линия спереди, а MovementOnLine.Backword - назад
        
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < timeOut) { // Цикл работает пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regulatorTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRef(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRef(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            let errorL = motions.lineFollowSetPoint - refLCS, errorR = motions.lineFollowSetPoint - refRCS; // Вычисляем ошибки регулирования
            if (!isOnLine && Math.abs(errorL) >= (motions.lineFollowSetPoint - 10) && Math.abs(errorL) <= (motions.lineFollowSetPoint + 10) && Math.abs(errorR) >= (motions.lineFollowSetPoint - 10) && Math.abs(errorR) <= (motions.lineFollowSetPoint + 10)) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового знначения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.playToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки (нахождения линии) достигнуто
            }
            automation.pid3.setPoint(errorL); automation.pid4.setPoint(errorR); // Передаём ошибки регуляторам
            let uL = automation.pid3.compute(dt, 0) * regulatorMultiplier; // Регулятор левой стороны
            let uR = automation.pid4.compute(dt, 0) * regulatorMultiplier; // Регулятор правой стороны
            uL = Math.constrain(uL, -lineAlignmentMaxSpeed, lineAlignmentMaxSpeed); // Ограничиваем скорость левой стороны
            uR = Math.constrain(uR, -lineAlignmentMaxSpeed, lineAlignmentMaxSpeed); // Ограничиваем скорость правой стороны
            chassis.leftMotor.run(uL); chassis.rightMotor.run(uR); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLCS", refLCS, 1);
                brick.showValue("refRCS", refRCS, 2);
                brick.showValue("errorL", errorL, 3);
                brick.showValue("errorR", errorR, 4);
                brick.showValue("uL", uL, 5);
                brick.showValue("uR", uR, 6);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        // chassis.ChassisStop(true);
        chassis.stop(true);
    }

    /**
     * Positioning (alignment) by sensors on the line.
     * Позиционирование (выравнивание) датчиками на линии.
     * @param regTime время регулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LinePositioning"
    //% block="positioning on line at $regTime ms||debug $debug"
    //% block.loc.ru="спозиционироваться на линии за время $regTime мс||отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="EmptyLineAlignmentParams"
    //% weight="98"
    //% group="Линия"
    export function LinePositioning(regTime: number, params?: params.LinePositioningInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) linePositioningMaxSpeed = Math.abs(params.maxSpeed);
            if (params.timeOut) linePositioningTimeOut = Math.abs(params.timeOut);
            if (params.Kp) linePositioningKp = params.Kp;
            if (params.Ki) linePositioningKi = params.Ki;
            if (params.Kd) linePositioningKd = params.Kd;
            if (params.N) linePositioningN = params.N;
        }

        automation.pid1.setGains(linePositioningKp, linePositioningKi, linePositioningKd); // Установка значений регулятору
        automation.pid1.setDerivativeFilter(linePositioningN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-100, 100); // Ограничение ПИДа
        automation.pid1.reset(); // Сброс ПИДа
        
        control.timer7.reset(); // Сброс таймера
        const timeOut = (regTime > linePositioningTimeOut ? regTime : linePositioningTimeOut); // Максимальное время регулирования для защиты
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < linePositioningTimeOut) { // Пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRef(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRef(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            let error = refLCS - refRCS; // Находим ошибку
            if (!isOnLine && Math.abs(error) <= (motions.lineFollowSetPoint - 10)) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового значения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.playToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки достигнуто
            }
            automation.pid1.setPoint(error); // Устанавливаем ошибку в регулятор
            let u = automation.pid1.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            u = Math.constrain(u, -linePositioningMaxSpeed, linePositioningMaxSpeed); // Ограничиваем скорость
            chassis.leftMotor.run(u); chassis.rightMotor.run(-u); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLCS", refLCS, 1);
                brick.showValue("refRCS", refRCS, 2);
                brick.showValue("error", error, 3);
                brick.showValue("u", u, 4);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        // chassis.ChassisStop(true);
        chassis.stop(true);
    }

    /**
     * Alignment on the line in motion. Experimental.
     * Выравнивание на линии в движении. Экспериментальная.
     * @param speed скорость движения, eg: 30
     * @param actionAfterMotion действие после, eg: AfterMotionShort.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignmentInMotion"
    //% block="выравниться на линии в движении на $speed|\\% c действием после $actionAfterMotion||отладка $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="97"
    //% group="Линия"
    export function LineAlignmentInMotion(speed: number, actionAfterMotion: AfterMotionShort, debug: boolean = false) {
        // https://www.youtube.com/watch?v=DOPXPuB7Xhs
        if (distanceBetweenLineSensors == 0 || speed == 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        motions.ChassisControlCommand(0, speed); // Команда двигаться вперёд
        let firstSide: string = null; // Инициализируем переменную для хранения какая сторона первой заехала на линию
        let encB1 = 0, encB2 = 0, encC1 = 0, encC2 = 0; // Инициализируем переменную хранения значения с энкодеров моторов
        let a = 0, b = distanceBetweenLineSensors, c = 0;
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        // Первая часть - датчик, который замечает линию первым
        while (true) { // В цикле ждём, чтобы один из датчиков заметил линию
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refRawLCS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRef(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRef(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            if (refLCS <= motions.lineRefTreshold) { // Левый датчик первый нашёл линию
                firstSide = "LEFT_SIDE";
                encC1 = chassis.rightMotor.angle(); // Считываем угол
                break;
            } else if (refRCS <= motions.lineRefTreshold) { // Правый датчик первый нашёл линию
                firstSide = "RIGHT_SIDE";
                encB1 = chassis.leftMotor.angle(); // Считываем угол
                break;
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём 10 мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 100); // Сигнал для понимация, что вышли из первого цикла
        prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Ждём, чтобы датчик с другой стороны нашёл линию
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let refRawLCS = sensors.GetLineSensorRawRefValue(LineSensor.Left); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.GetLineSensorRawRefValue(LineSensor.Right); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRef(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRef(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            if (firstSide == "LEFT_SIDE") {
                if (refRCS <= motions.lineRefTreshold) { // Левый датчик нашёл линию
                    encC2 = chassis.rightMotor.angle(); // Считываем угол по новой
                    a = encC2 - encC1; // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            } else if (firstSide == "RIGHT_SIDE") {
                if (refLCS <= motions.lineRefTreshold) { // Левый датчик нашёл линию
                    encB2 = chassis.leftMotor.angle(); // Считываем угол по новой
                    a = encB2 - encB1; // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            }
            control.pauseUntilTime(currTime, lineAlignmentOrPositioningLoopDt); // Ждём 10 мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 100); // Сигнал для понимация, что вышли из второго цикла
        // ChassisStop(true); // Жёсткое торможение для теста
        // pause(1000);
        a = (a / 360) * Math.PI * chassis.getWheelRadius(); // Перевести в мм пройденное значение
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // Рассчитываем гипотенузу 
        let alpha = Math.sin(a / c) * (180.0 / Math.PI); // Рассчитываем угол альфа в радианах и переводим в градусы
        //let beta = Math.asin(b / c) * (180.0 / Math.PI); // Рассчитываем угол бета в радианах и переводим в градусы
        if (firstSide == "LEFT_SIDE") chassis.pivotTurn(alpha, speed, WheelPivot.LeftWheel);
        else if (firstSide == "RIGHT_SIDE") chassis.pivotTurn(alpha, speed, WheelPivot.RightWheel);
        if (debug) { // Выводим на экран расчёты
            brick.clearScreen();
            brick.printValue("encB1", encB1, 1);
            brick.printValue("encB2", encB2, 2);
            brick.printValue("encC1", encC1, 3);
            brick.printValue("encC2", encC2, 4);
            brick.printValue("a", a, 5);
            brick.printValue("b", b, 6);
            brick.printValue("c", c, 7);
            brick.printValue("alpha", alpha, 8);
            //brick.printValue("beta", beta, 9);
        }
        music.playToneInBackground(Note.D, 250); // Сигнал для понимация завершения
        motions.ActionAfterMotion(speed, actionAfterMotion); // Действие после цикла управления
    }
    
}