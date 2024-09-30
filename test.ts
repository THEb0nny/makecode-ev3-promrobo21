// custom.FunctionsTune(0);
// sensors.SearchRgbMinMaxColorSensors(sensors.color3);


// Установить датчики линии
// sensors.SetColorSensorsAsLineSensors(sensors.color2, sensors.color3);
// sensors.SetNxtLightSensorsAsLineSensors(sensors.nxtLight1, sensors.nxtLight4)

// Установить значения отражения на белом и чёрном для датчика линии
// sensors.SetLineSensorsRawRefValues(2520, 1712, 2420, 1636)

// Установить моторы в шасси и установить свойства инверсии
// chassis.setSeparatelyChassisMotors(motors.mediumB, motors.mediumC, true, false)

// Установить радиус колёс в шасси
// chassis.setWheelRadius(62.4, MeasurementUnit.Millimeters)

// Установить размер базы шасси
// chassis.setBaseLength(185, MeasurementUnit.Millimeters)

// Установить параметры регулирования
// chassis.setSyncRegulatorGains(0.01, 0, 0.5)

// Установить пороговое значение отражения при движении по линии
// motions.SetLineFollowRefTreshold(40)

// Установить дистанцию проезда после определения перекрёстка для прокатки в мм
// motions.SetDistRollingAfterInsetsection(35)

// Установить дистанцию для прокатки на перекрёстке без торможения, чтобы не определять повторно линию
// motions.SetDistRollingAfterIntersectionMoveOut(20)

// Установить dt для циклов регулирования при движении по линии
// motions.SetLineFollowLoopDt(10)


// Установить расстояние между двумя датчиками линии в мм для выравнивания
// levelings.SetDistanceBetweenLineSensors(32)

// Установить dt для циклов регулирования при выравнивания и позиционирования.
// levelings.SetLineAlignmentOrPositioningLoopDt(10)

// Установка сокращённых параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость, Kp, Ki, Kd, и N - фильтр дифференциального регулятора.
// params.SetLineAlignmentShortParams(40, 0.3, 0.3, 0.5, 0.5)