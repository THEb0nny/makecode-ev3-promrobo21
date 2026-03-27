chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установить моторы в шасси и установить свойства инверсии
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установить параметры регулирования синхронизации моторов шасси
chassis.setWheelDiametr(62.4); // Установить радиус колёс в шасси
chassis.setBaseLength(172); // Установить размер базы шасси
motions.setDistRollingAfterIntersection(50); // Установить дистанцию прокатки после перекрёстка в мм
chassis.setBrakeSettleTime(100); // Время для стабилизации шасси после торможения

sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3); // Установить датчики цвета в качестве датчиков линии
sensors.setLineSensorsRawRefValues(630, 499, 650, 520); // Установить калибровочные значения чёрного и белого левого и правого датчика

const colorSensor = sensors.color4; // Датчик цвета, которым определяем цвет предмета

sensors.setColorSensorMinRgbValues(colorSensor, 22, 21, 24);
sensors.setColorSensorMaxRgbValues(colorSensor, 255, 269, 215);
sensors.setHsvlToColorNumBoundaries(colorSensor, {
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

// Получить цвет
function GetColor(debug: boolean = false): number {
    const rgbHsvl = sensors.getRgbHsvl(colorSensor);
    const color = sensors.convertHsvlToColorNum(rgbHsvl[1], sensors.getHsvlToColorNumBoundaries(colorSensor));
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
    const colorResult = custom.mostFrequentNumber(colorSamples);
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
}

let btnLeftEventDone = false;

brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    if (btnLeftEventDone) return; // Отключаем обработчик
    btnLeftEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    sensors.searchRgbMinMax(colorSensor);
    pause(500);
});

// let btnRightEventDone = false;

brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    for (let i = 0; i < 10; i++) { // Предварительно перевести датчик цвета в режим цвета
        colorSensor.rgbRaw();
        pause(10);
    }
    // if (btnRightEventDone) return; // Отключаем обработчик
    // btnRightEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    brick.clearScreen();
    let color = CheckColor(1000, true);
    brick.clearScreen();
    brick.printValue("color", color, 1);
    VoiceColor(color);
    pause(1000);
});

function Main() {
    for (let i = 0; i < 10; i ++) { // Предварительно перевести датчик цвета в режим цвета
        colorSensor.rgbRaw();
        pause(10);
    }
    sensors.preparationLineSensor(); // Предварительно подготовить датчики линии

    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ждём нажатия
    music.playTone(262, music.beat(BeatFraction.Half)); // Звук начала

    chassis.linearDistMove(150, 60, MotionBraking.Continue);
    motions.lineFollowToCrossIntersection(AfterLineMotion.Rolling, { v: 60, Kp: 0.2 });
    chassis.spinTurn(-90, 60);
    
    motions.lineFollowToDistanceByTwoSensors(200, AfterLineMotion.HoldStop, { v: 60, Kp: 0.2 });
    chassis.spinTurn(90, 60);
    chassis.linearDistMove(40, 50, MotionBraking.Hold);

    // if (color == 0) {
    //     chassis.spinTurn(-90, 60);
    // } else {
    //     chassis.spinTurn(90, 60);
    // }

    let leftColorZone = -1;

    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            motions.lineFollowToDistanceByTwoSensors(200, AfterLineMotion.HoldStop, { v: 60, Kp: 0.2 });
        } else {
            motions.lineFollowToDistanceByTwoSensors(100, AfterLineMotion.HoldStop, { v: 60, Kp: 0.2 });
        }
        chassis.spinTurn(90, 60);
        chassis.linearDistMove(40, 50, MotionBraking.Hold);

        brick.clearScreen();
        leftColorZone = CheckColor(500, true);
        brick.clearScreen();
        brick.printValue("color", leftColorZone, 1);
        VoiceColor(leftColorZone);

        pause(5000);
        chassis.linearDistMove(-40, 50, MotionBraking.Hold);

        if (leftColorZone != 0) break;
    }

    chassis.spinTurn(90, 60);
}

Main();

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

/*
let navMatrix: number[][] = [
    // 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28
    [-1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 0
    [1, -1, 3, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 1
    [-1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 2
    [-1, -1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 3
    [-1, -1, -1, -1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 4
    [-1, 2, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 5
    [-1, -1, -1, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 6
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 7
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 8
    [-1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 9
    [-1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 10
    [-1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 11
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 12
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 13
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 14
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1], // 15
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1], // 16
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 17
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 18
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, 0, -1, -1, -1, -1, -1], // 19
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, 0, -1, -1, -1, -1], // 20
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, 1, -1, 3, -1, -1, 0, -1, -1, -1], // 21
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1], // 22
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 23
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, 0, -1, -1], // 24
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1], // 25
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, 0, -1], // 26
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, 0], // 27
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1] // 28
];

let weightMatrix: number[][] = [
    // 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28
    [-1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 0
    [1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 1
    [-1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 2
    [-1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 3
    [-1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 4
    [-1, 1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 5
    [-1, -1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 6
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 7
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 8
    [-1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 9
    [-1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 10
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 11
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 12
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 13
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 14
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1], // 15
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1], // 16
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 17
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 18
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1], // 19
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, -1], // 20
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1], // 21
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1], // 22
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 23
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, 1, -1, -1], // 24
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1], // 25
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, -1], // 26
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, 1], // 27
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1] // 28
];

navigation.setNodesNumber(29);
navigation.setNavigationMatrix(navMatrix);
navigation.setWeightMatrix(weightMatrix);
navigation.setCurrentDirection(1);

// navigation.buildGraph([
//     { from: 0, to: 1, direction: NavDirection.Right, weight: 40 },
//     { from: 1, to: 2, direction: NavDirection.Right, weight: 40 },
//     { from: 0, to: 3, direction: NavDirection.Down, weight: 50 },
//     { from: 1, to: 4, direction: NavDirection.Down, weight: 50 },
//     { from: 3, to: 4, direction: NavDirection.Right, weight: 40 },
//     { from: 4, to: 5, direction: NavDirection.Right, weight: 40 }
// ]);

// console.log(`travelDFS: ${navigation.algorithmDFS(25, 1).join(', ')}`);
console.log(`travelBFS: ${navigation.algorithmBFS(1, 23).join(', ')}`);
// console.log(`travelDijkstra: ${navigation.algorithmDijkstra(1, 23).join(', ')}`);

// navigation.followLineToNode(GraphTraversal.Dijkstra, 1, {moveSpeed: 70, turnSpeed: 50, Kp: 0.5 });
navigation.followLineByPath(navigation.algorithmBFS(1, 23), null, true);
*/

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