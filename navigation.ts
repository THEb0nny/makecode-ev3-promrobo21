namespace navigation {

    // Интерфейс путей / рёбер
    export interface NavPath {
        a: number
        b?: number
        direction: number
        weight?: number,
        isBranch?: boolean
    }

    let nodesCount: number = 0; // Количество узлов/вершин (перекрёстков)
    
    let navigationMatrix: number[][] = []; // Матрица смежности в виде направлений: -1 - пути нет
    let weightMatrix: number[][] = []; // Матрица весов путей
    let nodeBranches: number[][] = []; // Физические направления дорог/веток из каждого узла

    let currentPosition: number = 0; // Текущая позиция на узле (местоположение)
    let currentDirection: number = 0; // Направление робота для навигации

    const directionMap: { [key: number]: number[] } = {
        [NavDirection.UpDown]: [90, 270], // Туда - вверх, обратно - вниз
        [NavDirection.DownUp]: [270, 90], // Туда - вниз, обратно - вверх
        [NavDirection.RightLeft]: [0, 180], // Туда - вправо, обратно - влево
        [NavDirection.LeftRight]: [180, 0], // Туда - влево, обратно - вправо
        [NavDirection.UpRightDownLeft]: [45, 225], // Диагональ с 45 до 225 и обратно
        [NavDirection.UpLeftDownRight]: [135, 315] // Дионональ с 135 до 315 и обратно
    };

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
        navigationMatrix = [];
        weightMatrix = [];
        nodeBranches = [];
        for (let i = 0; i < nodesCount; i++) {
            navigationMatrix[i] = [];
            weightMatrix[i] = [];
            nodeBranches[i] = [];
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
    //% blockId="NavigationSetCurrentPosition"
    //% block="set node position $newPos"
    //% block.loc.ru="установить узловую позицию $newPos"
    //% inlineInputMode="inline"
    //% weight="97"
    //% group="Свойства"
    export function setCurrentPosition(newPos: number) {
        currentPosition = newPos;
    }

    /**
     * Получить текущую позицию на узловой точке.
     */
    //% blockId="NavigationGetCurrentPosition"
    //% block="get current node position"
    //% block.loc.ru="получить текущую узловую позцию"
    //% inlineInputMode="inline"
    //% weight="96"
    //% group="Свойства"
    export function getCurrentPosition(): number {
        return currentPosition;
    }

    /**
     * Установить текущее направление на узловой точке в градусах.
     * @param newDirection новое направление в градусах (0-360), eg: 90
     */
    //% blockId="NavigationSetCurrentDirection"
    //% block="set current direction $newDirection"
    //% block.loc.ru="установить направление $newDirection"
    //% inlineInputMode="inline"
    //% weight="95"
    //% group="Свойства"
    export function setCurrentDirection(newDirection: number) {
        // Приводим угол к диапазону 0-359
        currentDirection = ((newDirection % 360) + 360) % 360;
    }

    /**
     * Получить текущее направление в градусах, на узловой точке.
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
     * Получить направление из одной узловой точки в другую.
     */
    //% blockId="NavigationGetDirection"
    //% block="get direction from $from to $to"
    //% block.loc.ru="получить направление из $from в $to"
    //% inlineInputMode="inline"
    //% weight="93"
    //% group="Матрица смежности"
    export function getDirection(from: number, to: number): number {
        return navigationMatrix[from][to];
    }
    
    /**
     * Установить матрицу навигаций, т.е. направление движения узловых точек относительно друг друга.
     * @param newNavMatrix новая матрица навигации
     */
    //% blockId="NavigationSetNavigationMatrix"
    //% block="set navigation matrix $newNavMatrix"
    //% block.loc.ru="установить матрицу навигации $newNavMatrix"
    //% inlineInputMode="inline"
    //% weight="79"
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
    //% weight="78"
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
    //% weight="77"
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
    //% weight="76"
    //% group="Матрица смежности"
    export function getWeightMatrix(): number[][] {
        return weightMatrix;
    }

    /**
     * Блок-выбиралка для направлений.
     */
    //% blockId="nav_direction_picker"
    //% block="%direction"
    //% shim=TD_ID
    //% blockHidden=true
    export function _navDirectionPicker(direction: NavDirection): number {
        return direction;
    }
    
    /**
     * Создать ребро графа между узлами a и b.
     * Направление direction указывается в сторону от a к b.
     * @param a первый узел
     * @param b второй узел
     * @param direction направление от a к b
     * @param weight длина дороги в мм (вес ребра)
     */
    //% blockId="NavigationCreatePath"
    //% help=github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-path
    //% block="create path between $a and $b direction $direction weight $weight"
    //% block.loc.ru="создать ребро между $a и $b направление $direction вес $weight"
    //% inlineInputMode="inline"
    //% weight="89"
    //% direction.shadow="nav_direction_picker"
    //% group="Граф"
    export function createPath(a: number, b: number, direction: number, weight: number): NavPath {
        return {
            a: a,
            b: b,
            direction: direction,
            weight: weight,
            isBranch: false
        }
    }

    /**
     * Добавить тупиковую ветку на перекрёстке (дорога никуда не ведёт, но есть на карте).
     * @param node узел, из которого выходит ветка
     * @param direction глобальное направление ветки на карте
     */
    //% blockId="NavigationCreateBranch"
    //% help=github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-branch
    //% block="create dead-end branch at node $node direction $direction"
    //% block.loc.ru="тупиковая ветка на узле $node направление $direction"
    //% inlineInputMode="inline"
    //% weight="88"
    //% direction.shadow="nav_direction_picker"
    //% group="Граф"
    export function createBranch(node: number, direction: number, weight?: number): NavPath {
        return {
            a: node,
            direction: direction,
            weight: 0,
            isBranch: true
        };
    }

    /**
     * Построить граф с помощью дорог (рёбер и тупиковых веток).
     * Заполняет матрицы смежности, весов и списки физических лучей перекрёстков.
     * @param paths массив дорог (createPath) и тупиковых веток (createBranch)
     */
    //% blockId="NavigationBuildGraph"
    //% help=github:theb0nny/makecode-ev3-promrobo21/docs/navigation/build-graph
    //% block="build graph $paths"
    //% block.loc.ru="построить граф $paths"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Граф"
    export function buildGraph(paths: NavPath[]) {
        // Очищаем матрицы навигации, весов и списки физических веток перед построением
        for (let i = 0; i < nodesCount; i++) {
            nodeBranches[i] = []; // Список направлений линий, выходящих из узла i
            for (let j = 0; j < nodesCount; j++) {
                navigationMatrix[i][j] = -1; // -1 означает отсутствие дороги
                weightMatrix[i][j] = -1; // -1 означает отсутствие веса/расстояния
            }
        }

        // Поочерёдно обрабатываем каждое переданное ребро или тупиковую ветку
        for (let path of paths) {
            // Обработка тупиковой ветки (физическая линия на карте есть, но узла на конце нет)
            if (path.isBranch || path.b == null) {
                if (path.a < 0 || path.a >= nodesCount) { // Проверяем, существует ли узел на карте
                    console.log(`FATAL: Branch node index out of range (${path.a})`);
                    continue;
                }
                const normDir = (path.direction % 360 + 360) % 360; // Приводим угол к диапазону 0-359 градусов
                if (nodeBranches[path.a].indexOf(normDir) < 0) { // Приводим угол к диапазону 0-359 градусов
                    nodeBranches[path.a].push(normDir);
                }
                // Записываем длину тупика прямо в матрицу весов на диагональ!
                if (path.weight) {
                    weightMatrix[path.a][path.a] = path.weight;
                }
                continue; // В матрицу смежности не пишем, чтобы алгоритмы поиска пути не строили маршрут в тупик
            }
            // Защита от создания ребра из узла в самого себя (петля)
            if (path.a == path.b) {
                console.log(`Self-loop path ${path.a}`);
                continue;
            }
            // Проверка на выход номеров узлов за границы объявленного количества (nodesCount)
            if (path.a < 0 || path.a >= nodesCount || path.b < 0 || path.b >= nodesCount) {
                console.log(`FATAL: Node index out of range (${path.a} or ${path.b})`);
                continue;
            }
            // Проверка на случайное повторное добавление одного и того же пути (a -> b)
            if (navigationMatrix[path.a][path.b] != -1) {
                console.log(`Duplicate path ${path.a} -> ${path.b}`);
            }

            // Вычисляем безопасный вес: если не задан или <= 0, ставим 1 для Дейкстры
            const edgeWeight = (path.weight != null && path.weight > 0) ? path.weight : 1;

            // Проверяем, является ли направление стандартной двусторонней парой (например, RightLeft, UpDown)
            const pair = directionMap[path.direction];
            if (pair) {
                // ДВУСТОРОННЯЯ ДОРОГА
                // Если путь двусторонний pair[0] (a -> b), pair[1] (b -> a), проверяем и обратное направление
                if (navigationMatrix[path.b][path.a] != -1) { // Проверяем обратное направление на дубликат перед записью
                    console.log(`Duplicate reverse path ${path.b} -> ${path.a}`);
                }
                // Записываем глобальные направления движения в матрицу навигации
                navigationMatrix[path.a][path.b] = pair[0]; // Направление a → b
                navigationMatrix[path.b][path.a] = pair[1]; // Направление b → a
                // Записываем длину ребра в матрицу весов для обоих направлений
                weightMatrix[path.a][path.b] = edgeWeight;
                weightMatrix[path.b][path.a] = edgeWeight;
                // Запоминаем физические направления лучей перекрёстков
                 // Для узла a дорога уходит по направлению pair[0] (добавляем, если ещё нет)
                if (nodeBranches[path.a].indexOf(pair[0]) < 0) {
                    nodeBranches[path.a].push(pair[0]);
                }
                // Для узла b эта же дорога уходит в противоположную сторону pair[1] (добавляем, если ещё нет)
                if (nodeBranches[path.b].indexOf(pair[1]) < 0) {
                    nodeBranches[path.b].push(pair[1]);
                }
            } else if (path.direction >= 0 && path.direction <= 360) {
                // ОДНОСТОРОННЯЯ ДОРОГА (только от a к b)
                // Если в карте нет, значит это одиночный угол (0, 90, 180, 270 или любой другой)
                const dir = path.direction === 360 ? 0 : path.direction; // Если ввели 360, записываем как 0
                navigationMatrix[path.a][path.b] = dir;
                weightMatrix[path.a][path.b] = path.weight;
                // Для узла a добавляем луч в направлении dir (с защитой от дублирования)
                if (nodeBranches[path.a].indexOf(dir) < 0) {
                    nodeBranches[path.a].push(dir);
                }
            } else {
                // Некорректное значение угла (не входит в 0-360 и не найдено в парах)
                // Сообщение для "особо одаренных"
                console.log(`ERROR: Invalid direction ${path.direction} on path ${path.a}->${path.b}. Use 0-360 or standard pairs.`);
                // control.fail("Invalid Navigation Angle") // Чтобы программа вообще зависла с ошибкой на экране
            }
        }
    }

    /**
     * Автоматически определяет тип перекрёстка (Cross, Left, Right) при подъезде к узлу toNode из fromNode.
     */
    export function getApproachNodeType(fromNode: number, toNode: number): NodeType {
        const moveDir = navigationMatrix[fromNode][toNode];
        if (moveDir < 0 || !nodeBranches[toNode]) return NodeType.Cross;
        let hasLeft = false;
        let hasRight = false;
        // Смотрим все физические ветки перекрёстка toNode
        for (let branchDir of nodeBranches[toNode]) {
            // Вычисляем угол ответвления относительно движения робота
            const relAngle = ((branchDir - moveDir) % 360 + 360) % 360;
            // Ответвление слева (в районе 90°: от 45° до 135°)
            if (relAngle >= 45 && relAngle <= 135) {
                hasLeft = true;
            }
            // Ответвление справа (в районе 270°: от 225° до 315°)
            else if (relAngle >= 225 && relAngle <= 315) {
                hasRight = true;
            }
        }
        // Если ветки есть с двух сторон (X-крест или Т-перекрёсток "в упор")
        if (hasLeft && hasRight) {
            return NodeType.Cross; // Eхать 2 датчиками
        }
        // Если ветка только слева
        if (hasLeft) {
            return NodeType.Left; // Kовить левым датчиком
        }
        // Если ветка только справа
        if (hasRight) {
            return NodeType.Right; // Kовить правым датчиком
        }
        // Если боковых веток нет (поворот L или прямой проезд)
        return NodeType.Cross;
    }

    /**
     * Алгоритм поиска в глубину (Depth-first search, DFS).
     * Когда нужен любой путь (без учёта длины / веса) для проверки связности графа.
     */
    //% blockId="GraphTraversalAlgorithmDFS"
    //% block="path of DFS algorithm at start $startNode final $finishNode nodes"
    //% block.loc.ru="путь алгоритмом DFS при начальной $startNode конечной $finishNode узлах"
    //% inlineInputMode="inline"
    //% weight="69"
    //% group="Алгоритм нахождения пути"
    export function algorithmDFS(startNode: number, finishNode: number): number[] {
        if (startNode < 0 || startNode >= nodesCount || finishNode < 0 || finishNode >= nodesCount) return [];

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
                for (let i = nodesCount - 1; i >= 0; i--) { // Обход в обратном порядке чтобы сохранить естественный порядок при использовании стека
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
    //% weight="68"
    //% group="Алгоритм нахождения пути"
    export function algorithmBFS(startNode: number, finishNode: number): number[] {
        if (startNode < 0 || startNode >= nodesCount || finishNode < 0 || finishNode >= nodesCount) return [];

        let queue: number[] = [startNode];
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        let found = false; // Флаг для обнаружения finishNode

        // Инициализация массивов
        for (let i = 0; i < nodesCount; i++) {
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        visited[startNode] = true;

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
    //% help=github:theb0nny/makecode-ev3-promrobo21/docs/navigation/algorithm-dijkstra
    //% block="path of Dijkstra algorithm at start $startNode final $finishNode nodes"
    //% block.loc.ru="путь алгоритмом Дейкрсты при начальной $startNode конечной $finishNode узлах"
    //% inlineInputMode="inline"
    //% weight="67"
    //% group="Алгоритм нахождения пути"
    export function algorithmDijkstra(startNode: number, finishNode: number): number[] {
        if (startNode < 0 || startNode >= nodesCount || finishNode < 0 || finishNode >= nodesCount) return [];

        let dist: number[] = []; // Для записи расстояний до узлов
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")

        // Инициализация массивов
        for (let i = 0; i < nodesCount; i++) {
            dist.push(Infinity); // Infinity символизирует, что путь до узла пока не обнаружен
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        dist[startNode] = 0; // Расстояние до старта = 0

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
}