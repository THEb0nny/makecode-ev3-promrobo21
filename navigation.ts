namespace navigation {

    let currentPos = 0; // Текущая позиция на узле (местоположение)
    let direction = 0; // Направление для навигации
    let numNodes = 0; // Количество узлов

    // Матрица смежности в виде навигации: 0 - вправо, 1 - вверх, 2 - влево, 3 - вниз
    let navMatrix: number[][] = [];

    // Матрица весов
    let weightMatrix: number[][] = [];

    export function setNodesNumber(newMumNodes: number) {
        numNodes = newMumNodes;
    }

    export function getNodesNumber(): number {
        return numNodes;
    }

    export function setCurrentPositon(newPos: number) {
        currentPos = newPos;
    }

    export function getCurrentPositon(): number {
        return currentPos;
    }

    export function setCurrentDirection(newDirection: number) {
        direction = newDirection;
    }

    export function setNavigationMatrix(newNavMatrix: number[][]) {
        navMatrix = newNavMatrix;
    }

    export function getNavigationMatrix(): number[][] {
        return navMatrix;
    }

    export function setWeightMatrix(newWeightMatrix: number[][]) {
        weightMatrix = newWeightMatrix;
    }

    export function getWeightMatrix(): number[][] {
        return weightMatrix;
    }
    
    // Алгоритм поиска в глубину
    // Когда нужен любой путь (без учёта длины / веса) для проверки связности графа
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

    // Алгоритм поиска в ширину
    // Невзвешенный граф + нужен кратчайший по количеству шагов
    // Например: навигация в лабиринте без "стоимости" поворотов
    export function algorithmBFS(start: number, finish: number): number[] {
        let queue: number[] = [start];
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        visited[start] = true;

        // Инициализация массивов
        for (let i = 0; i < numNodes; i++) {
            visited.push(false); // Все узлы изначально не посещены
            parent.push(-1); // Специальное значение "нет родителя"
        }

        while (queue.length > 0) {
            const current = queue.shift();
            if (current === finish) break;
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
        let node = finish;
        while (node !== -1) {
            path.push(node);
            node = parent[node];
        }
        path.reverse();
        return path;
    }

    // Дейкстра гарантированно найдёт оптимальный путь A → C → B
    // Взвешенный граф (учёт реальных расстояний/весов)
    export function algorithmDijkstra(start: number, finish: number): number[] {
        let dist: number[] = []; // Для записи расстояний до узлов
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        dist[start] = 0; // Расстояние до старта = 0

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
            if (current === finish) break; // Достигли цели

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
        if (dist[finish] === Infinity) return []; // Пути нет

        let path: number[] = [];
        let node = finish;
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
    export function moveOnLineToNode(algorithm: GraphTraversal, newPos: number, params: { moveSpeed: number, turnSpeed: number, Kp: number, Ki?: number, Kd?: number}, debug: boolean = false) {
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
    export function moveOnPathLine(path: number[], params: { moveSpeed: number, turnSpeed: number, Kp: number, Ki?: number, Kd?: number }, debug: boolean = false) {
        if (debug) console.log(`Target path: ${path.join(', ')}`); // Отладка, вывод пути на экран
        for (let i = 0; i < path.length - 1; i++) {
            directionSpinTurn(navMatrix[path[i]][path[i + 1]], params.turnSpeed); // Поворот
            motions.lineFollowToCrossIntersection(AfterMotion.DecelRolling, { speed: params.moveSpeed, Kp: params.Kp, Ki: params.Ki, Kd: params.Kd }); // Движение до перекрёстка
            currentPos = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPos = path[path.length - 1]; // Записываем новую последнюю позицию в глобальную переменную
    }

}