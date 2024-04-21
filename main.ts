//let CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
let CHASSIS_L_MOTOR = motors.mediumB; // Ссылка на объект левого мотора в шасси
let CHASSIS_R_MOTOR = motors.mediumC; // Ссылка на объект правого мотора в шасси

let MANIP_MOTOR_LEFT: motors.Motor = motors.mediumA; // Ссылка на объект мотора манипулятора
let MANIP_MOTOR_RIGHT: motors.Motor = motors.mediumD; // Ссылка на объект мотора манипулятора

let COLOR_DETECTION_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let WHEELS_D = 62.4; // Диаметр колёс в мм
let WHEELS_W = 180; // Расстояние между центрами колёс в мм

let parkElements: number[] = [0, 0, 0, 0, 0, 0]; // Парковые элементы

let colorDetectionCSParams = {
    colorBoundary: 65,
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

let leftClawElement = 0; // Какого цвета парковый элемент захватчен левым манипулятором
let rightClawElement = 0; // Какого цвета парковый элемент захватчен правым манипулятором
let blueIsFirstZone = false;
let blueIsSecondZone = false;
let parkZoneB: number[] = [];
let parkZoneA: number[] = [];

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

    sensors.SetColorSensorMinRgbValues(COLOR_DETECTION_CS, [0, 1, 2]); // Установить датчику определения фигур минимальные значения RGB

    sensors.SetColorSensorMaxRgbValues(sensors.leftLineSensor, [273, 297, 355]); // Установить левому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(sensors.rightLineSensor, [230, 224, 178]); // Установить правому датчику линии максималальные значения RGB
    sensors.SetColorSensorMaxRgbValues(COLOR_DETECTION_CS, [204, 190, 243]); // Установить датчику определения фигур максимальные значения RGB

    CHASSIS_L_MOTOR.setInverted(true); CHASSIS_R_MOTOR.setInverted(false); // Установка реверсов в шасси
    CHASSIS_L_MOTOR.setPauseOnRun(true); CHASSIS_R_MOTOR.setPauseOnRun(true); // Включаем у моторов ожидание выполнения
    CHASSIS_L_MOTOR.setBrakeSettleTime(10); CHASSIS_R_MOTOR.setBrakeSettleTime(10); // Установить у моторов время ожидание после торможения

    MANIP_MOTOR_LEFT.setInverted(true); MANIP_MOTOR_RIGHT.setInverted(false); // Установить инверсию для манипулятора, если требуется
    MANIP_MOTOR_LEFT.setBrake(true); MANIP_MOTOR_RIGHT.setBrake(true); // Удержание моторов манипуляторов

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
        SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 10, 500);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 10, 500);
    });
    chassis.PivotTurn(90, 40, WheelPivot.RightWheel); pause(50); // Поворачиваем к линии
    const startEncLeftMot = CHASSIS_L_MOTOR.angle(); // Запоминаем значение с энкодера левого мотора перед стартом  поиска парковых элементов
    const startEncRightMot = CHASSIS_R_MOTOR.angle(); // Запоминаем значенис с энкодера правого мотора
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
    motions.LineFollowToDistanceWithLeftSensor(HorizontalLineLocation.Outside, 700, AfterMotion.DecelRolling, { speed: 20, Kp: 0.2, Kd: 1.75 }); pause(50);
    // Вывести на экран найденные элементы
    for(let i = 0; i < 6; i++) {
        brick.printString(`${i + 1}) ${parkElements[i]}`, i + 1, 20);
    }
    // Поворачиваем, чтобы стать на линию
    chassis.PivotTurn(30, 40, WheelPivot.LeftWheel); pause(50);
    chassis.PivotTurn(30, 40, WheelPivot.RightWheel); pause(50);
    // Двигаемся до перекрёстка
    motions.LineFollowToIntersection(AfterMotion.DecelRolling, { speed: 50, Kp: 0.15, Kd: 1.5 }); pause(50);
    // Поворачиваемся к зоне установки кабеля
    chassis.PivotTurn(78, 40, WheelPivot.LeftWheel); pause(50);
    chassis.PivotTurn(79, 40, WheelPivot.RightWheel); pause(50);
    // Двигаемся к зоне электрозярядки B для установки кабеля
    chassis.DistMove(240, 50, true);
    // Поднимаем манипуляторы, чтобы оставить кабель
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Close, 30);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Close, 30);
    });
    pause(400); // Ждём, чтобы манипуляторы поднялись
    chassis.DistMove(-550, 50, true); pause(50); // Едем назад задним ходом
    chassis.SpinTurn(-90, 30); pause(50); // Поворачиваем к велосипедам, чтобы втолкнуть в зону зарядки A
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -40, AfterMotion.BreakStop); // Едем назад до определения чёрной линии
    levelings.LineAlignment(VerticalLineLocation.Front, 1200); // Выравниваемся на линии
    chassis.DistMove(725, 50, true); // Едем вперёд, чтобы затолкать велосипеды в зону с зарядкой
    pause(200);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -40, AfterMotion.BreakStop); pause(50); // Едем назад до определения чёрной линии
    // Открываем манипуляторы
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 30);
    });
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 30);
    });
    chassis.DistMove(50, 50, true); pause(50); // Вперёд, чтобы встать колёсами на линию
    chassis.SpinTurn(-90, 40); // Поворачиваем к стороне зоны старта
    motions.LineFollowToDistance(200, AfterMotion.NoStop); // Едем двемя датчиками на дистанцию без команды торможения
    motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 }); pause(50); // Едем до перекрёстка справа


    /// Вариант за 20.04
    /// МИССИЯ С ПАРКОВЫМИ ЭЛЕМЕНТАМИ 1
    motions.LineFollowToDistance(110, AfterMotion.BreakStop, { speed: 20 }); pause(50); // Подъезжаем по линии на расстояние к первому второму элементу
    chassis.SpinTurn(-90, 30); // Поворачиваемся влево к парковым элементам
    levelings.LineAlignment(VerticalLineLocation.Behind, 1000); // Выравниваемся на линии
    chassis.DistMove(130, 20, true); // Подъехать, чтобы захватить
    control.runInParallel(function () {
        MANIP_MOTOR_LEFT.run(-10, 150, MoveUnit.Degrees); // Взять первый элемент
        if (parkElements[0] == 2 || parkElements[0] == 3) leftClawElement = 2; // Записываем левому манипулятору синий элемент
        else leftClawElement = 1; // Иначе чёрный
    });
    control.runInParallel(function () {
        MANIP_MOTOR_RIGHT.run(-10, 150, MoveUnit.Degrees); // Взять второй элемет
        if (parkElements[1] == 2 || parkElements[1] == 3) rightClawElement = 2; // Записываем правому манипулятору синий элемент
        else rightClawElement = 1; // Иначе чёрный
    });
    pause(900); // Время, чтобы манипуляторы отработали
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); pause(50); // Объезжаем назад к линии
    chassis.DistMove(60, 20, true); pause(50); // Вперёд, чтобы стать колёсами на линию
    chassis.SpinTurn(-90, 40); // Поворачиваем к перекрёстку у парковой зоны B
    motions.LineFollowToDistance(200, AfterMotion.NoStop, { speed: 40 });
    motions.LineFollowToIntersection(AfterMotion.BreakStop); pause(50); // Двигаемся до перекрёстка у парковой зоны B
    chassis.DistMove(-10, 30, true); pause(50); // Отъезжаем назад
    chassis.SpinTurn(90, 40); pause(50); // Поворачиваем к парковой зоне B
    chassis.DistMove(120, 30, true); pause(50); // Двигаемся вперёд на парковую зону B
    // Парковая зона B
    // Ставим фигуру в левом манипуляторе
    control.runInParallel(function () {
        SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
        parkZoneB.push(leftClawElement);
    });
    // Если в левом манипуляторе был такой же элемент синий, тогда не ставим
    if (!(leftClawElement == 2 && rightClawElement == 2)) {
        control.runInParallel(function () {
            SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
            parkZoneB.push(rightClawElement);
            rightClawElement = 0;
        });
    } else {
        blueIsFirstZone = true;
    }
    leftClawElement = 0;
    pause(800); // Время, чтобы манипуляторы отработали
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); // Объезжаем назад к линии
    levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
    if (leftClawElement == 2 || rightClawElement == 2) { // Если в одном из манипуляторов остался синяя фигурка
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
            SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
            rightClawElement = 0;
        });
        pause(900);
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
    motions.LineFollowToDistance(280, AfterMotion.BreakStop, { speed: 20 }); // Подъезжаем к 3 и 4 элементу
    pause(50);
    chassis.SpinTurn(-90, 30); // Поворачиваем к элементам
    pause(50);
    chassis.DistMove(90, 20, true); // Берём элементы
    control.runInParallel(function () {
        MANIP_MOTOR_LEFT.run(-10, 150, MoveUnit.Degrees); // Взять первый элемент
        if (parkElements[2] == 2 || parkElements[3] == 3) {
            leftClawElement = 2;
        } else {
            leftClawElement = 1;
        }
    });
    control.runInParallel(function () {
        MANIP_MOTOR_RIGHT.run(-10, 135, MoveUnit.Degrees); // Взять второй элемет
        if (parkElements[3] == 2 || parkElements[4] == 3) {
            rightClawElement = 2;
        } else {
            rightClawElement = 1;
        }
    });
    pause(900);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); // Ехать назад к линии
    pause(50);
    chassis.DistMove(60, 20, true); // Вперёд, чтобы стать колёсами на линию
    pause(50);
    chassis.SpinTurn(-90, 40); // Поворот налево
    pause(50);
    motions.LineFollowToDistance(300, AfterMotion.NoStop, { speed: 40 });
    motions.LineFollowToIntersection(AfterMotion.BreakStop);
    pause(50);
    chassis.DistMove(-80, 30, true);
    pause(50);
    chassis.SpinTurn(90, 40);
    pause(50);
    chassis.DistMove(120, 30, true);
    pause(50);
    // Ставим фигуру в левом манипуляторе
    // Оставить фигуру из левого манипулятора, если фигура не синяя или синяя и зона синем не занята
    if (leftClawElement != 2 || (leftClawElement == 2 && !blueIsFirstZone)) {
        control.runInParallel(function () {
            SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
            leftClawElement = 0;
        });
    }
    // Оставить фигуру из правого манипулятора, если фигура не синяя или синяя и зона синем не занята
    if (rightClawElement != 2 || (leftClawElement == 2 && !blueIsFirstZone)) {
        control.runInParallel(function () {
            SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
            rightClawElement = 0;
        });
    }
    pause(800);
    chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop);
    levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
    if (leftClawElement == 2 || rightClawElement == 2) { // Если остался ещё синий элемент в руке
        chassis.DistMove(-470, 40, true); // Назад на расстояние к дальней парковой зоне
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
            SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
            rightClawElement = 0;
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
    }

    chassis.DistMove(60, 40, true);
    pause(50);
    chassis.SpinTurn(90, 40);
    pause(50);

    // МИССИЯ С ПАРКОВЫМИ ЭЛЕМЕНТАМИ 3


    // Вернутся домой
    // motions.LineFollowToDistance(150, AfterMotion.NoStop);
    // motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.25, Kd: 1.5 });
    // motions.LineFollowToIntersection(AfterMotion.BreakStop);
    // chassis.DistMove(100, 30, true);
    // chassis.PivotTurn(90, 40, WheelPivot.LeftWheel);
    

    // chassis.DistMove(-20, 30, true);
    // chassis.PivotTurn(90, 40, WheelPivot.RightWheel);
    // motions.LineFollowToDistance(200, AfterMotion.BreakStop);
    // chassis.SpinTurn(-90, 30);
    // control.runInParallel(function () {
    //     MANIP_MOTOR_LEFT.run(-10, 115, MoveUnit.Degrees); // Взять первый элемент
    // });
    // control.runInParallel(function () {
    //     MANIP_MOTOR_RIGHT.run(-10, 110, MoveUnit.Degrees); // Взять второй элемет
    // });
    // pause(500);
    // chassis.DistMove(100, 30, true);
    // control.runInParallel(function () {
    //     SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
    // });
    // control.runInParallel(function () {
    //     SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
    // });
    // pause(500);
}

