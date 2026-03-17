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
        const currentDirection = getCurrentDirection(); // Получить направление
        const delta = (inputDirection - currentDirection + 4) % 4; // Считаем разницу направлений в цикле (0..3)
        const turnSteps = delta > 2 ? delta - 4 : delta; // Преобразуем в шаги поворота (-1, 0, 1, 2) для кратчайшего вращения
        const turnDeg = -turnSteps * 90; // Получаем угол поворота
        if (debug) console.log(`inputDir: ${inputDirection}, turnDeg: ${turnDeg}, vTurn: ${v}`);
        if (turnDeg != 0) chassis.spinTurn(turnDeg, v);
        chassis.spinTurn(turnDeg, v); // Поворот относительно центра шасси
        setCurrentDirection(inputDirection); // Установить новое направление
    }

    function processingFollowLineByPathInputParams(params: params.NavLineFollow) {
        if (params.moveStartV >= 0) lineFollowByPathMoveStartV = Math.abs(params.moveStartV);
        if (params.moveMaxV >= 0) lineFollowByPathMoveMaxV = Math.abs(params.moveMaxV);
        if (params.turnV >= 0) lineFollowByPathTurnV = Math.abs(params.turnV);
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
            // directionSpinTurn(navigationMatrix[path[i]][path[i + 1]], lineFollowByPathTurnV); // Поворот
            directionSpinTurn(getDirection(path[i], path[i + 1]), lineFollowByPathTurnV); // Поворот
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: lineFollowByPathMoveMaxV, Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf }); // Движение до перекрёстка
            // currentPosition = path[i + 1]; // Записываем новую позицию в глобальную переменную
            setCurrentPosition(path[i + 1]);
        }
        // currentPosition = newPos; // Записываем новую позицию в глобальную переменную
        setCurrentPosition(newPos);
    }

    /**
     * Движение по линии по пути в виде узлов. Решение от одного из алгоритма нужно передать массивом.
     * @param path путь в виде массива
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.SmoothRolling
     */
    //% blockId="NavigationFollowLineByPath"
    //% block="line follow along path $path after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии по пути $path с дейвствием после $actionAfterMotion||параметры: $params|отладка $debug"
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
            // const newDirection = navigationMatrix[path[i]][path[i + 1]];
            const newDirection = getDirection(path[i], path[i + 1]);
            // const afterMotion = (i != path.length - 2) && (newDirection == navigationMatrix[path[i + 1]][path[i + 2]]) ? AfterLineMotion.LineContinueRoll : AfterLineMotion.SmoothRolling; // Определяем тип движения после завершения
            const afterMotion =
                (i != path.length - 2) && (newDirection == getDirection(path[i + 1], path[i + 2]))
                    ? AfterLineMotion.LineContinueRoll
                    : actionAfterMotion; // Определяем тип движения после завершения
            if (debug) console.log(`path[${i}]: ${path[i]} -> ${path[i + 1]}, currDir: ${currentDirection}, newDir: ${newDirection}, afterMotion: ${afterMotion}`);
            const directionChanged = currentDirection != newDirection;
            if (directionChanged) directionSpinTurn(newDirection, lineFollowByPathTurnV, debug); // Поворот, если новое направление
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
            // currentPosition = path[i]; // Записываем новую позицию в глобальную переменную
            setCurrentPosition(path[i]);
        }
        // currentPosition = path[path.length - 1]; // Записываем новую последнюю позицию в глобальную переменную
        setCurrentPosition(path[path.length - 1]);
    }

}