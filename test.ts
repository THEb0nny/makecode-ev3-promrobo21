enum ManipulatorState {
    Down,
    Up
}

chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установить моторы в шасси и установить свойства инверсии
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установить параметры регулирования синхронизации моторов шасси
chassis.setWheelDiametr(62.4); // Установить радиус колёс в шасси
chassis.setBaseLength(172); // Установить размер базы шасси
motions.setDistRollingAfterIntersection(50); // Установить дистанцию прокатки после перекрёстка в мм
chassis.setBrakeSettleTime(100); // Время для стабилизации шасси после торможения

const manipulatorMotor = motors.mediumD;

// sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3); // Установить датчики цвета в качестве датчиков линии
sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight2, sensors.nxtLight3);
sensors.setLineSensorsRawRefValues(2420, 1740, 2004, 1308); // Установить калибровочные значения чёрного и белого левого и правого датчика

const colorSensor = sensors.color4; // Датчик цвета, которым определяем цвет предмета

sensors.setColorSensorMinRgbValues(colorSensor, 22, 21, 24);
sensors.setColorSensorMaxRgbValues(colorSensor, 255, 269, 215);
sensors.setHsvlToColorNumBoundariesColorSensor(colorSensor, {
    whiteBoundary: 50,
    blackBoundary: 10,
    coloredBoundary: 50,
    redBoundary: 20,
    orangeBoundary: -1,
    brownBoundary: -1,
    yellowBoundary: 90,
    greenBoundary: 190,
    blueBoundary: 300,
    purpleBoundary: -1
});

// [База 0]                                                                    [тупик] 
//    │                                                                           ⁞
//    │      (1)─────────────────(2)─────────────────(3)┄┄[тупик]                 |
//    │       │                   │                   │                           |
//    │       │                   │                  (6)───────────────(7)        |
//    │       │                   │                   │                 │         |
//    │      (4)─────────────────(5)                  │                (8)───────(9)
//    │       │                   │                   │                           │   
//    │       │                   │                   │                           │   
//   (10)────(11)────────────────(12)                 │                           │   
//    │       │                   │                   │                           │   
//    │       │                  (13)────────────────(14)─────────────(15)        │   
//    │       ▼                   │                                     │         │
//    ▼    [тупик]                ▼                                     ▼         ▼   
// [тупик]                     [тупик]                               [тупик]  [База 16]

// НАВИГАЦИОННЫЙ ГРАФ: КАРТА РРО 2026 (17 узлов)
navigation.setNodesCount(17);
navigation.buildGraph([
    // ВЫХОД ИЗ БАЗЫ 1 (0)
    navigation.createPath(0, 10, NavDirection.DownUp, 380),
    // ВЕРХНИЙ КОНТУР
    navigation.createPath(1, 2, NavDirection.RightLeft, 435),
    navigation.createPath(2, 3, NavDirection.RightLeft, 445),
    navigation.createBranch(3, NavDirection.Right), // тупик вправо над аркой
    // ВЕРХНИЕ ВЕРТИКАЛИ
    navigation.createPath(1, 4, NavDirection.DownUp, 320),
    navigation.createPath(2, 5, NavDirection.DownUp, 320),
    navigation.createPath(3, 6, NavDirection.DownUp, 250),
    // СРЕДНЯЯ ПЕРЕМЫЧКА СЛЕВА
    navigation.createPath(4, 5, NavDirection.RightLeft, 435),
    // ОБЪЕЗД СПРАВА ВВЕРХУ
    navigation.createPath(6, 7, NavDirection.RightLeft, 440),
    navigation.createPath(7, 8, NavDirection.DownUp, 220),
    // ДОРОЖКА ПОД ДЕВОЧКОЙ СПРАВА
    navigation.createPath(8, 9, NavDirection.RightLeft, 330),
    navigation.createBranch(9, NavDirection.Up), // тупик вверх вдоль края
    // Съезд к Базе 2 (16)
    navigation.createPath(9, 16, NavDirection.DownUp, 230),
    // ВЕРТИКАЛИ К ЦЕНТРАЛЬНОЙ МАГИСТРАЛИ
    navigation.createPath(4, 11, NavDirection.DownUp, 320),
    navigation.createPath(5, 12, NavDirection.DownUp, 320),
    navigation.createPath(6, 14, NavDirection.DownUp, 565), // длинная вертикаль справа от арки
    navigation.createPath(8, 15, NavDirection.DownUp, 345),
    // ЦЕНТРАЛЬНАЯ ГОРИЗОНТАЛЬ (ЗОНА КРЕСТА)
    navigation.createPath(10, 11, NavDirection.RightLeft, 335),
    navigation.createBranch(10, NavDirection.Down), // тупик вниз к черному квадрату
    navigation.createPath(11, 12, NavDirection.RightLeft, 435),
    navigation.createBranch(11, NavDirection.Down), // тупик вниз к черному квадрату (крест на 11!)
    // ПЕРЕХОД К НИЖНЕЙ МАГИСТРАЛИ
    navigation.createPath(12, 13, NavDirection.DownUp, 170),
    // НИЖНЯЯ МАГИСТРАЛЬ
    navigation.createPath(13, 14, NavDirection.RightLeft, 445),
    navigation.createBranch(13, NavDirection.Down), // тупик вниз к черному квадрату
    navigation.createPath(14, 15, NavDirection.RightLeft, 440),
    navigation.createBranch(15, NavDirection.Down)  // тупик вниз к черному квадрату
]);