Main(); // Вызов главной функции


// for (let i = 0; i < 6; i += 2) {
//     if (i == 0) {
//         motions.LineFollowToDistance(110, AfterMotion.BreakStop, { speed: 20 }); pause(50); // Подъезжаем по линии на расстояние к первому-второму элементу
//     } else if (i == 2) {
//         motions.LineFollowToDistance(280, AfterMotion.BreakStop, { speed: 20 }); pause(50); // Подъезжаем по линии на расстояние к третьему-четвёртому элементу
//     } else {
//         motions.LineFollowToDistance(450, AfterMotion.BreakStop, { speed: 20 }); pause(50); // Подъезжаем по линии на расстояние к пятому-шестому элементу
//     }
//     chassis.SpinTurn(-90, 30); // Поворачиваемся влево к парковым элементам
//     // chassis.DistMove(-20, 30, true); // Назад к линии
//     chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); pause(50); // Объезжаем назад к линии
//     levelings.LineAlignment(VerticalLineLocation.Behind, 1000); // Выравниваемся на линии
//     chassis.DistMove(130, 20, true); // Подъехать, чтобы захватить
//     control.runInParallel(function () {
//         MANIP_MOTOR_LEFT.run(-10, 150, MoveUnit.Degrees); // Взять первый элемент
//         if (parkElements[0] == 2 || parkElements[0] == 3) leftClawElement = 2; // Записываем левому манипулятору синий элемент
//         else leftClawElement = 1; // Иначе чёрный
//     });
//     control.runInParallel(function () {
//         MANIP_MOTOR_RIGHT.run(-10, 150, MoveUnit.Degrees); // Взять второй элемет
//         if (parkElements[1] == 2 || parkElements[1] == 3) rightClawElement = 2; // Записываем правому манипулятору синий элемент
//         else rightClawElement = 1; // Иначе чёрный
//     });
//     pause(900); // Время, чтобы манипуляторы отработали
//     chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); pause(50); // Объезжаем назад к линии
//     chassis.DistMove(60, 20, true); pause(50); // Вперёд, чтобы стать колёсами на линию
//     chassis.SpinTurn(-90, 40); // Поворачиваем к перекрёстку у парковой зоны B
//     if (i == 0) {
//         motions.LineFollowToDistance(200, AfterMotion.NoStop, { speed: 40 });
//     } else if (i == 2) {
//         motions.LineFollowToDistance(400, AfterMotion.NoStop, { speed: 40 });
//     } else {
//         motions.LineFollowToDistance(600, AfterMotion.NoStop, { speed: 40 });
//     }
//     motions.LineFollowToIntersection(AfterMotion.BreakStop); pause(50); // Двигаемся до перекрёстка у парковой зоны B
//     chassis.DistMove(-10, 30, true); pause(50); // Отъезжаем назад

