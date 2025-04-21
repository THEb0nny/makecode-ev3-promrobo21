// custom.functionsTune(0);
// sensors.searchRgbMinMaxColorSensors(sensors.color3);

// Установить датчики линии
// sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3);
// sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight1, sensors.nxtLight4)

// Установить значения отражения на белом и чёрном для датчика линии
// sensors.setLineSensorsRawRefValues(2520, 1712, 2420, 1636)

// Установить моторы в шасси и установить свойства инверсии
// chassis.setChassisMotors(motors.mediumB, motors.mediumC, true, false);

// Установить параметры регулирования синхронизации моторов шасси
// chassis.setSyncRegulatorGains(0.01, 0.001, 0.5);

// Установить стандартную синхронизацию моторов шасси
// chassis.setSpeedRegulated(false);

// Установить радиус колёс в шасси
// chassis.setWheelDiametr(62.4, MeasurementUnit.Millimeters);

// Установить размер базы шасси
// chassis.setBaseLength(172, MeasurementUnit.Millimeters);

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

// Установка сокращённых параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
// params.setLineAlignmentShortParams(40, 0.3, 0.3, 0.5, 0.5)

// brick.buttonEnter.pauseUntil(ButtonEvent.Bumped);
// sensors.searchRgbMinMaxColorSensors(sensors.color4);

// chassis.spinTurn(90, 50);

// chassis.pivotTurn(90, -70, WheelPivot.LeftWheel);

// motors.setPosition(motors.largeA, 45, {maxSpeed: 50, Kp: 1});