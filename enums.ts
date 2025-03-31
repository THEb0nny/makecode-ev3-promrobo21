// Перечисление о вариантах работы захвата
const enum ClawState {
    //% block="open"
    //% block.loc.ru="открыть"
    Open,
    //% block="close"
    //% block.loc.ru="закрыть"
    Close
}

// Перечисление о типах сравнения
const enum Comparison {
    //% block="greater"
    //% block.loc.ru="больше"
    Greater,
    //% block="greater or equal"
    //% block.loc.ru="больше или равно"
    GreaterOrEqual,
    //% block="less"
    //% block.loc.ru="меньше"
    Less,
    //% block="less or equal"
    //% block.loc.ru="меньше или равно"
    LessOrEqual,
    //% block="equals"
    //% block.loc.ru="равно"
    Equal
}

// Перечисление о вариантах выбора датчиков для реагирования
const enum LineSensorSelection {
    //% block="left and right sensor"
    //% block.loc.ru="левым и правым датчиком линии"
    LeftAndRight,
    //% block="left or right sensor"
    //% block.loc.ru="левым или правым датчиком линии"
    LeftOrRight,
    //% block="left sensor"
    //% block.loc.ru="левым датчиком линии"
    OnlyLeft,
    //% block="right sensor"
    //% block.loc.ru="правым датчиком линии"
    OnlyRight
}

// Перечисление о типах торможения полный вариант
const enum AfterMotion {
    //% block="rolling"
    //% block.loc.ru="прокатка"
    Rolling,
    //% block="decel rolling"
    //% block.loc.ru="плавная прокатка"
    DecelRolling,
    //% block="rolling no stop"
    //% block.loc.ru="прокатка без торможения"
    RollingNoStop,
    //% block="brake stop"
    //% block.loc.ru="тормоз с удержанием"
    BreakStop,
    //% block="no break stop"
    //% block.loc.ru="тормоз с инерцией"
    NoBreakStop,
    //% block="no stop"
    //% block.loc.ru="не тормозить"
    NoStop
}

// Перечисление о типах торможения сокращённый вариант
const enum AfterMotionShort {
    //% block="brake stop"
    //% block.loc.ru="тормоз с удержанием"
    BreakStop,
    //% block="no break stop"
    //% block.loc.ru="тормоз с инерцией"
    NoBreakStop,
    //% block="no stop"
    //% block.loc.ru="не тормозить"
    NoStop
}

// Перечисление о расположении линии при движении по линии
const enum LineLocation {
    //% block="inside"
    //% block.loc.ru="изнутри"
    Inside,
    //% block="outside"
    //% block.loc.ru="снаружи"
    Outside
}

// Перечисление о расположении линии от датчиков робота
const enum VerticalLineLocation {
    //% block="front"
    //% block.loc.ru="спереди"
    Front,
    //% block="behind"
    //% block.loc.ru="сзади"
    Behind
}

// Перечисление о датчиках, которые используется для движения по линии
const enum LineSensor {
    //% block="left"
    //% block.loc.ru="левый"
    Left,
    //% block="right"
    //% block.loc.ru="правый"
    Right
}

// Перечисление о перекрёстках
const enum SideIntersection {
    //% block="left inside"
    //% block.loc.ru="слева изнутри"
    LeftInside,
    //% block="right inside"
    //% block.loc.ru="справа изнутри"
    RightInside,
    //% block="left inside"
    //% block.loc.ru="слева снаружи"
    LeftOutside,
    //% block="right outside"
    //% block.loc.ru="справа снаружи"
    RightOutside,
}

// Перечисление о движении по линии датчиком
const enum FollowLineSensor {
    //% block="left inside"
    //% block.loc.ru="левым изнутри"
    LeftInside,
    //% block="right inside"
    //% block.loc.ru="правым изнутри"
    RightInside,
    //% block="left"
    //% block.loc.ru="левым снаружи"
    LeftOutside,
    //% block="right outside"
    //% block.loc.ru="правым снаружи"
    RightOutside,
}

// Перечисление о поворотах в сторону
const enum TurnRotateSide {
    //% block="leftward"
    //% block.loc.ru="влево"
    Left,
    //% block="rightward"
    //% block.loc.ru="вправо"
    Right
}

// Перечисление о сторонах
const enum Side {
    //% block="left"
    //% block.loc.ru="лево"
    Left,
    //% block="right"
    //% block.loc.ru="право"
    Right
}

// Перечисление о цветах, переводимых из HSV
const enum SensorColors {
    //% block="empty"
    //% block.loc.ru="Пусто"
    None,
    //% block="black"
    //% block.loc.ru="Чёрный"
    Black,
    //% block="blue"
    //% block.loc.ru="синий"
    Blue,
    //% block="green"
    //% block.loc.ru="зелёный"
    Green,
    //% block="yellow"
    //% block.loc.ru="жёлтый"
    Yellow,
    //% block="red"
    //% block.loc.ru="красный"
    Red,
    //% block="white"
    //% block.loc.ru="белый"
    White,
    //% block="brown"
    //% block.loc.ru="коричневый"
    Brown
}