//let CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
let CHASSIS_L_MOTOR = motors.mediumB; // Ссылка на объект левого мотора в шасси
let CHASSIS_R_MOTOR = motors.mediumC; // Ссылка на объект правого мотора в шасси

let MANIPULATOR_MOTOR1: motors.Motor = motors.mediumA; // Ссылка на объект мотора манипулятора
let MANIPULATOR_MOTOR2: motors.Motor = motors.mediumD; // Ссылка на объект мотора манипулятора

let L_COLOR_SEN = sensors.color2; // Ссылка на объект левого датчика цвета
let R_COLOR_SEN = sensors.color3; // Ссылка на объект правого датчика цвета
let CHECK_COLOR_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let WHEELS_D = 62.4; // Диаметр колёс в мм
let WHEELS_W = 180; // Расстояние между центрами колёс в мм

let LW_CONDITION_MAX_ERR = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

let ENC_TURN_MAX_ERR_DIFFERENCE = 10; // Пороговое значения ошибки для регулятора умного поворота, что поворот выполнен
let ENC_TURN_MAX_REG_DIFFERENCE = 10; // Пороговое значение регулятора для определения умного поворота
let ENC_TURN_TIME_DEREG = 150; // Время дорегулирования в умном повороте

let ENC_SPIN_TURN_OUT_TIME = 800; // Максимальное время умного поворота относительно центра в мм
let ENC_PIVOT_TURN_OUT_TIME = 1000; // Максимальное время умного поворота относительно колеса в мм

function RgbToHsvlToColorConvert(debug: boolean = false) {
    let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
    while (true) {
        let currTime = control.millis(); // Текущее время
        prevTime = currTime; // Новое время в переменную предыдущего времени
        let rgbCS = CHECK_COLOR_CS.rgbRaw();
        for (let i = 0; i < 3; i++) {
            rgbCS[i] = Math.map(rgbCS[i], 0, sensors.maxRgbColorSensor4[i], 0, 255);
            rgbCS[i] = Math.constrain(rgbCS[i], 0, 255);
        }
        const hsvlCS = sensors.RgbToHsvlConverter(rgbCS);
        const color = sensors.HsvToColorNum(hsvlCS);
        if (debug) {
            brick.clearScreen();
            brick.printValue("r", rgbCS[0], 1, 21);
            brick.printValue("g", rgbCS[1], 2, 21);
            brick.printValue("b", rgbCS[2], 3, 21);
            brick.printValue("hue", hsvlCS[0], 5, 21);
            brick.printValue("sat", hsvlCS[1], 6, 21);
            brick.printValue("val", hsvlCS[2], 7, 21);
            brick.printValue("light", hsvlCS[3], 8, 21);
            brick.printValue("color", color, 10, 21);
        }
        control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
    }
}

// Функция для управление манипулятором
function Manipulator(motor: motors.Motor, state: ClawState, speed?: number, timeOut?: number) {
    if (!speed) speed = 40; // Если аргумент не был передан, то за скорость установится значение по умолчанию
    else speed = Math.abs(speed);
    if (timeOut == undefined) speed = 2000; // Если аргумент не был передан, то за максимальное время ожидания остановки устанавливается это значение
    else timeOut = Math.abs(timeOut);

    motor.setBrake(true); // Устанавливаем ударжание мотора при остановке
    if (state == ClawState.Open) motor.run(speed);
    else motor.run(-speed);
    motor.pauseUntilStalled(timeOut);
    motor.stop(); // Останавливаем мотор
}

// Примеры установки параметров для методов с регулятором
// { speed: 50 } - только скорость
// { speed: 50, Kp: 0.5 } - скорость и Kp
// { speed: 50, Kp: 0.5, Kd: 2 } - скорость, Kp и Kd
// { speed: 50, Kp: 0.5, Ki: 0, Kd: 2 } - скорость, Kp, Ki, Kd

//// Примеры вызовов функций
// motions.LineFollowToIntersection(AfterMotion.Rolling, { speed: 50, Kp: 0.5, Kd: 2 }); // Движение по линии до перекрёстка со скоростью 70 и прокаткой
// motions.LineFollowToLeftIntersection(LineLocation.Inside, AfterMotion.Rolling); // Движение по линии на правом датчике до перекрёстка слева со скоростью 50 и с прокаткой
// motions.LineFollowToRightIntersection(LineLocation.Inside, AfterMotion.Rolling); // Движение по линии на левом датчике до перекрёстка справа со скоростью 60 и с прокаткой
// motions.LineFollowToDist(400, AfterMotion.BreakStop); // Движение по линии на расстояние со скоростью 50 и жёстким торможением после
// chassis.SpinTurn(90, 30); // Поворот на 90 градусов вправо на скорости 30
// chassis.PivotTurn(90, 40, WheelPivot.LeftWheel); // Вращение на 90 градусов со скоростью 40 относительно левого мотора
// Manipulator(ClawState.Close); // Закрыть манипулятор со скоростью по умолчанию
// Manipulator(ClawState.Open, 60); // Открыть манипулятор с произвольной скоростью 60

