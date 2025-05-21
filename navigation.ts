namespace navigation {

    let currentPos = 25; // Текущая позиция на узле (местоположение)
    let direction = 2; // Направление для навигации
    let numNodes = 29; // Количество узлов

    // Матрица навигации: 0 - вправо, 1 - вверх, 2 - влево, 3 - вниз
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
        if (debug) {
            console.log(`inputDirection: ${inputDirection}`);
            console.log(`turnDeg: ${turnDeg}`);
        }
        chassis.spinTurn(turnDeg, speed); // Поворот относительно центра шасси
    }

    // Движение до точки (вершины)
    export function moveToNode(newPos: number, movementSpeed: number, turnSpeed: number, debug: boolean = false) {
        const path = algorithmDFS(currentPos, newPos); // Получить матрицу пути, по которому нужно пройти
        if (debug) { // Отладка, вывод пути на экран
            console.log(`Target path: ${path.join(', ')}`);
        }
        for (let i = 0; i < path.length - 1; i++) {
            // brick.showString(`${navMatrix[path[i]][path[i + 1]]}`, i + 4);
            directionSpinTurn(navMatrix[path[i]][path[i + 1]], turnSpeed); // Поворот
            motions.lineFollowToCrossIntersection(AfterMotion.DecelRolling, { speed: movementSpeed, Kp: 0.5, Kd: 0.5 }); // Движение до перекрёстка
        }
        currentPos = newPos; // Записываем новую позицию в глобальную переменную
    }

    export function moveOnPath(path: number[], movementSpeed: number, turnSpeed: number, debug: boolean = false) {
        if (debug) { // Отладка, вывод пути на экран
            console.log(`Target path: ${path.join(', ')}`);
        }
        for (let i = 0; i < path.length - 1; i++) {
            // brick.showString(`${navMatrix[path[i]][path[i + 1]]}`, i + 4);
            directionSpinTurn(navMatrix[path[i]][path[i + 1]], turnSpeed); // Поворот
            motions.lineFollowToCrossIntersection(AfterMotion.DecelRolling, { speed: movementSpeed, Kp: 0.5, Kd: 0.5 }); // Движение до перекрёстка
            currentPos = path[i]; // Записываем новую позицию в глобальную переменную
        }
        currentPos = path[path.length - 1]; // Записываем новую последнюю позицию в глобальную переменную
    }

    // Алгоритм поиска в глубину
    export function algorithmDFS(startNode: number, finishNode: number): number[] {
        let stack: number[] = [startNode]; // Стек для хранения узлов в порядке обхода
        let visited: boolean[] = []; // Для отслеживания посещённых узлов
        let parent: number[] = []; // Для восстановления пути (хранит "родителей")
        let found = false; // Флаг для остановки при нахождении цели

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

}