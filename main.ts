let MANIPULATOR_MOTOR_1 = motors.mediumA; // Ссылка на объект мотора манипулятора
let MANIPULATOR_MOTOR_2 = motors.mediumD; // Ссылка на объект мотора манипулятора
//let CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
let CHASSIS_L_MOTOR = motors.largeB; // Ссылка на объект левого мотора в шасси
let CHASSIS_R_MOTOR = motors.largeC; // Ссылка на объект правого мотора в шасси

let L_COLOR_SEN = sensors.color2; // Ссылка на объект левого датчика цвета
let R_COLOR_SEN = sensors.color3; // Ссылка на объект правого датчика цвета
let M_COLOR_SEN: sensors.ColorSensor = undefined; // Ссылка на объект центрального датчика цвета sensors.ColorSensor = undefined;
let CHECK_COLOR_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let B_REF_RAW_LCS = 650; // Сырое значение на чёрном для левого датчика цвета
let W_REF_RAW_LCS = 500; // Сырое значение на белом для левого датчика цвета
let B_REF_RAW_RCS = 650; // Сырое значение на чёрном для правого датчика цвета
let W_REF_RAW_RCS = 500; // Сырое значение на белом для правого датчика цвета
let B_REF_RAW_MCS = 0; // Сырое значение на чёрном для центрального датчика цвета
let W_REF_RAW_MCS = 0; // Сырое значение на белом для центрального датчика цвета

let WHEELS_D = 56; // Диаметр колёс в мм
let WHEELS_W = 135; // Расстояние между центрами колёс в мм

let DIST_BETWEEN_CS = 25; // Расстояние между датчиками цвета в мм

let LINE_REF_TRESHOLD = 50 // Среднее значение серого (уставка) для определения границы линии
let LW_TRESHOLD = 35; // Пороговое значение определения перекрёстка
let LW_SET_POINT = LINE_REF_TRESHOLD; // Среднее значение серого

let LW_CONDITION_MAX_ERR = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

let ENC_TURN_MAX_ERR_DIFFERENCE = 10; // Пороговое значения ошибки для регулятора умного поворота, что поворот выполнен
let ENC_TURN_MAX_REG_DIFFERENCE = 10; // Пороговое значение регулятора для определения умного поворота
let ENC_TURN_TIME_DEREG = 150; // Время дорегулирования в умном повороте

let ENC_SPIN_TURN_OUT_TIME = 800; // Максимальное время умного поворота относительно центра в мм
let ENC_PIVOT_TURN_OUT_TIME = 1000; // Максимальное время умного поворота относительно колеса в мм

let DIST_ROLLING_AFTER_INTERSECTION = 50; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
let DIST_ROLLING_MOVE_OUT = 20; // Дистанция для прокатки без торможения на перекрёстке в мм

let MANIP_DEFL_SPEED = 40; // Скорость работы манипулятора по умолчанию

function RgbToHsvlConvert(debug: boolean = false) {
    let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
    while (true) {
        let currTime = control.millis(); // Текущее время
        prevTime = currTime; // Новое время в переменную предыдущего времени
        const rgbCS = CHECK_COLOR_CS.rgbRaw();
        const hsvlCS = sensors.RgbToHsvlConverter(rgbCS);
        const color = sensors.HsvToColorNum(hsvlCS);
        if (debug) {
            brick.clearScreen();
            brick.printValue("r", rgbCS[0], 1);
            brick.printValue("g", rgbCS[1], 2);
            brick.printValue("b", rgbCS[2], 3);
            brick.printValue("hue", hsvlCS[0], 5);
            brick.printValue("sat", hsvlCS[1], 6);
            brick.printValue("val", hsvlCS[2], 7);
            brick.printValue("light", hsvlCS[3], 8);
            brick.printValue("color", color, 10);
        }
        control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
    }
}

// Функция для управление манипулятором
function Manipulator(state: ClawState, speed?: number) {
    if (!speed) speed = MANIP_DEFL_SPEED; // Если аргумент не был передан, то за скорость установится значение по умолчанию
    else speed = Math.abs(speed);
    MANIPULATOR_MOTOR_1.setBrake(true); // Устанавливаем ударжание мотора при остановке
    if (state == ClawState.Open) MANIPULATOR_MOTOR_1.run(speed);
    else MANIPULATOR_MOTOR_1.run(-speed);
    loops.pause(20); // Пауза перед началом алгоритма для того, чтобы дать стартануть защите
    while (true) { // Проверяем, что мотор застопорился и не может больше двигаться
        let encA1 = MANIPULATOR_MOTOR_1.angle();
        loops.pause(15); // Задержка между измерениями
        let encA2 = MANIPULATOR_MOTOR_1.angle();
        if (Math.abs(Math.abs(encA2) - Math.abs(encA1)) <= 1) break;
    }
    MANIPULATOR_MOTOR_1.stop(); // Останавливаем мотор
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

    MANIPULATOR_MOTOR_1.setInverted(false); MANIPULATOR_MOTOR_2.setInverted(false); // Установить инверсию для манипулятора, если требуется
    CHASSIS_L_MOTOR.setInverted(false); CHASSIS_R_MOTOR.setInverted(false); // Установка реверсов в шасси

    brick.printString("PRESS ENTER TO RUN", 7, 6); // Вывести на экран сообщение о готовности
    brick.buttonRight.pauseUntil(ButtonEvent.Pressed); // Ожидание нажатия правой кнопки
    brick.clearScreen(); // Очистить экрана

    // Ваш код тут
    // chassis.PivotTurn(90, 50, WheelPivot.LeftWheel);
    // motions.LineFollowToIntersection(AfterMotion.Rolling, { speed: 50, Kp: 0.4 });
}

Main(); // Вызов главной функции