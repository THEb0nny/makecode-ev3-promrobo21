namespace navigation {

    let lineFollowByPathMoveStartV = 30; // Переменная для хранения минимальной скорости на старте при движении по линии двумя датчиками
    let lineFollowByPathMoveMaxV = 60; // Переменная для хранения максимальной скорости при движении по линии двумя датчиками
    let lineFollowByPathTurnV = 60; // Переменная для хранения скорости при завершени при движении по линии двумя датчиками
    let lineFollowByPathAccelStartDist = 0; // Переменная для хранения дистанции плавного ускорения при движения по линии двумя датчиками
    let lineFollowByPathKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKi = 0; // Переменная для хранения коэффицента интегрального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками


    // Поворот с помощью направления навигации
    export function directionSpinTurn(inputDirection: number, v: number, debug: boolean = false) {
        if (inputDirection <= -1) return; // Не валидное значение направления
        const currentDirection = getCurrentDirection(); // Получить направление
        const delta = (inputDirection - currentDirection + 4) % 4; // Считаем разницу направлений в цикле (0..3)
        const turnSteps = delta > 2 ? delta - 4 : delta; // Преобразуем в шаги поворота (-1, 0, 1, 2) для кратчайшего вращения
        const turnDeg = -turnSteps * 90; // Получаем угол поворота
        if (debug) console.log(`inputDir: ${inputDirection}, turnDeg: ${turnDeg}, vTurn: ${v}`);
        if (turnDeg != 0) chassis.spinTurn(turnDeg, v); // Поворот относительно центра шасси
        setCurrentDirection(inputDirection); // Установить новое направление
    }

    /**
     * Поворот робота на относительное количество четвертей (90°).
     * Положительное значение - поворот направо (по часовой), отрицательное - налево (против часовой).
     * @param quarterTurns количество четвертей поворота (-4..4), напр: 1 = +90°, -1 = -90°, 2 = +180°, 3 = +270°, 4 = +360°, eg: 1
     * @param v скорость поворота, eg: 60
     * @param debug отладочный вывод, eg: false
     */
    export function relativeSpinTurn(quarterTurns: number, v: number, debug: boolean = false) {
        const currentDirection = getCurrentDirection(); // Получаем текущее направление
        const newDirection = (currentDirection + quarterTurns + 8) % 4; // +8 для корректной обработки отрицательных значений
        const turnDeg = -quarterTurns * 90; // Угол поворота (знак как в directionSpinTurn)
        if (debug) console.log(`relativeTurn: ${quarterTurns}q (${turnDeg}°), currDir: ${currentDirection} → newDir: ${newDirection}, v: ${v}`);
        chassis.spinTurn(turnDeg, v); // Выполняем поворот
        setCurrentDirection(newDirection); // Обновляем текущее направление
    }

    function processingFollowLineByPathInputParams(params: params.NavLineFollow) {
        if (params.vStartMove >= 0) lineFollowByPathMoveStartV = Math.abs(params.vStartMove);
        if (params.vMaxMove >= 0) lineFollowByPathMoveMaxV = Math.abs(params.vMaxMove);
        if (params.vTurn >= 0) lineFollowByPathTurnV = Math.abs(params.vTurn);
        if (params.accelStartDist >= 0) lineFollowByPathAccelStartDist = Math.abs(params.accelStartDist);
        if (params.Kp >= 0) lineFollowByPathKp = Math.abs(params.Kp);
        if (params.Ki >= 0) lineFollowByPathKi = Math.abs(params.Ki);
        if (params.Kd >= 0) lineFollowByPathKd = Math.abs(params.Kd);
        if (params.Kf >= 0) lineFollowByPathKf = Math.abs(params.Kf);
    }

    /**
     * Движение по линии до точки (вершины) выбранным алгоритмом.
     * @param algorithm алгоритм нахождения пути, eg: GraphTraversal.BFS
     * @param newPos узловая точка, в которую нужно двигаться, eg: 1
     */
    //% blockId="NavigationFollowLineToNode"
    //% block="line follow by algorithm $algorithm to node $newPos||params: $params|debug $debug"
    //% block.loc.ru="движение по линии алгоритмом $algorithm до узловой точки $newPos||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="66"
    //% group="Алгоритм движения"
    export function followLineToNode(algorithm: GraphTraversal, newPos: number, params?: params.NavLineFollow, debug: boolean = false) {
        if (params) processingFollowLineByPathInputParams(params); // Если были переданы параметры
        let path: number[] = []; // Для массива пути, по которому нужно пройти
        if (algorithm == GraphTraversal.DFS) path = algorithmDFS(getCurrentPosition(), newPos); // Алгоритм DFS
        else if (algorithm == GraphTraversal.BFS) path = algorithmBFS(getCurrentPosition(), newPos); // Алгоритм BFS
        else if (algorithm == GraphTraversal.Dijkstra) path = algorithmDijkstra(getCurrentPosition(), newPos); // Алгоритм Дейкрсты
        else return;
        if (debug) console.log(`Target path: ${path.join(', ')}`); // Отладка, вывод пути в консоль
        for (let i = 0; i < path.length - 1; i++) {
            directionSpinTurn(getDirection(path[i], path[i + 1]), lineFollowByPathTurnV); // Поворот
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: lineFollowByPathMoveMaxV, Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf }); // Движение до перекрёстка
            setCurrentPosition(path[i + 1]); // Записываем новую позицию в глобальную переменную
        }
        setCurrentPosition(newPos); // Записываем новую позицию в глобальную переменную
    }

    /**
     * Движение по линии по пути в виде узлов. Решение от одного из алгоритма нужно передать массивом.
     * @param path путь в виде массива
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.SmoothRolling
     */
    //% blockId="NavigationFollowLineByPath"
    //% block="line follow along path $path after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии по пути $path с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="NavLineFollowEmptyParams"
    //% weight="65"
    //% group="Алгоритм движения"
    export function followLineByPath(path: number[], actionAfterMotion: AfterLineMotion, params?: params.NavLineFollow, debug: boolean = false) {
        if (params) processingFollowLineByPathInputParams(params); // Если были переданы параметры
        if (!path || path.length < 2) return; // Если был передан пустой путь или только с начальной точкой
        for (let i = 0; i < path.length - 1; i++) {
            const currentDirection = getCurrentDirection();
            const newDirection = getDirection(path[i], path[i + 1]);
            let afterMotion: AfterLineMotion;
            if (i === path.length - 2) afterMotion = actionAfterMotion; // Последний шаг
            else {
                const nextDirection = getDirection(path[i + 1], path[i + 2]);
                if (newDirection == nextDirection) afterMotion = AfterLineMotion.LineContinueRoll; // Продолжаем в том же направлении
                else afterMotion = AfterLineMotion.SmoothRolling; // Определяем тип движения после завершения
            }
            const directionChanged = currentDirection != newDirection;
            if (directionChanged) directionSpinTurn(newDirection, lineFollowByPathTurnV, debug); // Поворот, если новое направление
            if (debug) console.log(`path[${i}]: ${path[i]} -> ${path[i + 1]}, currDir: ${currentDirection}, newDir: ${newDirection}, afterMotion: ${afterMotion}`);
            if (i == 0 || directionChanged) {
                if (lineFollowByPathAccelStartDist > 0) {
                    motions.rampLineFollowToDistanceByTwoSensors(lineFollowByPathAccelStartDist, lineFollowByPathAccelStartDist, 0, MotionBraking.Continue, {
                        vStart: lineFollowByPathMoveStartV, vMax: lineFollowByPathMoveMaxV,
                        Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                    }); // Движение на расстояние для разгона
                }
                motions.lineFollowToCrossIntersection(afterMotion, {
                    v: lineFollowByPathMoveMaxV,
                    Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                }); // Движение до перекрёстка
            } else {
                motions.lineFollowToCrossIntersection(afterMotion, {
                    v: lineFollowByPathMoveMaxV,
                    Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                }); // Движение до перекрёстка
            }
            setCurrentPosition(path[i + 1]); // Записываем новую позицию в глобальную переменную
        }
    }

}