// Старт на Базе 1 (узел 0), робот смотрит вниз (270°) на узел 10
navigation.setCurrentPosition(0);
// WARNING В новой системе направление задаётся в градусах. При старте обязательно нужно передавать enum. Если случайно передать число 1, робот решит, что он смотрит под углом 1° вместо 270°, и сделает лишний доворот.
navigation.setCurrentDirection(NavDirection.Down);

// Получить цвет
function GetColor(debug: boolean = false): number {
    const rgbHsvl = sensors.getColorSensorRgbHsvl(colorSensor);
    const color = sensors.convertHsvlToColorNum(rgbHsvl[1], sensors.getHsvlToColorNumBoundariesColorSensor(colorSensor));
    if (debug) {
        brick.clearScreen();
        brick.printValue("r", rgbHsvl[0][0], 1);
        brick.printValue("g", rgbHsvl[0][1], 2);
        brick.printValue("b", rgbHsvl[0][2], 3);
        brick.printValue("h", rgbHsvl[1][0], 5);
        brick.printValue("s", rgbHsvl[1][1], 6);
        brick.printValue("v", rgbHsvl[1][2], 7);
        brick.printValue("l", rgbHsvl[1][3], 8);
        brick.printValue("color", color, 10);
    }
    return color;
}

// Проверка цвета
function CheckColor(time: number, debug: boolean): number {
    let colorSamples: number[] = [];
    control.timer1.reset();
    let prevTime = control.millis();
    while (control.timer1.millis() < time) {
        const currTime = control.millis();
        const dt = currTime - prevTime;
        prevTime = currTime;
        const color = GetColor(debug);
        colorSamples.push(color);
        control.pauseUntilTimeMs(currTime, 10);
    }
    const colorResult = arrays.mode(colorSamples);
    return colorResult;
}

// Озвучить цвет
function VoiceColor(color: number) {
    if (color == 1) music.playSoundEffect(sounds.colorsBlack);
    if (color == 2) music.playSoundEffect(sounds.colorsBlue);
    else if (color == 3) music.playSoundEffect(sounds.colorsGreen);
    else if (color == 4) music.playSoundEffect(sounds.colorsYellow);
    else if (color == 5) music.playSoundEffect(sounds.colorsRed);
    else if (color == 6) music.playSoundEffect(sounds.colorsWhite);
    else music.playSoundEffect(sounds.communicationNo);
    pause(50);
}

// Манипулятор захвата
function Manipulator(state: ManipulatorState, hold: boolean, v: number = 50) {
    const dir = state == ManipulatorState.Up ? 1 : -1;
    manipulatorMotor.run(Math.abs(v) * dir);
    pause(10);
    manipulatorMotor.pauseUntilStalled();
    manipulatorMotor.setBrake(hold);
    manipulatorMotor.stop();
}

let btnLeftEventDone = false;
let btnRightEventDone = false;

brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    if (btnLeftEventDone) return; // Отключаем обработчик
    btnLeftEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    sensors.searchRgbMinMax(colorSensor);
    pause(500);
});

brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    if (btnRightEventDone) return; // Отключаем обработчик
    // btnRightEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    for (let i = 0; i < 10; i++) { // Предварительно перевести датчик цвета в режим цвета
        colorSensor.rgbRaw();
        pause(10);
    }
    
    brick.clearScreen();
    let color = CheckColor(1000, true);
    brick.clearScreen();
    brick.printValue("color", color, 1);
    VoiceColor(color);
    pause(1000);
});

// Установить пороговое значение отражения при движении по линии
// motions.setLineFollowRefTreshold(40)

// Установить дистанцию проезда после определения перекрёстка для прокатки в мм
// motions.setDistRollingAfterInsetsection(35)

