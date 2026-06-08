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

// Перечисление о типах действий после алгоритма сокращённый вариант
const enum AfterMotion {
    //% block="hold"
    //% block.loc.ru="удержание"
    HoldStop,
    //% block="float"
    //% block.loc.ru="освобождение"
    FloatStop,
    //% block="no stop"
    //% block.loc.ru="не тормозить"
    NoStop
}

// Перечисление о типах действий после алгоритма полный вариант
const enum AfterLineMotion {
    //% block="rolling"
    //% block.loc.ru="прокатка"
    Rolling,
    //% block="smooth rolling"
    //% block.loc.ru="плавная прокатка"
    SmoothRolling,

    //% block="line rolling"
    //% block.loc.ru="прокатка по линии"
    LineRolling,
    //% block="line decel rolling"
    //% block.loc.ru="плавная прокатка по линии"
    LineSmoothRolling,
    //% block="line roll no stop"
    //% block.loc.ru="прокатка по линии без торможения"
    LineContinueRoll,

    //% block="hold stop"
    //% block.loc.ru="тормоз с удержанием"
    HoldStop,
    //% block="float stop"
    //% block.loc.ru="торможение накатом"
    FloatStop,
    //% block="no stop"
    //% block.loc.ru="не тормозить"
    Continue
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

// Перечисление о движении по линии одним из двух датчиков
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

// Перечисление о типе движения по линии
const enum LineFollowMode {
    TwoSensors,
    LeftSensor,
    RightSensor,
}

// Перечисление о поворотах в сторону
const enum TurnSide {
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

// Перечисление о цветах
const enum SensorColors {
    //% block="empty"
    //% block.loc.ru="пусто"
    None,
    //% block="black"
    //% block.loc.ru="чёрный"
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

// Перечисление методов обхода графа
const enum GraphTraversal {
    DFS, // Обход в глубину
    BFS, // Обход в ширину
    //% block.loc.ru="Дейкстра"
    Dijkstra, // Алгоритм Дейкстры (для взвешенных графов)
    //% block="A*"
    // A_STAR // A* (для поиска пути)
}

const enum NavDirection {
    // Одностороние
    //% block="right (0°)"
    //% block.loc.ru="вправо (0°)"
    Right = 0,
    //% block="up-right (45°)"
    //% block.loc.ru="вверх-вправо (45°)"
    UpRight = 45,
    //% block="up (90°)"
    //% block.loc.ru="вверх (90°)"
    Up = 90,
    //% block="up-left (135°)"
    //% block.loc.ru="вверх-влево (135°)"
    UpLeft = 135,
    //% block="left (180°)"
    //% block.loc.ru="влево (180°)"
    Left = 180,
    //% block="down-left (225°)"
    //% block.loc.ru="вниз-влево (225°)"
    DownLeft = 225, // Добавили!
    //% block="down (270°)"
    //% block.loc.ru="вниз (270°)"
    Down = 270,
    //% block="down-right (315°)"
    //% block.loc.ru="вниз-вправо (315°)"
    DownRight = 315,
    // Двусторонние
    //% block="up-down (90°/270°)"
    //% block.loc.ru="вверх-вниз (90°/270°)"
    UpDown = 90270,
    //% block="down-up (270°/90°)"
    //% block.loc.ru="вниз-вверх (270°/90°)"
    DownUp = 270090,
    //% block="right-left (0°/180°)"
    //% block.loc.ru="вправо-влево (0°/180°)"
    RightLeft = 360180,
    //% block="left-right (180°/0°)"
    //% block.loc.ru="влево-вправо (180°/0°)"
    LeftRight = 180360,
    //% block="up/right-down/left (45°/225°)"
    //% block.loc.ru="вверх/вправо-вниз/влево (45°/225°)"
    UpRightDownLeft = 45225,
    //% block="up/left-down/right (135°/315°)"
    //% block.loc.ru="вверх/влево-вниз/вправо (135°/315°)"
    UpLeftDownRight = 135315,
}

const enum NodeType {
    //% block="X-образный"
    //% block.loc.ru="X-образный"
    Cross = 0,
    //% block="T-образный (left)"
    //% block.loc.ru="T-образный (лево)"
    Left = 1,
    //% block="T-образный (right)"
    //% block.loc.ru="T-образный (право)"
    Right = 2
}