const B_REF_RAW_LCS = 650; // Сырое значение на чёрном для левого датчика цвета
const W_REF_RAW_LCS = 500; // Сырое значение на белом для левого датчика цвета
const B_REF_RAW_RCS = 650; // Сырое значение на чёрном для левого датчика цвета
const W_REF_RAW_RCS = 500; // Сырое значение на белом для левого датчика цвета

const LW_TRESHOLD = 35; // Пороговое значение определения перекрёстка
const LW_SET_POINT = 50; // Среднее значение серого

const LW_CONDITION_DETECT_MAX_ERR = 30; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

const LW_KP_2S = 0.5; // Пропорциональный коэффициент регулятора движения по линии двумя датчиками
const LW_KD_2S = 0; // Дифференциальный коэффициент регулятора движения по линии двумя датчиками

const LW_KP_LS = 1; // Пропорциональный коэффициент регулятора движения по линии на левом датчике
const LW_KD_LS = 0; // Дифференциальный коэффициент регулятора движения по линии на левом датчике

const LW_KP_RS = 1; // Пропорциональный коэффициент регулятора движения по линии на правом датчике
const LW_KD_RS = 0; // Дифференциальный коэффициент регулятора движения по линии на правом датчике

const WHEELS_D = 56; // Диаметер колёс
const WHEELS_W = 135; // Расстояние между центрами колёс

const DIST_AFTER_INTERSECTION = 50; // Дистанция для проезда после опредения перекрёстка для прокатки
const DIST_ROLLING_MOVE_OUT = 20; // Дистанция для прокатки без торможения на перекрёстке

const MANIP_DEFL_SPEED = 40; // Скорость работы манипулятора по умолчанию

const MANIPULATOR_MOTOR = motors.mediumA; // Ссылка на объект мотора манипулятора
const CHASSIS_MOTORS = motors.largeBC; // Ссылка на объект моторов в шасси
const CHASSIS_L_MOTOR = motors.largeB; // Ссылка на объект левого мотора в шасси
const CHASSIS_R_MOTOR = motors.largeC; // Ссылка на объект правого мотора в шасси

const L_CS = sensors.color2; // Ссылка на объект левого датчика цвета
const R_CS = sensors.color3; // Ссылка на объект правого датчика цвета
const CHECK_COLOR_CS = sensors.color4; // Ссылка на объект датчика цвета для определения цвета предмета

let lineFollowParams: number[] = [60, 1, 0, 1];

function SetLineFollowParams(speed: number, Kp?: number, Kd?: number) {
    lineFollowParams[0] = speed;
    if (Kp) lineFollowParams[1] = Kp;
    if (Kd) lineFollowParams[3] = Kd;
}

function TestRGBToHSVLConvert() {
    while (true) {
        const rgbCS = CHECK_COLOR_CS.rgbRaw();
        const hsvlCS = sensors.RgbToHsvlConverter(rgbCS);
        const color = sensors.HsvToColorNum(hsvlCS);
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
}

//// Примеры вызовов функций
// LineFollowToIntersaction(50, AfterMotion.Rolling); // Движение по линии до перекрёстка со скоростью 70 и прокаткой
// LineFollowToLeftIntersaction(40, AfterMotion.Rolling); // Движение по линии на правом датчике до перекрёстка слева со скоростью 50 и с прокаткой
// LineFollowToRightIntersaction(40, AfterMotion.Rolling); // Движение по линии на левом датчике до перекрёстка справа со скоростью 60 и с прокаткой
// LineFollowToDist(400, 50, AfterMotion.BreakStop); // Движение по линии на расстояние со скоростью 50 и жёстким торможением после
// SpinTurn(90, 30); // Поворот на 90 градусов вправо на скорости 30
// PivotTurn(90, 40, WheelPivot.LeftWheel); // Вращение на 90 градусов со скоростью 40 относительно левого мотора
// Manipulator(ClawState.Close); // Закрыть манипулятор
// Manipulator(ClawState.Open, 60); // Открыть манипулятор с произвольной скоростью 60

function Main() { // Определение главной функции
    MANIPULATOR_MOTOR.setInverted(false); // Установить инверсию для манипулятора, если требуется
    brick.printString("PRESS ENTER TO RUN", 7, 6); // Вывести на экран сообщение о готовности
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ожидание нажатия центальной кнопки
    brick.clearScreen(); // Очистить экрана
    // Ваш код тут
    TestRGBToHSVLConvert();
}

Main(); // Вызов главной функции