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
     * @param regulatorTime время дорегулирования, eg: 200
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
    export function LineAlignment(movementOnLine: MovementOnLine, regulatorTime: number, params?: automation.LineAlignmentInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) lineAlignmentMaxSpeed = params.maxSpeed;
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
        const regulatorMultiplier = (movementOnLine == MovementOnLine.Front ? -1 : 1); // MovementOnLine.Front - линия спереди, а MovementOnLine.Backword - назад
        
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (control.timer7.millis() < timeOut) { // Цикл работает пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regulatorTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = L_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let errorL = LW_SET_POINT - refLCS, errorR = LW_SET_POINT - refRCS; // Вычисляем ошибки регулирования
            if (!isOnLine && Math.abs(errorL) <= (LW_SET_POINT - 10) && Math.abs(errorR) <= (LW_SET_POINT - 10)) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового знначения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.PlayToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки (нахождения линии) достигнуто
            }
            automation.pid3.setPoint(errorL); automation.pid4.setPoint(errorR); // Передаём ошибки регуляторам
            let uL = automation.pid3.compute(dt, 0) * regulatorMultiplier; // Регулятор левой стороны
            let uR = automation.pid4.compute(dt, 0) * regulatorMultiplier; // Регулятор правой стороны
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
            control.PauseUntilTime(currTime, 10); // Ждём N мс выполнения итерации цикла
        }
        music.PlayToneInBackground(Note.E, 250); // Сигнал о завершении
        // CHASSIS_MOTORS.setBrake(true);
        // CHASSIS_MOTORS.stop();
        chassis.ChassisStop(true);
    }

    /**
     * Позиционирование (выравнивание) датчиками между линией.
     * @param regTime время регулирования, eg: 100
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
    export function LinePositioning(regTime: number, params?: automation.LinePositioningInterface, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.maxSpeed) linePositioningMaxSpeed = params.maxSpeed;
            if (params.Kp) linePositioningKp = params.Kp;
            if (params.Ki) linePositioningKi = params.Ki;
            if (params.Kd) linePositioningKd = params.Kd;
            if (params.N) linePositioningN = params.N;
        }

        automation.pid1.setGains(linePositioningKp, linePositioningKi, linePositioningKd); // Установка значений регулятору
        automation.pid3.setDerivativeFilter(linePositioningN); // Установить фильтр дифференциального регулятора
        automation.pid1.setControlSaturation(-100, 100); // Ограничение ПИДа
        automation.pid1.reset(); // Сброс ПИДа
        
        control.timer7.reset(); // Сброс таймера
        const MAX_TIME_REG = (regTime > 1000 ? regTime : 1000); // Максимальное время регулирования для защиты
        let isOnLine = false; // Переменная флажок для включения даймера дорегулирования
        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (control.timer7.millis() < MAX_TIME_REG) { // Пока время не вышло
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            if (isOnLine && control.timer8.millis() >= regTime) break; // Условие выхода из цикла при дорегулировании
            let refRawLCS = L_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с левого датчика цвета
            let refRawRCS = R_COLOR_SEN.light(LightIntensityMode.ReflectedRaw); // Сырое значение с правого датчика цвета
            let refLCS = sensors.GetNormRefValCS(refRawLCS, B_REF_RAW_LCS, W_REF_RAW_LCS); // Нормализованное значение с левого датчика цвета
            let refRCS = sensors.GetNormRefValCS(refRawRCS, B_REF_RAW_RCS, W_REF_RAW_RCS); // Нормализованное значение с правого датчика цвета
            let error = refLCS - refRCS; // Находим ошибку
            if (!isOnLine && Math.abs(error) <= (LW_SET_POINT - 10)) { // Включаем таймер дорегулирования при достежении ошибки меньше порогового знначения
                isOnLine = true; // Переменная флажок, о начале дорегулирования
                control.timer8.reset(); // Сброс таймера дорегулирования
                music.PlayToneInBackground(294, 100); // Сигнал о том, что пороговое значение ошибки достигнуто
            }
            automation.pid1.setPoint(error); // Устанавливаем ошибку в регулятор
            let u = automation.pid1.compute(dt, 0); // Вычисляем и записываем значение с регулятора
            CHASSIS_L_MOTOR.run(u); CHASSIS_R_MOTOR.run(-u); // Передаём управляющее воздействие на моторы
            if (debug) { // Отладка
                brick.clearScreen();
                brick.showValue("refLCS", refLCS, 1);
                brick.showValue("refRCS", refRCS, 2);
                brick.showValue("error", error, 3);
                brick.showValue("u", u, 4);
                brick.showValue("dt", dt, 12);
            }
            control.PauseUntilTime(currTime, 10); // Ждём N мс выполнения итерации цикла
        }
        music.PlayToneInBackground(Note.E, 100); // Сигнал о завершении
        // CHASSIS_MOTORS.setBrake(true);
        // CHASSIS_MOTORS.stop();
        chassis.ChassisStop(true);
    }
    
}