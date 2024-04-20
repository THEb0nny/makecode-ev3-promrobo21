//let CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
let CHASSIS_L_MOTOR = motors.mediumB; // Ссылка на объект левого мотора в шасси
let CHASSIS_R_MOTOR = motors.mediumC; // Ссылка на объект правого мотора в шасси

let MANIP_MOTOR1: motors.Motor = motors.mediumA; // Ссылка на объект мотора манипулятора
let MANIP_MOTOR2: motors.Motor = motors.mediumD; // Ссылка на объект мотора манипулятора

let COLOR_DETECTION_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let WHEELS_D = 62.4; // Диаметр колёс в мм
let WHEELS_W = 180; // Расстояние между центрами колёс в мм

let parkElements: number[] = [0, 0, 0, 0, 0, 0]; // Парковые элементы

let colorDetectionCSParams = {
    colorBoundary: 70,
    whiteBoundary: 10,
    blackBoundary: 1,
    redBoundary: 25,
    brownBoundary: 50,
    yellowBoundary: 100,
    greenBoundary: 180,
    blueBoundary: 260
};

function RgbToHsvlToColorConvert(debug: boolean = false): number {
    let rgbCS = COLOR_DETECTION_CS.rgbRaw();
    for (let i = 0; i < 3; i++) { // Нормализуем значения с датчика
        rgbCS[i] = Math.map(rgbCS[i], sensors.minRgbColorSensor4[i], sensors.maxRgbColorSensor4[i], 0, 255);
        rgbCS[i] = Math.constrain(rgbCS[i], 0, 255);
    }
    const hsvlCS = sensors.RgbToHsvlConverter(rgbCS); // Получаем HSVL
    const color = sensors.HsvlToColorNum(hsvlCS, colorDetectionCSParams); // Переводим HSVL в цветовой код
    if (debug) {
        const column = 20;
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
    if (!timeOut) timeOut = 2000; // Если аргумент не был передан, то за максимальное время ожидания остановки устанавливается это значение
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

    // Установка коэффицентов умного поворота
    chassis.smartSpinTurnSpeed = 60;
    chassis.smartSpinTurnKp = 0.25;
    chassis.smartSpinTurnKd = 2;
    chassis.smartPivotTurnSpeed = 50;
    chassis.smartSpinTurnKp = 0.4;
    chassis.smartSpinTurnKd = 2;

    // Коэффиценты для выравнивания на линии
    levelings.lineAlignmentMaxSpeed = 40;
    levelings.lineAlignmentLeftSideKp = 0.2;
    levelings.lineAlignmentLeftSideKd = 0.3;
    levelings.lineAlignmentRightSideKp = 0.2;
    levelings.lineAlignmentRightSideKd = 0.3;

    // Коэффиценты для позиционирования на линии
    levelings.linePositioningMaxSpeed = 50;
    levelings.linePositioningKp = 0.175;
    levelings.linePositioningKd = 2;

    sensors.SetLineSensors(sensors.color2, sensors.color3); // Установить датчики цвета в качестве датчиков линии

    motions.SetDistRollingAfterInsetsection(50); // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    motions.SetDistRollingAfterIntersectionMoveOut(20); // Дистанция для прокатки без торможения на перекрёстке в мм

    motions.SetLineFollowConditionMaxErr(50); // Максимальная ошибка при движении одним датчиком для определения перекрёстка

    sensors.SetLineSensorRawValue(LineSensor.Left, 632, 459); // Установить левому датчику линии (цвета) сырые значения чёрного и белого
    sensors.SetLineSensorRawValue(LineSensor.Right, 621, 479); // Установить правому датчику линии (цвета) сырые значения чёрного и белого

    sensors.SetColorSensorMinRgbValues(COLOR_DETECTION_CS, [0, 1, 3]); // Установить датчику определения фигур минимальные значения RGB

    sensors.SetColorSensorMaxRgbValues(sensors.leftLineSensor, [273, 297, 355]); // Установить левому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(sensors.rightLineSensor, [230, 224, 178]); // Установить правому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(COLOR_DETECTION_CS, [204, 190, 243]); // Установить датчику определения фигур максимальные значения RGB

    CHASSIS_L_MOTOR.setInverted(true); CHASSIS_R_MOTOR.setInverted(false); // Установка реверсов в шасси
    CHASSIS_L_MOTOR.setPauseOnRun(true); CHASSIS_R_MOTOR.setPauseOnRun(true); // Включаем у моторов ожидание выполнения
    CHASSIS_L_MOTOR.setBrakeSettleTime(10); CHASSIS_R_MOTOR.setBrakeSettleTime(10); // Установить у моторов время ожидание после торможения

    MANIP_MOTOR1.setInverted(true); MANIP_MOTOR2.setInverted(false); // Установить инверсию для манипулятора, если требуется
    MANIP_MOTOR1.setBrake(true); MANIP_MOTOR2.setBrake(true); // Удержание моторов манипуляторов

    // Опрашиваем какое-то количество раз датчики, чтобы они включились перед стартом по нажатию кнопки
    for (let i = 0; i < 50; i++) {
        sensors.leftLineSensor.light(LightIntensityMode.ReflectedRaw);
        sensors.rightLineSensor.light(LightIntensityMode.ReflectedRaw);
        COLOR_DETECTION_CS.rgbRaw();
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

    //// Ваш код тут
    // Закрываем манипуляторы прижимая кабель
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Open, 10, 500);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 10, 500);
    });
    chassis.PivotTurn(90, 40, WheelPivot.RightWheel); // Поворачиваем к линии
    pause(50);
    let startEncLeftMot = CHASSIS_L_MOTOR.angle(); // Запоминаем значение с энкодера левого мотора перед стартом  поиска парковых элементов
    let startEncRightMot = CHASSIS_R_MOTOR.angle(); // Запоминаем значенис с энкодера правого мотора
    // Запускаем функцию определения цвета парковых элементов в параллельной задаче
    control.runInParallel(function () {
        brick.setStatusLightInBackground(StatusLight.Red, 250); // Светим светодиодом, что мы закончили считывание
        while (true) {
            let currTime = control.millis(); // Текущее время
            let color = RgbToHsvlToColorConvert(); // Узнаём цвет переведя RGB в HSVL и получив код цвета
            let averageEnc = ((CHASSIS_L_MOTOR.angle() - startEncLeftMot) + (CHASSIS_R_MOTOR.angle() - startEncRightMot)) / 2; // Среднее значение с энкодеров
            if (280 <= averageEnc && averageEnc <= 400) parkElements[5] = color; // Считываем на зоне 6
            else if (averageEnc <= 550) parkElements[4] = color; // Считываем на зоне 5
            else if (averageEnc <= 730) parkElements[3] = color; // Считываем на зоне 4
            else if (averageEnc <= 870) parkElements[2] = color; // Считываем на зоне 3
            else if (averageEnc <= 1000) parkElements[1] = color; // Считываем на зоне 2
            else if (averageEnc <= 1150) parkElements[0] = color; // Считываем на зоне 1
            else if (averageEnc <= 1400) break; // Прервать, если проехал больше
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        brick.setStatusLightInBackground(StatusLight.OrangeFlash, 500); // Светим светодиодом, что мы закончили считывание
    });
    motions.LineFollowToDistanceWithLeftSensor(HorizontalLineLocation.Outside, 700, AfterMotion.DecelRolling, { speed: 20, Kp: 0.2, Kd: 1.75 });
    pause(50);
    for(let i = 0; i < 6; i++) {
        brick.printString(`${i + 1}) ${parkElements[i]}`, i + 1, 20);
    }
    // Поворачиваем, чтобы стать на линию
    chassis.PivotTurn(30, 40, WheelPivot.LeftWheel);
    pause(50);
    chassis.PivotTurn(30, 40, WheelPivot.RightWheel);
    pause(50);
    // Двигаемся до перекрёстка
    motions.LineFollowToIntersection(AfterMotion.DecelRolling, { speed: 40, Kp: 0.15, Kd: 1.5 });
    pause(50);
    // Поворачиваемся к зоне установки кабеля
    chassis.PivotTurn(78, 40, WheelPivot.LeftWheel);
    pause(50);
    chassis.PivotTurn(79, 40, WheelPivot.RightWheel);
    pause(50);
    // Двигаемся к зоне установки кабеля
    chassis.DistMove(240, 40, true);
    // chassis.RampDistMove(240, 20, 30, 40);
    // Поднимаем манипуляторы, чтобы оставить кабель
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Close, 30);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Close, 30);
    });
    pause(400); // Ждём, чтобы манипуляторы поднялись
    chassis.DistMove(-550, 40, true); // Едем назад задним ходом
    // chassis.RampDistMove(-550, -20, -30, 30);
    chassis.SpinTurn(-90, 30); // Поворачиваем передом к велосипедам
    pause(50);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -40, AfterMotion.BreakStop); // Едем назад до определения чёрной линии
    levelings.LineAlignment(VerticalLineLocation.Front, 1200); // Выравниваемся на линии
    chassis.DistMove(725, 40, true); // Едем вперёд, чтобы затолкать велосипеды в зону с зарядкой
    // chassis.RampDistMove(750, 20, 30, 50);
    pause(300);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -40, AfterMotion.BreakStop); // Едем назад до определения чёрной линии
    pause(100);
    // Открываем один манипулятор
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Open, 30);
    });
    // Закрываем другой манипулятор
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 30);
    });
    chassis.DistMove(50, 40, true); // Вперёд, чтобы встать колёсами на линию
    chassis.SpinTurn(-90, 40); // Поворачиваем к стороне зоны старта
    motions.LineFollowToDistance(200, AfterMotion.NoStop); // Едем двемя датчиками на дистанцию без команды торможения
    motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 }); // Едем до перекрёстка справа
    pause(100);

    /// МИССИЯ С ПАРКОВЫМИ ЭЛЕМЕНТАМИ 1 
    motions.LineFollowToDistance(110, AfterMotion.BreakStop, { speed: 20 });
    chassis.SpinTurn(-90, 30);
    levelings.LineAlignment(VerticalLineLocation.Behind, 1000); // Выравниваемся на линии
    chassis.DistMove(130, 20, true);
    // SetManipulatorPosition(MANIP_MOTOR1, ClawState.Close, 15);
    control.runInParallel(function () {
        MANIP_MOTOR1.run(-10, 150, MoveUnit.Degrees); // Взять первый элемент
    });
    control.runInParallel(function () {
        MANIP_MOTOR2.run(-10, 135, MoveUnit.Degrees); // Взять второй элемет
    });
    pause(800);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    pause(50);
    chassis.DistMove(60, 20, true);
    pause(50);
    chassis.SpinTurn(-90, 40);
    motions.LineFollowToDistance(200, AfterMotion.NoStop, { speed: 40 });
    motions.LineFollowToIntersection(AfterMotion.BreakStop);
    pause(50);
    chassis.DistMove(-20, 30, true);
    pause(50);
    chassis.SpinTurn(90, 40);
    pause(50);
    chassis.DistMove(120, 30, true);
    pause(50);
    // Ставим фигуру в левом манипуляторе
    let blueIsClaw = false;
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR1, ClawState.Open, 15);
    });
    if (!((parkElements[0] == 2 || parkElements[0] == 3) && (parkElements[1] == 2 || parkElements[1] == 3))) {
        control.runInParallel(function () {
            SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 15);
        });
    } else {
        blueIsClaw = true;
    }
    pause(800);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
    if (blueIsClaw == true) {
        chassis.DistMove(-470, 40, true);
        pause(50);
        chassis.SpinTurn(90, 30);
        pause(50);
        chassis.DistMove(550, 40, true);
        pause(50);
        chassis.SpinTurn(90, 30);
        pause(50);
        chassis.DistMove(80, 40, true);
        pause(50);
        control.runInParallel(function () {
            SetManipulatorPosition(MANIP_MOTOR2, ClawState.Open, 15);
        });
        pause(800);
        chassis.DistMove(-80, 40, true);
        pause(50);
        chassis.SpinTurn(90, 30);
        pause(50);
        chassis.DistMove(450, 40, true);
        pause(50);
        chassis.SpinTurn(90, 30);
        pause(50);
        chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, 40, AfterMotion.BreakStop);
        pause(50);
        chassis.DistMove(50, 40, true);
        pause(50);
        chassis.SpinTurn(90, 30);
    } else {
        chassis.DistMove(60, 40, true);
        pause(50);
        chassis.SpinTurn(90, 40);
        pause(50);
    }

    motions.LineFollowToDistance(150, AfterMotion.NoStop);
    motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.25, Kd: 1.5 });

    /// МИССИЯ С ПАРКОВЫМИ ЭЛЕМЕНТАМИ 2 
    motions.LineFollowToDistance(270, AfterMotion.BreakStop, { speed: 20 });
    pause(50);
    chassis.SpinTurn(-90, 30);
    pause(50);
    chassis.DistMove(90, 20, true);
    control.runInParallel(function () {
        MANIP_MOTOR1.run(-10, 150, MoveUnit.Degrees); // Взять первый элемент
    });
    control.runInParallel(function () {
        MANIP_MOTOR2.run(-10, 135, MoveUnit.Degrees); // Взять второй элемет
    });
    pause(800);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    pause(50);
    chassis.DistMove(60, 20, true);
    pause(50);
    chassis.SpinTurn(-90, 40);
    motions.LineFollowToDistance(200, AfterMotion.NoStop, { speed: 40 });
    motions.LineFollowToIntersection(AfterMotion.BreakStop);
}

Main(); // Вызов главной функции