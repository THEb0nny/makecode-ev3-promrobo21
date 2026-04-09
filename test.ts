chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установить моторы в шасси и установить свойства инверсии
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установить параметры регулирования синхронизации моторов шасси
chassis.setWheelDiametr(62.4); // Установить радиус колёс в шасси
chassis.setBaseLength(172); // Установить размер базы шасси
motions.setDistRollingAfterIntersection(50); // Установить дистанцию прокатки после перекрёстка в мм
chassis.setBrakeSettleTime(100); // Время для стабилизации шасси после торможения

const manipulatorMotor = motors.mediumD;

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
    pause(50);
}

enum ManipulatorState {
    Down,
    Up
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

    chassis.linearDistMove(150, 50, MotionBraking.Continue);
    motions.lineFollowToCrossIntersection(AfterLineMotion.Rolling, { v: 50, Kp: 0.2 });
    chassis.spinTurn(-90, 60);

    // Левая производственная линия
    let color = -1;
    let leftColorZone = -1;
    let leftColorZoneArray = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            motions.lineFollowToDistanceByTwoSensors(200, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        } else {
            motions.lineFollowToDistanceByTwoSensors(120, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        }
        chassis.spinTurn(90, 60);
        chassis.linearDistMove(40, 50, MotionBraking.Hold);

        brick.clearScreen();
        color = CheckColor(500, true);
        brick.clearScreen();
        brick.printValue("color", color, 1);
        VoiceColor(color);

        leftColorZoneArray[i] = color;

        chassis.linearDistMove(-40, 50, MotionBraking.Hold);

        if (i < 3) chassis.spinTurn(-90, 60);
    }
    leftColorZone = custom.mostFrequentNumber(leftColorZoneArray.filter(item => item !== 0));

    chassis.spinTurn(90, 60);
    motions.lineFollowToSideIntersection(SideIntersection.RightInside, AfterLineMotion.Rolling, { v: 50, Kp: 0.6 });

    // Правая производственная линия
    color = -1;
    let rightColorZone = -1;
    let rightColorZoneArray = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            motions.lineFollowToDistanceByTwoSensors(200, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        } else {
            motions.lineFollowToDistanceByTwoSensors(120, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        }
        chassis.spinTurn(-90, 60);
        chassis.linearDistMove(40, 50, MotionBraking.Hold);

        brick.clearScreen();
        color = CheckColor(500, true);
        brick.clearScreen();
        brick.printValue("color", color, 1);
        VoiceColor(color);

        rightColorZoneArray[i] = color;

        chassis.linearDistMove(-40, 50, MotionBraking.Hold);

        if (i < 3) chassis.spinTurn(90, 60);
    }
    rightColorZone = custom.mostFrequentNumber(rightColorZoneArray.filter(item => item !== 0));

    brick.printString(`lColorZoneArr: ${leftColorZoneArray.join(", ")}`, 1);
    brick.printString(`rColorZoneArr: ${rightColorZoneArray.join(", ")}`, 2);
    brick.printValue("leftColorZone", leftColorZone, 4);
    brick.printValue("rightColorZone", rightColorZone, 5);

    chassis.spinTurn(-90, 60);
    motions.lineFollowToSideIntersection(SideIntersection.LeftInside, AfterLineMotion.Rolling, { v: 50, Kp: 0.6 });

    chassis.spinTurn(-90, 60);
    motions.lineFollowToCrossIntersection(AfterLineMotion.Continue, { v: 50, Kp: 0.2 });
    chassis.linearDistMove(300, 50, MotionBraking.Continue);
    motions.lineFollowToCrossIntersection(AfterLineMotion.Rolling, { v: 50, Kp: 0.2 });

    for (let i = 0; i < 3; i++) {
        chassis.spinTurn(90, 60);
        if (i == 0) {
            motions.lineFollowToDistanceByTwoSensors(60, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        } else {
            motions.lineFollowToDistanceByTwoSensors(120, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
        }
        chassis.spinTurn(-90, 60);

        chassis.linearDistMove(40, 50, MotionBraking.Hold);

        brick.clearScreen();
        color = CheckColor(500, true);
        brick.clearScreen();
        brick.printValue("color", color, 1);
        VoiceColor(color);

        let arrayAllZoneColor = [leftColorZone, rightColorZone];

        if (arrayAllZoneColor.indexOf(color) !== -1) { // Кубик нужного цвета
            Manipulator(ManipulatorState.Up, true, 60);
            chassis.linearDistMove(-40, 50, MotionBraking.Hold);
            chassis.spinTurn(-90, 60);
            motions.lineFollowToSideIntersection(SideIntersection.LeftInside, AfterLineMotion.Rolling, { v: 50, Kp: 0.6 });
            chassis.spinTurn(-90, 60);
            motions.lineFollowToCrossIntersection(AfterLineMotion.Continue, { v: 50, Kp: 0.2 });
            chassis.linearDistMove(300, 50, MotionBraking.Continue);
            motions.lineFollowToCrossIntersection(AfterLineMotion.Rolling, { v: 50, Kp: 0.2 });
            let pos = -1;
            if (color == leftColorZone) {
                chassis.spinTurn(-90, 60);
                pos = leftColorZoneArray.indexOf(0);
            } else {
                chassis.spinTurn(90, 60);
                pos = rightColorZoneArray.indexOf(0);
            }
            let distance = 210 + pos * 120;
            motions.lineFollowToDistanceByTwoSensors(distance, AfterLineMotion.HoldStop, { v: 50, Kp: 0.2 });
            brick.printValue("pos", pos, 3);
            brick.printValue("distance", distance, 4);
            if (color == leftColorZone) {
                chassis.spinTurn(90, 60);
            } else {
                chassis.spinTurn(-90, 60);
            }
            chassis.linearDistMove(40, 50, MotionBraking.Hold);
            Manipulator(ManipulatorState.Down, true, 60);
            break;
        } else { // Кубик не совпадает
            chassis.linearDistMove(-40, 50, MotionBraking.Hold);
        }
    }

    // Домой
    chassis.linearDistMove(-40, 50, MotionBraking.Hold);
    if (color == leftColorZone) {
        chassis.spinTurn(90, 60);
        motions.lineFollowToSideIntersection(SideIntersection.RightInside, AfterLineMotion.Rolling, { v: 50, Kp: 0.6 });
    } else {
        chassis.spinTurn(-90, 60);
        motions.lineFollowToSideIntersection(SideIntersection.LeftInside, AfterLineMotion.Rolling, { v: 50, Kp: 0.6 });
    }
    if (color == leftColorZone) {
        chassis.spinTurn(90, 60);
    } else {
        chassis.spinTurn(-90, 60);
    }
    motions.lineFollowToCrossIntersection(AfterLineMotion.Continue, { v: 50, Kp: 0.2 });
    chassis.linearDistMove(150, 50, MotionBraking.Hold);

    music.playSoundEffectUntilDone(sounds.communicationGoodJob); // Гуд жопа
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