// Установить дистанцию для прокатки на перекрёстке без торможения, чтобы не определять повторно линию
// motions.setDistRollingAfterIntersectionMoveOut(20)

// Установить dt для циклов регулирования при движении по линии
// motions.setLineFollowLoopDt(10)

// Установить расстояние между двумя датчиками линии в мм для выравнивания
// levelings.setDistanceBetweenLineSensors(32)

// Установить dt для циклов регулирования при выравнивания и позиционирования.
// levelings.setLineAlignmentOrPositioningLoopDt(10)

// sensors.searchRgbMinMaxColorSensors(sensors.color4);

// chassis.rampDistMove(30, 70, 70, 200, 50, 50);

// chassis.rampLinearDistMove(30, 70, 25, 500, 100, 200);
// pause(1000);
// chassis.rampLinearDistMove(-30, -70, -25, 500, 100, 200);

// chassis.accelStartLinearDistMove(25, 50, 150, 300);
// chassis.stop(true);
// chassis.steeringCommand(0, 50);
// chassis.decelFinishLinearDistMove(50, 10, 100, 300);

function Main() {
    manipulatorMotor.setInverted(false);
    Manipulator(ManipulatorState.Down, false, 50);

    for (let i = 0; i < 10; i ++) { // Предварительно перевести датчик цвета в режим цвета
        colorSensor.rgbRaw();
        pause(10);
    }
    sensors.preparationLineSensor(); // Предварительно подготовить датчики линии

    brick.setStatusLight(StatusLight.GreenPulse); // Сигнал о готовности светодиодами
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ждём нажатия
    music.playTone(262, music.beat(BeatFraction.Half)); // Звук начала

    // Тестовый поиск пути: из Базы 1 (0) в Базу 2 (16)
    const pathToBase2 = navigation.algorithmDijkstra(0, 16);
    console.log(`Путь из Базы 1 в Базу 2: ${pathToBase2.join(' -> ')}`);
    navigation.followLineByPath(pathToBase2, AfterLineMotion.SmoothRolling, { vStartMove: 30, vMaxMove: 60, vTurn: 60, Kp: 0.2, Kd: 0.5 });
}

Main();

// function lineFollow(actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
//     if (params) { // Если были переданы параметры
//         if (params.v >= 0) motions.lineFollowCrossIntersection2SensorV = Math.abs(params.v);
//         if (params.Kp >= 0) motions.lineFollowCrossIntersection2SensorKp = Math.abs(params.Kp);
//         if (params.Ki >= 0) motions.lineFollowCrossIntersection2SensorKi = Math.abs(params.Ki);
//         if (params.Kd >= 0) motions.lineFollowCrossIntersection2SensorKd = Math.abs(params.Kd);
//         if (params.Kf >= 0) motions.lineFollowCrossIntersection2SensorKf = Math.abs(params.Kf);
//     }
    
//     motions.pidLineFollow.setGains(motions.lineFollowCrossIntersection2SensorKp, motions.lineFollowCrossIntersection2SensorKi, motions.lineFollowCrossIntersection2SensorKd); // Установка коэффицентов ПИД регулятора
//     motions.pidLineFollow.setDerivativeFilter(motions.lineFollowCrossIntersection2SensorKf); // Установить фильтр дифференциального регулятора
//     motions.pidLineFollow.setControlSaturation(-200, 200); // Установка интервала ПИД регулятора
//     motions.pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору
//     motions.pidLineFollow.reset(); // Сброс ПИД регулятора

//     let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
//     while (true) { // Цикл регулирования движения по линии
//         const currTime = control.millis(); // Текущее время
//         const dt = currTime - prevTime; // Время за которое выполнился цикл
//         prevTime = currTime; // Новое время в переменную предыдущего времени
//         const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
//         const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
//         // if (refLeftLS < motions.getLineFollowRefThreshold() && refRightLS < motions.getLineFollowRefThreshold()) break; // Проверка на перекрёсток
//         const error = refRightLS - refLeftLS; // Ошибка регулирования
//         const u = motions.pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
//         chassis.regulatorSteering(u, motions.lineFollowCrossIntersection2SensorV * -1); // Команда моторам
//         // console.log(`refLS: ${refLeftLS} ${refRightLS}, error: ${error}, u: ${u}`);
//         if (debug) motions.printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
//         control.pauseUntilTimeMs(currTime, motions.getLineFollowLoopDt()); // Ожидание выполнения цикла
//     }
//     music.playToneInBackground(262, 250); // Издаём сигнал завершения
//     motions.actionAfterLineMotion(actionAfterMotion, motions.lineFollowCrossIntersection2SensorV); // Действие после алгоритма движения
// }