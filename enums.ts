// Перечисление о вариантах работы захвата
const enum ClawState {
    //% block="open"
    //% block.loc.ru="открыть"
    Open,
    //% block="close"
    //% block.loc.ru="закрыть"
    Close
}

// Перечисление о типе больше или меньше
const enum LogicalOperators {
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
const enum HorizontalLineLocation {
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
const enum SideJunctionType {
    //% block="left"
    //% block.loc.ru="слева"
    Left,
    //% block="right"
    //% block.loc.ru="справа"
    Right
}

// Перечисление о поворотах в сторону
enum TurnRotateSide {
    //% block="влево"
    Left,
    //% block="вправо"
    Right
}