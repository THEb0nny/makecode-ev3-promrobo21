// Перечисление о вариантах работы манипулятора
const enum ClawState {
    //% block="открыть"
    Open,
    //% block="закрыть"
    Close
}

// Перечисление о типах торможения полный вариант
const enum AfterMotion {
    //% block="прокатка"
    Rolling,
    //% block="плавная прокатка"
    DecelRolling,
    //% block="прокатка без торможения"
    RollingNoStop,
    //% block="тормоз с удержанием"
    BreakStop,
    //% block="тормоз с инерцией"
    NoBreakStop,
    //% block="не тормозить"
    NoStop
}

// Перечисление о типах относительных поворотов
const enum WheelPivot {
    //% block="левого"
    LeftWheel,
    //% block="правого"
    RightWheel
}

// Позиция линии при движении по линии
const enum LineLocation {
    //% block="изнутри"
    Inside,
    //% block="снаружи"
    Outside
}