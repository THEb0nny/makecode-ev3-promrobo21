namespace navigation {

    let currentPos = 0; // Текущая позиция на узле (местоположение)
    let direction = 0; // Направление для навигации
    let numNodes = 0; // Количество узлов

    // Матрица смежности в виде навигации: 0 - вправо, 1 - вверх, 2 - влево, 3 - вниз
    let navMatrix: number[][] = [];

    // Матрица весов
    let weightMatrix: number[][] = [];

    /**
     * Установить количество узловых точек.
     * @param newMumNodes количество узлов, eg: 25
     */
    //% blockId="NavigationSetNodesNumber"
    //% block="set nodes number $newMumNodes"
    //% block.loc.ru="установить количество узлов $newMumNodes"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства"
    export function setNodesNumber(newMumNodes: number) {
        numNodes = newMumNodes;
    }

    /**
     * Получить количество узловых точек.
     */
    //% blockId="NavigationGetNodesNumber"
    //% block="get nodes number"
    //% block.loc.ru="получить количество узлов"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства"
    export function getNodesNumber(): number {
        return numNodes;
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
        currentPos = newPos;
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
        return currentPos;
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
        direction = newDirection;
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
        return direction;
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
        navMatrix = newNavMatrix;
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
        return navMatrix;
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
        for (let i = 0; i < numNodes; i++) {
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
                for (let i = numNodes - 1; i >= 0; i--) { // Обход соседей в обратном порядке
                    if (navMatrix[current][i] !== -1 && !visited[i]) {
                        parent[i] = current; // Запоминаем родителя
                        stack.push(i); // Добавляем в стек
                    }
                }
            }
        }

        // Восстановление пути
        if (!found) return []; // Если цель не найдена

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

        // Инициализация массивов
        for (let i = 0; i < numNodes; i++) {
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        while (queue.length > 0) {
            const current = queue.shift();
            if (current === finishNode) break;
            for (let i = 0; i < numNodes; i++) {
                if (navMatrix[current][i] !== -1 && !visited[i]) {
                    visited[i] = true;
                    parent[i] = current;
                    queue.push(i);
                }
            }
        }

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
        for (let i = 0; i < numNodes; i++) {
            dist.push(Infinity); // Infinity символизирует, что путь до узла пока не обнаружен
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        for (let step = 0; step < numNodes; step++) {
            // Находим узел с минимальным расстоянием
            let current = -1;
            let minDist = Infinity;
            for (let i = 0; i < numNodes; i++) {
                if (!visited[i] && dist[i] < minDist) {
                    minDist = dist[i];
                    current = i;
                }
            }

            if (current === -1) break; // Все узлы обработаны
            if (current === finishNode) break; // Достигли цели

            visited[current] = true;
            // Обновляем расстояния до соседей
            for (let i = 0; i < numNodes; i++) {
                const weight = weightMatrix[current][i];
                if (navMatrix[current][i] !== -1 && !visited[i] && weight !== -1) {
                    const newDist = dist[current] + weight;
                    if (newDist < dist[i]) {
                        dist[i] = newDist;
                        parent[i] = current;
                    }
                }
            }
        }

        // Восстановление пути
        if (dist[finishNode] === Infinity) return []; // Пути нет

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
    export function directionSpinTurn(inputDirection: number, speed: number, debug: boolean = false) {
        let turnDeg = 0; // Переменная для значения поворота
        while (true) {
            if (inputDirection > direction && (direction != 0 || inputDirection != 3) || (direction == 3 && inputDirection == 0)) {
                direction += 1; // Изменяем глобальное значение направления
                if (direction > 3) direction = 0; // Если записали направление больше 3, то его сбросить до 0
                turnDeg -= 90; // Добавляем в переменную итогового поворота
            } else if (inputDirection < direction && (direction != 3 || inputDirection != 0) || (direction == 0 && inputDirection == 3)) {
                direction -= 1; // Изменяем глобальное значение направления
                if (direction < 0) direction = 3; // Если записали направление меньше 0, то его сбросить до 3
                turnDeg += 90; // Добавляем в переменную итогового поворота
            } else break; // Иначе поворот не требуется
        }
        if (debug) console.log(`inputDirection: ${inputDirection}, turnDeg: ${turnDeg}`);
        chassis.spinTurn(turnDeg, speed); // Поворот относительно центра шасси
    }

    // Движение до точки (вершины)
    export function followLineToNode(algorithm: GraphTraversal, newPos: number, params: { moveSpeed: number, turnSpeed: number, Kp: number, Ki?: number, Kd?: number}, debug: boolean = false) {
        let path: number[] = []; // Для массива пути, по которому нужно пройти
        if (algorithm == GraphTraversal.DFS) path = algorithmDFS(currentPos, newPos); // Алгоритм DFS
        else if (algorithm == GraphTraversal.BFS) path = algorithmBFS(currentPos, newPos); // Алгоритм BFS
        else if (algorithm == GraphTraversal.Dijkstra) path = algorithmDijkstra(currentPos, newPos); // Алгоритм Дейкрсты
        else return;
        if (debug) console.log(`Target path: ${path.join(', ')}`); // Отладка, вывод пути на экран
        for (let i = 0; i < path.length - 1; i++) {
            directionSpinTurn(navMatrix[path[i]][path[i + 1]], params.turnSpeed); // Поворот
            motions.lineFollowToCrossIntersection(AfterMotion.DecelRolling, { speed: params.moveSpeed, Kp: params.Kp, Ki: params.Ki, Kd: params.Kd }); // Движение до перекрёстка
            currentPos = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPos = newPos; // Записываем новую позицию в глобальную переменную
    }

    // Движение по пути по узлам
    export function followLinePath(path: number[], params: { moveSpeed: number, turnSpeed: number, Kp: number, Ki?: number, Kd?: number }, debug: boolean = false) {
        if (debug) console.log(`Target path: ${path.join(', ')}`); // Отладка, вывод пути на экран
        for (let i = 0; i < path.length - 1; i++) {
            directionSpinTurn(navMatrix[path[i]][path[i + 1]], params.turnSpeed); // Поворот
            motions.lineFollowToCrossIntersection(AfterMotion.DecelRolling, { speed: params.moveSpeed, Kp: params.Kp, Ki: params.Ki, Kd: params.Kd }); // Движение до перекрёстка
            currentPos = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPos = path[path.length - 1]; // Записываем новую последнюю позицию в глобальную переменную
    }

}