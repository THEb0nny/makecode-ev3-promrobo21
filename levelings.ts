namespace levelings {

    export let lineAlignmentMaxSpeed = 50; // Переменная для хранения максимальной скорости при регулировании на линии

    export let lineAlignmentLeftSideKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let lineAlignmentLeftSideN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    export let lineAlignmentRightSideKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии правой стороны
    export let lineAlignmentRightSideN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии правой стороны

    export let linePositioningMaxSpeed = 50; // Переменная для хранения максимальной скорости при позиционировании на линии

    export let linePositioningKp = 1; // Переменная для хранения коэффицента пропорционального регулятора при регулировании на линии левой стороны
    export let linePositioningKi = 0; // Переменная для хранения коэффицента интегорального регулятора при регулировании на линии левой стороны
    export let linePositioningKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при регулировании на линии левой стороны
    export let linePositioningN = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при регулировании на линии левой стороны

    /**
     * Выравнивание на линии перпендикулярно.
     * @param MovementOnLine наезжать спереди на линию или двигаться назад на линию, eg: MovementOnLine.Front
     * @param regulatorTime время дорегулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignment"
    //% block="line alignment $movementOnLine|at $regulatorTime|ms|| debug $debug"
    //% block.loc.ru="выравнивание на линии $movementOnLine|за $regulatorTime|мс|| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% debug.shadow="toggleOnOff"
    //% weight="99"
    //% group="Линия"
    export function LineAlignment(lineLocation: VerticalLineLocation, regulatorTime: number, params?: custom.LineAlignmentInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) lineAlignmentMaxSpeed = Math.abs(params.maxSpeed);
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
        const timeOut = (regulatorTime > 1000 ? regulatorTime : 1000); // Максимальное время регулирования для защиты
        const regulatorMultiplier = (lineLocation == VerticalLineLocation.Front ? -1 : 1); // MovementOnLine.Front - линия спереди, а MovementOnLine.Backword - назад
        
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < timeOut) { // Цикл работает пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regulatorTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefCS(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefCS(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
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
            CHASSIS_L_MOTOR.run(uL); CHASSIS_R_MOTOR.run(uR); // Передаём управляющее воздействие на моторы
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
            control.pauseUntilTime(currTime, 10); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        // CHASSIS_MOTORS.setBrake(true);
        // CHASSIS_MOTORS.stop();
        chassis.ChassisStop(true);
    }

    /**
     * Позиционирование (выравнивание) датчиками на линии.
     * @param regTime время регулирования, eg: 500
     * @param debug отладка, eg: false
     */
    //% blockId="LinePositioning"
    //% block="positioning on line at $regTime|ms|| debug $debug"
    //% block.loc.ru="спозиционироваться на линии за время $regTime|мс|| отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% debug.shadow="toggleOnOff"
    //% weight="98"
    //% group="Линия"
    export function LinePositioning(regTime: number, params?: custom.LinePositioningInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) linePositioningMaxSpeed = Math.abs(params.maxSpeed);
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
        const MAX_TIME_REG = (regTime > 1000 ? regTime : 1000); // Максимальное время регулирования для защиты
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (control.timer7.millis() < MAX_TIME_REG) { // Пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefCS(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefCS(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            let error = refLCS - refRCS; // Находим ошибку
            if (!isOnLine && Math.abs(error) <= (motions.lineFollowSetPoint - 10)) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового значения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.playToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки достигнуто
            }
            automation.pid1.setPoint(error); // Устанавливаем ошибку в регулятор
            let u = automation.pid1.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            u = Math.constrain(u, -linePositioningMaxSpeed, linePositioningMaxSpeed); // Ограничиваем скорость
            CHASSIS_L_MOTOR.run(u); CHASSIS_R_MOTOR.run(-u); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLCS", refLCS, 1);
                brick.showValue("refRCS", refRCS, 2);
                brick.showValue("error", error, 3);
                brick.showValue("u", u, 4);
                brick.showValue("dt", dt, 12);
            }
            control.pauseUntilTime(currTime, 10); // Ждём N мс выполнения итерации цикла
        }
        music.playToneInBackground(Note.E, 250); // Сигнал о завершении
        // CHASSIS_MOTORS.setBrake(true);
        // CHASSIS_MOTORS.stop();
        chassis.ChassisStop(true);
    }

    /**
     * Выравнивание на линии в движении.
     * @param speed скорость движения, eg: 40
     * @param actionAfterMotion действие после, eg: AfterMotionShort.BreakStop
     * @param debug отладка, eg: false
     */
    //% blockId="LineAlignmentInMotion"
    //% block="выравниться на линии в движении на $speed|\\% c действием после $actionAfterMotion|| отладка $debug"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="97"
    //% group="Линия"
    export function LineAlignmentInMotion(speed: number, actionAfterMotion: AfterMotionShort, debug: boolean = false) {
        let DIST_BETWEEN_CS = 25; // Расстояние между датчиками цвета в мм
        
        chassis.ChassisControl(0, speed); // Команда двигаться вперёд
        let firstSide: string = null; // Инициализируем переменную для хранения какая сторона первой заехала на линию
        let encB1 = 0, encB2 = 0, encC1 = 0, encC2 = 0; // Инициализируем переменную хранения значения с энкодеров моторов
        let a = 0, b = DIST_BETWEEN_CS, c = 0;
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) { // В цикле ждём, чтобы один из датчиков заметил линию
            let currTime = control.millis();
            let loopTime = currTime - prevTime;
            prevTime = currTime;
            let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefCS(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefCS(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
            if (refLCS <= motions.lineRefTreshold) { // Левый датчик первый нашёл линию
                firstSide = "LEFT_SIDE";
                encC1 = CHASSIS_R_MOTOR.angle(); // Считываем угол
                break;
            } else if (refRCS <= motions.lineRefTreshold) { // Правый датчик первый нашёл линию
                firstSide = "RIGHT_SIDE";
                encB1 = CHASSIS_L_MOTOR.angle(); // Считываем угол
                break;
            }
            control.pauseUntilTime(currTime, 10); // Ждём 10 мс выполнения итерации цикла
        }
        control.runInParallel(function () { music.playTone(Note.D, 250); }); // Сигнал для понимация, что вышли из первого цикла
        prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Ждём, чтобы датчик с другой стороны нашёл линию
            let currTime = control.millis();
            let loopTime = currTime - prevTime;
            prevTime = currTime;
            if (firstSide == "LEFT_SIDE") {
                let refRawRCS = sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
                let refRCS = sensors.GetNormRefCS(refRawRCS, sensors.bRefRawRightLineSensor, sensors.wRefRawRightLineSensor); // Нормализованное значение с правого датчика цвета
                if (refRCS <= motions.lineRefTreshold) { // Левый датчик нашёл линию
                    encC2 = CHASSIS_R_MOTOR.angle(); // Считываем угол по новой
                    a = encC2 - encC1; // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            } else if (firstSide == "RIGHT_SIDE") {
                let refRawLCS = sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
                let refLCS = sensors.GetNormRefCS(refRawLCS, sensors.bRefRawLeftLineSensor, sensors.wRefRawLeftLineSensor); // Нормализованное значение с левого датчика цвета
                if (refLCS <= motions.lineRefTreshold) { // Левый датчик нашёл линию
                    encB2 = CHASSIS_L_MOTOR.angle(); // Считываем угол по новой
                    a = encB2 - encB1; // Рассчитываем длину стороны a в тиках энкодера
                    break;
                }
            }
            control.pauseUntilTime(currTime, 10); // Ждём 10 мс выполнения итерации цикла
        }
        control.runInParallel(function () { music.playTone(Note.D, 250); }); // Сигнал для понимация, что вышли из цикла
        //ChassisStop(true); // Жёсткое торможение для теста
        //pause(1000);
        a = (a / 360) * Math.PI * WHEELS_D; // Перевести в мм пройденное значение
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // Рассчитываем гипотенузу 
        let alpha = Math.sin(a / c) * (180.0 / Math.PI); // Рассчитываем угол альфа в радианах и переводим в градусы
        //let beta = Math.asin(b / c) * (180.0 / Math.PI); // Рассчитываем угол бета в радианах и переводим в градусы
        if (firstSide == "LEFT_SIDE") chassis.PivotTurn(alpha, speed, WheelPivot.LeftWheel);
        else if (firstSide == "RIGHT_SIDE") chassis.PivotTurn(alpha, speed, WheelPivot.RightWheel);
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
        control.runInParallel(function () { music.playTone(Note.D, 500); }); // Сигнал для понимация
        chassis.ActionAfterMotion(speed, actionAfterMotion); // Действие после цикла управления
    }
    
}