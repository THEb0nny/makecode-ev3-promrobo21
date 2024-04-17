//let CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
let CHASSIS_L_MOTOR = motors.mediumB; // Ссылка на объект левого мотора в шасси
let CHASSIS_R_MOTOR = motors.mediumC; // Ссылка на объект правого мотора в шасси

let MANIP_MOTOR1: motors.Motor = motors.mediumA; // Ссылка на объект мотора манипулятора
let MANIP_MOTOR2: motors.Motor = motors.mediumD; // Ссылка на объект мотора манипулятора

let CHECK_COLOR_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let WHEELS_D = 62.4; // Диаметр колёс в мм
let WHEELS_W = 180; // Расстояние между центрами колёс в мм

let parkElements: number[] = [0, 0, 0, 0, 0, 0]; // Парковые элементы

function RgbToHsvlToColorConvert(debug: boolean = false): number {
    let rgbCS = CHECK_COLOR_CS.rgbRaw();
    for (let i = 0; i < 3; i++) {
        rgbCS[i] = Math.map(rgbCS[i], 0, sensors.maxRgbColorSensor4[i], 0, 255);
        rgbCS[i] = Math.constrain(rgbCS[i], 0, 255);
    }
    const hsvlCS = sensors.RgbToHsvlConverter(rgbCS);
    const color = sensors.HsvlToColorNum(hsvlCS);
    const column = 20;
    if (debug) {
        brick.clearScreen();
        brick.printValue("r", rgbCS[0], 1, column);
        brick.printValue("g", rgbCS[1], 2, column);
        brick.printValue("b", rgbCS[2], 3, column);
        brick.printValue("hue", hsvlCS[0], 5, column);
        brick.printValue("sat", hsvlCS[1], 6, column);
        brick.printValue("val", hsvlCS[2], 7, column);
        brick.printValue("light", hsvlCS[3], 8, column);
        brick.printValue("color", color, 10, column);
    }
    return color;
}

// Функция для управление манипулятором
function SetManipulatorPosition(motor: motors.Motor, state: ClawState, speed?: number, timeOut?: number) {
    if (!speed) speed = 40; // Если аргумент не был передан, то за скорость установится значение по умолчанию
    else speed = Math.abs(speed);
    if (timeOut == undefined) speed = 2000; // Если аргумент не был передан, то за максимальное время ожидания остановки устанавливается это значение
    else timeOut = Math.abs(timeOut);
    motor.setBrake(true); // Устанавливаем ударжание мотора при остановке
    if (state == ClawState.Open) motor.run(speed); // Запускаем мотор
    else if (state == ClawState.Close) motor.run(-speed); // Запускаем мотор в другую сторону
    else return;
    motor.pauseUntilStalled(timeOut);
    motor.stop(); // Останавливаем мотор
}