function Main() { // Определение главной функции
    for (let i = 0; i < 10; i++) { // Опрашиваем какое-то количество раз датчики, чтобы они включились перед стартом по нажатию кнопки
        L_COLOR_SEN.light(LightIntensityMode.ReflectedRaw);
        R_COLOR_SEN.light(LightIntensityMode.ReflectedRaw);
        CHECK_COLOR_CS.rgbRaw();
        loops.pause(5);
    }

    // Установка коэффицентов движения по линии двумя датчиками
    motions.lineFollow2SensorSpeed = 60;
    motions.lineFollow2SensorKp = 0.075;
    motions.lineFollow2SensorKd = 3.5;

    // Установка коэффицентов умного поворота
    chassis.smartSpinTurnSpeed = 60;
    chassis.smartSpinTurnKp = 0.25;
    chassis.smartSpinTurnKd = 2;
    chassis.smartPivotTurnSpeed = 50;
    chassis.smartSpinTurnKp = 0.4;
    chassis.smartSpinTurnKd = 2;

    // Коэффиценты для выравнивания на линии
    levelings.lineAlignmentMaxSpeed = 50;
    levelings.lineAlignmentLeftSideKp = 0.15;
    levelings.lineAlignmentLeftSideKd = 0.3;
    levelings.lineAlignmentRightSideKp = 0.15;
    levelings.lineAlignmentRightSideKd = 0.3;

    // Коэффиценты для позиционирования на линии
    levelings.linePositioningMaxSpeed = 50;
    levelings.linePositioningKp = 0.175;
    levelings.linePositioningKd = 2;

    motions.SetDistRollingAfterInsetsection(50); // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    motions.SetDistRollingAfterIntersectionMoveOut(20); // Дистанция для прокатки без торможения на перекрёстке в мм

    sensors.SetLineSensorRawValue(LineSensor.Left, 643, 450); // Установить левому датчику линии (цвета) сырые значения чёрного и белого
    sensors.SetLineSensorRawValue(LineSensor.Right, 629, 474); // Установить правому датчику линии (цвета) сырые значения чёрного и белого

    sensors.SetColorSensorMaxRgbValues(L_COLOR_SEN, [273, 297, 355]);
    sensors.SetColorSensorMaxRgbValues(R_COLOR_SEN, [230, 224, 178]);
    sensors.SetColorSensorMaxRgbValues(CHECK_COLOR_CS, [354, 299, 354]);

    CHASSIS_L_MOTOR.setInverted(true); CHASSIS_R_MOTOR.setInverted(false); // Установка реверсов в шасси
    CHASSIS_L_MOTOR.setPauseOnRun(true); CHASSIS_R_MOTOR.setPauseOnRun(true); // Включаем у моторов ожидание выполнения
    CHASSIS_L_MOTOR.setBrakeSettleTime(10); CHASSIS_R_MOTOR.setBrakeSettleTime(10); // Включаем у моторов ожидание выполнения

    MANIPULATOR_MOTOR1.setInverted(true); MANIPULATOR_MOTOR2.setInverted(false); // Установить инверсию для манипулятора, если требуется
    MANIPULATOR_MOTOR1.setBrake(true); MANIPULATOR_MOTOR2.setBrake(true); // Удержание моторов манипуляторов

    // Ожидание старта
    brick.printString("PRESS ENTER TO RUN", 7, 6); // Вывести на экран сообщение о готовности
    while (true) {
        if (brick.buttonLeft.wasPressed()) custom.FunctionsTune(0, true);
        else if (brick.buttonUp.wasPressed()) sensors.SearchRgbMaxColorSensors();
        else if (brick.buttonDown.wasPressed()) RgbToHsvlToColorConvert(true);
        else if (brick.buttonRight.wasPressed()) break; // Ожидание нажатия правой кнопки, чтобы выйти и пойти дальше по коду

        loops.pause(0.001);
    }
    brick.clearScreen(); // Очистить экрана

    // Ваш код тут
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR1, ClawState.Open, 20, 1000);
    });
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR2, ClawState.Open, 20, 1000);
    });
    // chassis.DistMove(10, 40, true);
    chassis.PivotTurn(90, 30, WheelPivot.RightWheel);
    pause(250);
    motions.LineFollowToDistanceWithLeftSensor(HorizontalLineLocation.Outside, 700, AfterMotion.DecelRolling, { speed: 30, Kp: 0.3, Kd: 1 });
    pause(250);
    chassis.PivotTurn(30, 30, WheelPivot.LeftWheel);
    pause(100);
    chassis.PivotTurn(30, 30, WheelPivot.RightWheel);
    pause(100);
    motions.LineFollowToIntersection(AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 });
    pause(250);
    chassis.PivotTurn(78, 30, WheelPivot.LeftWheel);
    pause(100);
    chassis.PivotTurn(78, 30, WheelPivot.RightWheel);
    pause(100);
    chassis.DistMove(240, 40, true);
    // chassis.RampDistMove(240, 20, 30, 40);
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR1, ClawState.Close, 40);
    });
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR2, ClawState.Close, 40);
    });
    pause(500);
    chassis.DistMove(-550, 30, true);
    // chassis.RampDistMove(-550, -20, -30, 30);
    chassis.SpinTurn(-90, 30);
    pause(200);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    levelings.LineAlignment(VerticalLineLocation.Behind, 1000);
    chassis.DistMove(750, 50, true);
    //chassis.RampDistMove(750, 20, 30, 50);
    pause(200);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR1, ClawState.Open, 40);
    });
    control.runInParallel(function () {
        Manipulator(MANIPULATOR_MOTOR2, ClawState.Open, 40);
    });
    pause(100);
    chassis.DistMove(60, 40, true);
    chassis.SpinTurn(-90, 40);
    motions.LineFollowToDistance(200, AfterMotion.NoStop);
    motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 });
}

Main(); // Вызов главной функции