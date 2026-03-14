namespace navigation {

    // Интерфейс путей / рёбер
    interface NavPath {
        from: number
        to: number
        direction: number
        weight: number
    }

    let nodesCount = 0; // Количество узлов (вершин)
    
    let navigationMatrix: number[][] = []; // Матрица смежности в виде навигации: -1 - пути нет, 0 - вправо, 1 - вверх, 2 - влево, 3 - вниз
    let weightMatrix: number[][] = []; // Матрица весов путей

    let currentPositon = 0; // Текущая позиция на узле (местоположение)
    let currentDirection = 0; // Направление робота для навигации

    let lineFollowByPathMoveStartV = 30; // Переменная для хранения минимальной скорости на старте при движении по линии двумя датчиками
    let lineFollowByPathMoveMaxV = 50; // Переменная для хранения максимальной скорости при движении по линии двумя датчиками
    let lineFollowByPathTurnV = 60; // Переменная для хранения скорости при завершени при движении по линии двумя датчиками
    let lineFollowByPathAccelStartDist = 0; // Переменная для хранения дистанции плавного ускорения при движения по линии двумя датчиками
    let lineFollowByPathKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKi = 0; // Переменная для хранения коэффицента интегрального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    // Вспомогательная функция, которая проверяет, чтобы массив-матрица была квадратной
    function isSquareMatrix(matrix: number[][], expectedSize: number): boolean {
        if (!matrix || matrix.length !== expectedSize) return false;
        for (let i = 0; i < expectedSize; i++) {
            if (!matrix[i] || matrix[i].length !== expectedSize) return false;
        }
        return true;
    }

    // Вспомогательная функция проверки матрицы-массива на валидные значения
    // function isValidNavMatrix(matrix: number[][]): boolean {
    //     const size = matrix.length;
    //     for (let i = 0; i < size; i++) {
    //         for (let j = 0; j < size; j++) {
    //             const v = matrix[i][j];
    //             if (v < -1 || v > 3) return false;
    //         }
    //     }
    //     return true;
    // }

    /**
     * Установить количество узловых точек.
     * @param newNodesCount количество узлов, eg: 25
     */
    //% blockId="NavigationSetNodesCount"
    //% block="set nodes count $newNodesCount"
    //% block.loc.ru="установить количество узлов $newNodesCount"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства"
    export function setNodesCount(newNodesCount: number) {
        nodesCount = newNodesCount;
        // Создаём сразу нужный размер
        for (let i = 0; i < nodesCount; i++) {
            navigationMatrix[i] = [];
            weightMatrix[i] = [];
            for (let j = 0; j < nodesCount; j++) {
                navigationMatrix[i][j] = -1;
                weightMatrix[i][j] = -1;
            }
        }
    }

    /**
     * Получить количество узловых точек.
     */
    //% blockId="NavigationGetNodesCount"
    //% block="get nodes count"
    //% block.loc.ru="получить количество узлов"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства"
    export function getNodesCount(): number {
        return nodesCount;
    }

    /**
     * Установить текущую позицию на узловой точке.
     * @param newPos новый текущий узел, eg: 0
     */
    //% blockId="NavigationSetCurrentPositon"
    //% block="set node position $newPos"
    //% block.loc.ru="установить узловую позицию $newPos"
    //% inlineInputMode="inline"
    //% weight="97"
    //% group="Свойства"
    export function setCurrentPositon(newPos: number) {
        currentPositon = newPos;
    }

    /**
     * Получить текущую позицию на узловой точке.
     */
    //% blockId="NavigationGetCurrentPositon"
    //% block="get current node position"
    //% block.loc.ru="получить текущую узловую позцию"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Свойства"
    export function getCurrentPositon(): number {
        return currentPositon;
    }

    /**
     * Установить текущее направление на узловой точке.
     * @param newDirection новое направление, где 0 - вправо, 1 - вверх, 2 - влево, 3 - вниз, eg: 0
     */
    //% blockId="NavigationSetCurrentDirection"
    //% block="set current direction $newDirection"
    //% block.loc.ru="установить направление $newDirection"
    //% inlineInputMode="inline"
    //% weight="95"
    //% group="Свойства"
    export function setCurrentDirection(newDirection: number) {
        currentDirection = newDirection;
    }

    /**
     * Получить текущее направление, на узловой точке.
     */
    //% blockId="NavigationGetCurrentDirection"
    //% block="get current direction"
    //% block.loc.ru="получить текущее направление"
    //% inlineInputMode="inline"
    //% weight="94"
    //% group="Свойства"
    export function getCurrentDirection() {
        return currentDirection;
    }
    
    /**
     * Установить матрицу навигаций, т.е. направление движения узловых точек относительно друг друга.
     * @param newNavMatrix новая матрица навигации
     */
    //% blockId="NavigationSetNavigationMatrix"
    //% block="set navigation matrix $newNavMatrix"
    //% block.loc.ru="установить матрицу навигации $newNavMatrix"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Матрица смежности"
    export function setNavigationMatrix(newNavMatrix: number[][]) {
        if (!isSquareMatrix(newNavMatrix, nodesCount)) {
            console.log("Navigation matrix must be square");
            return;
        }
        navigationMatrix = newNavMatrix;
    }

    /**
     * Получить матрицу навигации.
     */
    //% blockId="NavigationGetNavigationMatrix"
    //% block="get navigation matrix"
    //% block.loc.ru="получить матрицу навигации"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Матрица смежности"
    export function getNavigationMatrix(): number[][] {
        return navigationMatrix;
    }

    /**
     * Установить матрицу весов рёбер, т.е. длины путей.
     * @param newWeightMatrix новая матрица весов
     */
    //% blockId="NavigationSetWeightMatrix"
    //% block="set weight matrix $newWeightMatrix"
    //% block.loc.ru="установить матрицу весов $newWeightMatrix"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Матрица смежности"
    export function setWeightMatrix(newWeightMatrix: number[][]) {
        if (!isSquareMatrix(newWeightMatrix, nodesCount)) {
            console.log("Weight matrix must be square");
            return;
        }
        weightMatrix = newWeightMatrix;
    }

    /**
     * Получить матрицу весов рёбер.
     */
    //% blockId="NavigationGetWeightMatrix"
    //% block="get weight matrix"
    //% block.loc.ru="получить матрицу весов"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Матрица смежности"
    export function getWeightMatrix(): number[][] {
        return weightMatrix;
    }

    //% blockId="NavigationCreatePath"
    //% block="path from $fromNode to $toNode direction $direction weight $weight"
    //% weight=90
    export function createPath(fromNode: number, toNode: number, direction: NavDirection, weight: number): NavPath {
        return {
            from: fromNode,
            to: toNode,
            direction: direction,
            weight: weight
        }
    }

    export function buildGraph(paths: NavPath[]) {
        // Очищаем старые матрицы
        for (let i = 0; i < nodesCount; i++) {
            for (let j = 0; j < nodesCount; j++) {
                navigationMatrix[i][j] = -1;
                weightMatrix[i][j] = -1;
            }
        }
        // Заполняем по путям
        for (let path of paths) {
            if (navigationMatrix[path.from][path.to] != -1) console.log("Duplicate path");
            if (path.from < 0 || path.from >= nodesCount) continue;
            if (path.to < 0 || path.to >= nodesCount) continue;
            navigationMatrix[path.from][path.to] = path.direction;
            weightMatrix[path.from][path.to] = path.weight;
        }
    }

    /**
     * Алгоритм поиска в глубину (Depth-first search, DFS).
     * Когда нужен любой путь (без учёта длины / веса) для проверки связности графа.
     */
    //% blockId="GraphTraversalAlgorithmDFS"
    //% block="path of DFS algorithm at start $startNode final $finishNode nodes"
    //% block.loc.ru="путь алгоритмом DFS при начальной $startNode конечной $finishNode узлах"
    //% inlineInputMode="inline"
    //% weight="79"
    //% group="Алгоритм нахождения пути"
    export function algorithmDFS(startNode: number, finishNode: number): number[] {
        let stack: number[] = [startNode]; // Стек для хранения узлов в порядке обхода
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        let found: boolean = false; // Флаг для остановки при нахождении цели

        // Инициализация массивов
        for (let i = 0; i < nodesCount; i++) {
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        while (stack.length > 0 && !found) {
            const current = stack.pop(); // Берём последний узел из стека
            if (current == finishNode) { // Проверка на достижение цели
                found = true;
                break;
            }
            if (!visited[current]) { // Обработка текущего узла
                visited[current] = true; // Помечаем как посещённый
                for (let i = nodesCount - 1; i >= 0; i--) { // Обход соседей в обратном порядке
                    if (navigationMatrix[current][i] !== -1 && !visited[i]) {
                        parent[i] = current; // Запоминаем родителя
                        stack.push(i); // Добавляем в стек
                    }
                }
            }
        }

        if (!found) return []; // Если цель не найдена

        // Восстановление пути
        let path: number[] = [];
        let node = finishNode;
        while (node != -1) {
            path.push(node);
            node = parent[node]; // Двигаемся к началу
        }
        path.reverse(); // Переворачиваем массив
        return path;
    }

    /**
     * Алгоритм поиска в ширину (Breadth-First Search, BFS).
     * Невзвешенный граф + нужен кратчайший по количеству шагов.
     * Например: навигация в лабиринте без "стоимости" поворотов.
     */
    //% blockId="GraphTraversalAlgorithmBFS"
    //% block="path of BFS algorithm at start $startNode final $finishNode nodes"
    //% block.loc.ru="путь алгоритмом BFS при начальной $startNode конечной $finishNode узлах"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Алгоритм нахождения пути"
    export function algorithmBFS(startNode: number, finishNode: number): number[] {
        let queue: number[] = [startNode];
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        visited[startNode] = true;
        let found = false; // Флаг для обнаружения finishNode

        // Инициализация массивов
        for (let i = 0; i < nodesCount; i++) {
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        while (queue.length > 0) {
            const current = queue.shift();
            if (current == finishNode) {
                found = true; // Путь найден
                break;
            }
            for (let i = 0; i < nodesCount; i++) {
                if (navigationMatrix[current][i] != -1 && !visited[i]) {
                    visited[i] = true;
                    parent[i] = current;
                    queue.push(i);
                }
            }
        }

        if (!found) return []; // Если finishNode не найден

        // Восстановление пути (аналогично вашему коду)
        let path: number[] = [];
        let node = finishNode;
        while (node !== -1) {
            path.push(node);
            node = parent[node];
        }
        path.reverse();
        return path;
    }

    /**
     * Алгоритм Дейкстры — это метод нахождения кратчайших путей от одной вершины графа ко всем остальным.
     * Дейкстра гарантированно найдёт оптимальный путь A → C → B. Взвешенный граф (учёт реальных расстояний/весов).
     */
    //% blockId="GraphTraversalAlgorithmDijkstra"
    //% block="path of Dijkstra algorithm at start $startNode final $finishNode nodes"
    //% block.loc.ru="путь алгоритмом Дейкрсты при начальной $startNode конечной $finishNode узлах"
    //% inlineInputMode="inline"
    //% weight="77"
    //% group="Алгоритм нахождения пути"
    export function algorithmDijkstra(startNode: number, finishNode: number): number[] {
        let dist: number[] = []; // Для записи расстояний до узлов
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        dist[startNode] = 0; // Расстояние до старта = 0

        // Инициализация массивов
        for (let i = 0; i < nodesCount; i++) {
            dist.push(Infinity); // Infinity символизирует, что путь до узла пока не обнаружен
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        for (let step = 0; step < nodesCount; step++) {
            // Находим узел с минимальным расстоянием
            let current = -1;
            let minDist = Infinity;
            for (let i = 0; i < nodesCount; i++) {
                if (!visited[i] && dist[i] < minDist) {
                    minDist = dist[i];
                    current = i;
                }
            }

            // Если не нашли подходящий узел или достигли цели
            if (current === -1 || current === finishNode) break;

            visited[current] = true;
            // Обновляем расстояния до соседей
            for (let i = 0; i < nodesCount; i++) {
                const weight = weightMatrix[current][i];
                if (navigationMatrix[current][i] !== -1 && !visited[i] && weight !== -1) {
                    const newDist = dist[current] + weight;
                    if (newDist < dist[i]) {
                        dist[i] = newDist;
                        parent[i] = current;
                    }
                }
            }
        }

        // Проверяем, найден ли путь
        if (parent[finishNode] == -1 && startNode != finishNode) return []; // Пути нет

        // Восстановление пути
        let path: number[] = [];
        let node = finishNode;
        while (node !== -1) {
            path.push(node);
            node = parent[node];
        }
        path.reverse();
        return path;
    }

    // Поворот с помощью направления навигации
    export function directionSpinTurn(inputDirection: number, v: number, debug: boolean = false) {
        let turnDeg = 0; // Переменная для значения поворота
        while (true) {
            if (inputDirection > currentDirection && (currentDirection != 0 || inputDirection != 3) || (currentDirection == 3 && inputDirection == 0)) {
                currentDirection += 1; // Изменяем глобальное значение направления
                if (currentDirection > 3) currentDirection = 0; // Если записали направление больше 3, то его сбросить до 0
                turnDeg -= 90; // Добавляем в переменную итогового поворота
            } else if (inputDirection < currentDirection && (currentDirection != 3 || inputDirection != 0) || (currentDirection == 0 && inputDirection == 3)) {
                currentDirection -= 1; // Изменяем глобальное значение направления
                if (currentDirection < 0) currentDirection = 3; // Если записали направление меньше 0, то его сбросить до 3
                turnDeg += 90; // Добавляем в переменную итогового поворота
            } else break; // Иначе поворот не требуется
        }
        if (debug) console.log(`inputDirection: ${inputDirection}, turnDeg: ${turnDeg}`);
        chassis.spinTurn(turnDeg, v); // Поворот относительно центра шасси
    }

    function processingFollowLineByPathInputParams(params?: params.NavLineFollow) {
        if (params.moveStartV >= 0) lineFollowByPathMoveStartV = Math.abs(params.moveStartV);
        if (params.moveMaxV >= 0) lineFollowByPathMoveMaxV = Math.abs(params.moveMaxV);
        if (params.turnV >= 0) lineFollowByPathTurnV = Math.abs(params.turnV);
        if (params.accelStartDist >= 0) lineFollowByPathAccelStartDist = Math.abs(params.accelStartDist);
        if (params.Kp >= 0) lineFollowByPathKp = Math.abs(params.Kp);
        if (params.Ki >= 0) lineFollowByPathKi = Math.abs(params.Ki);
        if (params.Kd >= 0) lineFollowByPathKd = Math.abs(params.Kd);
        if (params.Kf && params.Kf >= 0) lineFollowByPathKf = Math.abs(params.Kf);
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
    //% weight="69"
    //% group="Алгоритм движения"
    export function followLineToNode(algorithm: GraphTraversal, newPos: number, params?: params.NavLineFollow, debug: boolean = false) {
        if (params) processingFollowLineByPathInputParams(params); // Если были переданы параметры
        let path: number[] = []; // Для массива пути, по которому нужно пройти
        if (algorithm == GraphTraversal.DFS) path = algorithmDFS(currentPositon, newPos); // Алгоритм DFS
        else if (algorithm == GraphTraversal.BFS) path = algorithmBFS(currentPositon, newPos); // Алгоритм BFS
        else if (algorithm == GraphTraversal.Dijkstra) path = algorithmDijkstra(currentPositon, newPos); // Алгоритм Дейкрсты
        else return;
        if (debug) console.log(`Target path: ${path.join(', ')}`); // Отладка, вывод пути в консоль
        for (let i = 0; i < path.length - 1; i++) {
            directionSpinTurn(navigationMatrix[path[i]][path[i + 1]], lineFollowByPathTurnV); // Поворот
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: lineFollowByPathMoveMaxV, Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf }); // Движение до перекрёстка
            currentPositon = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPositon = newPos; // Записываем новую позицию в глобальную переменную
    }

    /**
     * Движение по линии по пути в виде узлов. Решение от одного из алгоритма нужно передать массивом.
     * @param path путь в виде массива
     */
    //% blockId="NavigationFollowLineByPath"
    //% block="line follow along path $path||params: $params|debug $debug"
    //% block.loc.ru="движение по линии по пути $path||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% weight="68"
    //% group="Алгоритм движения"
    export function followLineByPath(path: number[], params?: params.NavLineFollow, debug: boolean = false) {
        if (params) processingFollowLineByPathInputParams(params); // Если были переданы параметры
        for (let i = 0; i < path.length - 1; i++) {
            const newDirection = navigationMatrix[path[i]][path[i + 1]];
            const afterMotion = (newDirection == navigationMatrix[path[i + 1]][path[i + 2]]) && (i != path.length - 2) ? AfterLineMotion.LineContinueRoll : AfterLineMotion.SmoothRolling; // Определяем тип движения после завершения
            if (debug) console.log(`path[${i}]: ${path[i]} -> ${path[i + 1]}, direction: ${currentDirection}, newDirection: ${newDirection}, afterMotion: ${afterMotion}`);
            const directionChanged = currentDirection != newDirection;
            directionSpinTurn(newDirection, lineFollowByPathTurnV); // Поворот
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
            currentPositon = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPositon = path[path.length - 1]; // Записываем новую последнюю позицию в глобальную переменную
    }

}