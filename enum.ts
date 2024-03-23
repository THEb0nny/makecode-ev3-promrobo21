// Перечисление о вариантах работы манипулятора
const enum ClawState {
    Open,
    Close
}

// Перечисление о типах торможения полный вариант
const enum AfterMotion {
    Rolling, // Прокатка
    DecelRolling, // Плавная прокатка
    RollingNoStop, // Прокатка без торможения 
    BreakStop, // Жёсткий тормоз
    NoBreakStop, // Тормоз с инерцией
    NoStop // Не тормозить
}

// Перечисление о типах относительных поворотов
const enum WheelPivot {
    LeftWheel, // Левое колесо
    RightWheel // Правое колесо
}

// Позиция линии при движении по линии
const enum LineLocation {
    Inside,
    Outside
}