//// Примеры установки параметров для методов с регулятором
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

    sensors.SetLineSensors(sensors.color2, sensors.color3); // Установить датчики цвета в качестве датчиков линии

    motions.SetDistRollingAfterInsetsection(50); // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    motions.SetDistRollingAfterIntersectionMoveOut(20); // Дистанция для прокатки без торможения на перекрёстке в мм

    sensors.SetLineSensorRawValue(LineSensor.Left, 643, 450); // Установить левому датчику линии (цвета) сырые значения чёрного и белого
    sensors.SetLineSensorRawValue(LineSensor.Right, 629, 474); // Установить правому датчику линии (цвета) сырые значения чёрного и белого

    sensors.SetColorSensorMaxRgbValues(sensors.leftLineSensor, [273, 297, 355]); // Установить левому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(sensors.rightLineSensor, [230, 224, 178]); // Установить правому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(CHECK_COLOR_CS, [352, 319, 382]);

    CHASSIS_L_MOTOR.setInverted(true); CHASSIS_R_MOTOR.setInverted(false); // Установка реверсов в шасси
    CHASSIS_L_MOTOR.setPauseOnRun(true); CHASSIS_R_MOTOR.setPauseOnRun(true); // Включаем у моторов ожидание выполнения
    CHASSIS_L_MOTOR.setBrakeSettleTime(10); CHASSIS_R_MOTOR.setBrakeSettleTime(10); // Установить у моторов время ожидание после торможения

    MANIP_MOTOR1.setInverted(true); MANIP_MOTOR2.setInverted(false); // Установить инверсию для манипулятора, если требуется
    MANIP_MOTOR1.setBrake(true); MANIP_MOTOR2.setBrake(true); // Удержание моторов манипуляторов

    // Опрашиваем какое-то количество раз датчики, чтобы они включились перед стартом по нажатию кнопки
    for (let i = 0; i < 10; i++) {
        sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw);
        sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw);
        CHECK_COLOR_CS.rgbRaw();
        loops.pause(5);
    }

    // Ожидание старта
    brick.printString("PRESS ENTER TO RUN", 7, 6); // Вывести на экран сообщение о готовности
    while (true) {
        if (brick.buttonLeft.wasPressed()) custom.FunctionsTune(0, true);
        else if (brick.buttonUp.wasPressed()) sensors.SearchRgbMaxColorSensors();
        else if (brick.buttonDown.wasPressed()) {
            while (true) {
                let currTime = control.millis(); // Текущее время
                RgbToHsvlToColorConvert(true);
                control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
            }
        } else if (brick.buttonRight.wasPressed()) break; // Ожидание нажатия правой кнопки, чтобы выйти и пойти дальше по коду
        loops.pause(0.001);
    }
    brick.clearScreen(); // Очистить экрана

    // Ваш код тут
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Open, 20, 1000);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 20, 1000);
    });
    // chassis.DistMove(10, 40, true);
    chassis.PivotTurn(90, 30, WheelPivot.RightWheel);
    pause(250);
    // Запускаем функцию определения цвета парковых элементов в параллельной задаче
    let startEncLeftMotor = CHASSIS_L_MOTOR.angle(); // Запоминаем значение с энкодера левого мотора перед стартом  поиска парковых элементов
    let startEncRightMotor = CHASSIS_R_MOTOR.angle(); // Запоминаем значенис с энкодера правого мотора
    control.runInParallel(function () {
        while (true) {
            let currTime = control.millis(); // Текущее время
            let color = RgbToHsvlToColorConvert(); // Узнаём цвет переведя RGB в HSVL и получив код цвета
            if (color == 1 || color == 2) { // Если нашли искомые цвета
                brick.setStatusLightInBackground(StatusLight.Orange, 50); // Светим светодиодом
                let averageEnc = ((CHASSIS_L_MOTOR.angle() - startEncLeftMotor) + (CHASSIS_R_MOTOR.angle() - startEncRightMotor)) / 2; // Среднее значение с энкодеров
                if (25 <= averageEnc && averageEnc <= 50) parkElements[5] = color; // Считываем на зоне 6
                else if (averageEnc <= 100) parkElements[4] = color; // Считываем на зоне 5
                else if (averageEnc <= 150) parkElements[3] = color; // Считываем на зоне 4
                else if (averageEnc <= 200) parkElements[2] = color; // Считываем на зоне 3
                else if (averageEnc <= 250) parkElements[1] = color; // Считываем на зоне 2
                else if (averageEnc <= 300) parkElements[0] = color; // Считываем на зоне 1
                else if (averageEnc <= 350) break; // Прервать, если проехал больше
            }
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        brick.setStatusLightInBackground(StatusLight.GreenPulse, 500); // Светим светодиодом, что мы закончили считывание
    });
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
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Close, 40);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Close, 40);
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
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Open, 40);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 40);
    });
    pause(100);
    chassis.DistMove(60, 40, true);
    chassis.SpinTurn(-90, 40);
    motions.LineFollowToDistance(200, AfterMotion.NoStop);
    motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 });
}

Main(); // Вызов главной функции