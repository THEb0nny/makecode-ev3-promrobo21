// Перечисление о вариантах работы манипулятора
const enum ClawState {
    //% block="open"
    //% block.loc.ru="открыть"
    Open,
    //% block="close"
    //% block.loc.ru="закрыть"
    Close
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

// Перечисление о типах относительных поворотов
const enum WheelPivot {
    //% block="left"
    //% block.loc.ru="левого"
    LeftWheel,
    //% block="right"
    //% block.loc.ru="правого"
    RightWheel
}

// Позиция линии при движении по линии
const enum LineLocation {
    //% block="inside"
    //% block.loc.ru="изнутри"
    Inside,
    //% block="outside"
    //% block.loc.ru="снаружи"
    Outside
}

// Перечисление о нахождении линии от датчиков робота
enum MovementOnLine {
    //% block="front"
    //% block.loc.ru="спереди"
    Front,
    //% block="behind"
    //% block.loc.ru="сзади"
    Behind
}