//     // Если парковая зона B не заполнена 3-я элементами
//     if (parkZoneB.length < 3) {
//         chassis.SpinTurn(90, 40); pause(50); // Поворачиваем к парковой зоне B
//         chassis.DistMove(120, 30, true); pause(50); // Двигаемся вперёд на парковую зону B
//         // Парковая зона B
//         // Левый манипулятор
//         if (parkZoneB.indexOf(2) != -1) { // Если в зоне B уже есть синия фигура
//             control.runInParallel(function () { // Ставим фигуру в левом манипуляторе
//                 SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
//                 parkZoneB.push(leftClawElement);
//                 leftClawElement = 0;
//             });
//         }
//         // Правый манипулятор
//         if (parkZoneB.indexOf(2) != -1) { // Если в зоне B уже есть синия фигура
//             control.runInParallel(function () {
//                 SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
//                 parkZoneB.push(rightClawElement);
//                 rightClawElement = 0;
//             });
//         }
//         pause(800); // Время, чтобы манипуляторы отработали
//         chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); // Объезжаем назад к линии
//         levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии

//         if (leftClawElement != 0 || rightClawElement != 0) { // Если в одном из манипуляторов остался фигурка
//             chassis.DistMove(-470, 40, true); pause(50); // Задним ходом назад
//             chassis.SpinTurn(90, 30); pause(50); // Поворот на право
//             chassis.DistMove(550, 40, true); pause(50); // Вперёд, чтобы подъехать к парковой зоне А
//             chassis.SpinTurn(90, 30); pause(50); // Поворачиваем к парковой зоне А
//             chassis.DistMove(80, 40, true); pause(50); // Вперёд в парковую зону A
//             if (leftClawElement != 0) { // Если левый манипулятор не пустой
//                 control.runInParallel(function () {
//                     SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
//                     parkZoneA.push(leftClawElement); // Записываем, что в парковой зоне оставили фигурку
//                     leftClawElement = 0; // В левом манипуляторе больше ничего нет
//                 });
//             }
//             if (rightClawElement != 0) { // Если правый манипулятор не пустой
//                 control.runInParallel(function () {
//                     SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
//                     parkZoneA.push(leftClawElement); // Записываем, что в парковой зоне оставили фигурку
//                     rightClawElement = 0; // В правом манипуляторе больше ничего нет
//                 });
//             }
//             pause(900); // Время, чтобы манипуляторы отработали
//             chassis.DistMove(-80, 40, true); pause(50); // Отъезжаем назад от парковой зоны А
//             chassis.SpinTurn(90, 30); pause(50); // Поворачиваем обратно
//             chassis.DistMove(450, 40, true); pause(50); // Едем обратно
//             chassis.SpinTurn(90, 30); pause(50); // Поворачиваем к линии
//             chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, 40, AfterMotion.BreakStop); pause(50); // Едем обратно на линию
//             levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
//         }
//         chassis.DistMove(50, 40, true); pause(50); // Становимся на линию колёсами
//         chassis.SpinTurn(90, 30); pause(50); // Поворачиваемся влево к парковым элементам
//     } else if (parkZoneA.length < 3) { // Иначе если парковая зона А не полностью заполнена
//         chassis.SpinTurn(-90, 40); pause(50); // Поворачиваем к парковой зоне B
//         chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, -30, AfterMotion.BreakStop); // Объезжаем назад к линии
//         levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
//         chassis.DistMove(470, 40, true); pause(50); // Задним ходом назад
//         chassis.SpinTurn(-90, 30); pause(50); // Поворот на право
//         chassis.DistMove(550, 40, true); pause(50); // Вперёд, чтобы подъехать к парковой зоне A
//         chassis.SpinTurn(90, 30); pause(50); // Поворачиваем к парковой зоне A
//         chassis.DistMove(80, 40, true); pause(50); // Вперёд в парковую зону A
//         // Левый манипулятор
//         if (parkZoneA.indexOf(2) != -1) { // Если в зоне A уже есть синия фигура
//             control.runInParallel(function () { // Ставим фигуру в левом манипуляторе
//                 SetManipulatorPosition(MANIP_MOTOR_LEFT, ClawState.Open, 15);
//                 parkZoneA.push(leftClawElement);
//                 leftClawElement = 0;
//             });
//         }
//         // Правый манипулятор
//         if (parkZoneA.indexOf(2) != -1) { // Если в зоне A уже есть синия фигура
//             control.runInParallel(function () {
//                 SetManipulatorPosition(MANIP_MOTOR_RIGHT, ClawState.Open, 15);
//                 parkZoneA.push(rightClawElement);
//                 rightClawElement = 0;
//             });
//         }
//         pause(900); // Время, чтобы манипуляторы отработали
//         chassis.DistMove(-80, 40, true); pause(50); // Отъезжаем назад от парковой зоны А
//         chassis.SpinTurn(90, 30); pause(50); // Поворачиваем обратно
//         chassis.DistMove(450, 40, true); pause(50); // Едем обратно
//         chassis.SpinTurn(90, 30); pause(50); // Поворачиваем к линии
//         chassis.MoveToRefZone(SensorSelection.LeftOrRight, LogicalOperators.Less, 20, 0, 40, AfterMotion.BreakStop); pause(50); // Едем обратно на линию
//         levelings.LineAlignment(VerticalLineLocation.Front, 1000); // Выравниваемся на линии
//         chassis.DistMove(50, 40, true); pause(50); // Становимся на линию колёсами
//         chassis.SpinTurn(90, 30); pause(50); // Поворачиваемся влево к парковым элементам
//     }
//     motions.LineFollowToDistance(200, AfterMotion.NoStop); // Едем двемя датчиками на дистанцию без команды торможения
//     motions.LineFollowToRightIntersection(HorizontalLineLocation.Inside, AfterMotion.DecelRolling, { speed: 40, Kp: 0.2, Kd: 1.5 }); pause(50); // Едем до перекрёстка справа
// }
// motions.LineFollowToIntersection(AfterMotion.BreakStop); // Едем до зоны старта
// chassis.DistMove(100, 30, true);
// chassis.PivotTurn(90, 40, WheelPivot.LeftWheel);
// КОНЕЦ НОВЫЙ ВЕРСИИ