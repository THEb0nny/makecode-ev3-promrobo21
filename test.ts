chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установить моторы в шасси и установить свойства инверсии
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установить параметры регулирования синхронизации моторов шасси
chassis.setWheelDiametr(62.4); // Установить радиус колёс в шасси
chassis.setBaseLength(172); // Установить размер базы шасси
motions.setDistRollingAfterIntersection(50); // Установить дистанцию прокатки после перекрёстка в мм
chassis.setBrakeSettleTime(100); // Время для стабилизации шасси после торможения

sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3); // Установить датчики цвета в качестве датчиков линии
sensors.setLineSensorsRawRefValues(630, 499, 650, 520); // Установить калибровочные значения чёрного и белого левого и правого датчика

const colorSensor = sensors.color4; // Датчик цвета, которым определяем цвет предмета

sensors.setColorSensorMinRgbValues(colorSensor, 1, 1, 1);
sensors.setColorSensorMaxRgbValues(colorSensor, 235, 249, 178);
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

let btnLeftEventDone = false;

brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    if (btnLeftEventDone) return; // Отключаем обработчик
    btnLeftEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    sensors.searchRgbMinMax(colorSensor);
})

function Main() {
    for (let i = 0; i < 10; i ++) { // Предварительно перевести датчик цвета в режим цвета
        colorSensor.rgbRaw();
        pause(10);
    }
    sensors.preparationLineSensor(); // Предварительно подготовить датчики линии

    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ждём нажатия
    music.playTone(262, music.beat(BeatFraction.Half)); // Звук начала

    chassis.linearDistMove(100, 60, MotionBraking.Continue);
    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2 });
    chassis.spinTurn(-90, 60);
    
    motions.lineFollowToDistanceByTwoSensors(200, AfterLineMotion.HoldStop, { v: 60, Kp: 0.2 });
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