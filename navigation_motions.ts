namespace navigation {

    let lineFollowByPathMoveStartV = 30; // Переменная для хранения минимальной скорости на старте при движении по линии двумя датчиками
    let lineFollowByPathMoveMaxV = 60; // Переменная для хранения максимальной скорости при движении по линии двумя датчиками
    let lineFollowByPathTurnV = 60; // Переменная для хранения скорости при завершени при движении по линии двумя датчиками
    let lineFollowByPathAccelStartDist = 0; // Переменная для хранения дистанции плавного ускорения при движения по линии двумя датчиками
    let lineFollowByPathKp = 0.5; // Переменная для хранения коэффицента пропорционального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKi = 0; // Переменная для хранения коэффицента интегрального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKd = 0; // Переменная для хранения коэффицента дифференциального регулятора при движения по линии двумя датчиками
    let lineFollowByPathKf = 0; // Переменная для хранения коэффицента фильтра дифференциального регулятора при движения по линии двумя датчиками

    /**
     * Синхронизированный поворот шасси относительно центра на нужное направление с определенной скоростью.
     * Скорость v всегда должна быть положительной (отрицательное значение будет взято по модулю).
     * @param inputDirection направление, eg: 0
     * @param v скорость поворота, eg: 50
     */
    //% blockId="ChassisDirectionSpinTurn"
    //% block="chassis spin turn direction $inputDirection at $v\\%||debug $debug"
    //% block.loc.ru="поворот шасси на направление $inputDirection с $v\\% относительно центра оси колёс||debug $debug"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% debug.shadow="toggleOnOff"
    //% weight="99" blockGap="8"
    //% subcategory="Повороты"
    //% group="Синхронизированные повороты"
    export function directionSpinTurn(inputDirection: number, v: number, debug: boolean = false) {
        if (inputDirection < 0) {
            console.log(`Warning: inputDirection (${inputDirection}) not valid. Return from function!`);
            return; // Не валидное значение направления
        }
        const currentDirection = getCurrentDirection(); // Получить направление
        const delta = (inputDirection - currentDirection + 360) % 360; // Считаем разницу направлений
        const turnDeg = delta > 180 ? 360 - delta : -delta; // Преобразуем в шаги поворота для кратчайшего вращения
        if (debug) console.log(`inputDir: ${inputDirection}, turnDeg: ${turnDeg}, v: ${v}`);
        if (turnDeg != 0) chassis.spinTurn(turnDeg, v); // Поворот относительно центра шасси
        setCurrentDirection(inputDirection); // Установить новое направление
    }

    /**
     * Поворот шасси с плавным разгоном (Ramp) на абсолютное направление.
     */
    export function directionRampSpinTurn(inputDirection: number, vMin: number, vMax: number, accelDeg?: number, decelDeg?: number, timeOut?: number, debug: boolean = false) {
        if (inputDirection < 0) {
            console.log(`Warning: inputDirection (${inputDirection}) not valid. Return from function!`);
            return; // Не валидное значение направления
        }
        const currentDirection = getCurrentDirection(); // Получить направление
        const delta = (inputDirection - currentDirection + 360) % 360; // Считаем разницу направлений
        const turnDeg = delta > 180 ? 360 - delta : -delta; // Преобразуем в шаги поворота для кратчайшего вращения
        if (debug) console.log(`inputDir: ${inputDirection}, turnDeg: ${turnDeg}°, vMin: ${vMin}, vMax: ${vMax}`);
        if (turnDeg != 0) chassis.rampSpinTurn(turnDeg, vMin, vMax); // Поворот относительно центра шасси
        setCurrentDirection(inputDirection); // Установить новое направление
    }

    /**
     * Поворот робота на относительное количество градусов.
     * Положительное значение - поворот направо (по часовой), отрицательное - налево (против часовой).
     * @param relativeDegrees на сколько градусов повернуть , например: +90°, -90°, +180°, +270°, +360°, eg: 90
     * @param v скорость поворота, eg: 60
     * @param debug отладочный вывод, eg: false
     */
    export function relativeSpinTurn(relativeDegrees: number, v: number, debug: boolean = false) {
        const currentDirection = getCurrentDirection(); // Получаем текущее направление
        const newDirection = (currentDirection + relativeDegrees + 720) % 360; // +720 для корректной обработки отрицательных значений
        const turnDeg = -relativeDegrees; // Угол поворота (знак как в directionSpinTurn)
        if (debug) console.log(`relativeSpinTurn: ${relativeDegrees}°, currDir: ${currentDirection} → newDir: ${newDirection}, v: ${v}`);
        if (turnDeg != 0) chassis.spinTurn(turnDeg, v); // Выполняем поворот
        setCurrentDirection(newDirection); // Обновляем текущее направление
    }

    export function relativeRampSpinTurn(relativeDegrees: number, vMin: number, vMax: number, accelDeg?: number, decelDeg?: number, timeOut?: number, debug: boolean = false) {
        const currentDirection = getCurrentDirection(); // Получаем текущее направление
        const newDirection = (currentDirection + relativeDegrees + 720) % 360; // +720 для корректной обработки отрицательных значений
        const turnDeg = -relativeDegrees; // Угол поворота (знак как в directionSpinTurn)
        if (debug) console.log(`relativeSpinTurn: ${relativeDegrees}°, currDir: ${currentDirection} → newDir: ${newDirection}, vMin: ${vMin}, vMax: ${vMax}`);
        if (turnDeg != 0) chassis.rampSpinTurn(turnDeg, vMin, vMax); // Выполняем поворот
        setCurrentDirection(newDirection); // Обновляем текущее направление
    }

    // Определенить параметры движения
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
    //% params.shadow="NavLineFollowEmptyParams"
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
        if (path.length < 2) return;
        followLineByPath(path, AfterLineMotion.SmoothRolling, params, debug); // Передаем управление в более умную функцию followLineByPath
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
        
        for (let i = 0; i < path.length - 1; i++) { // Основной цикл обхода пути: идем по ребрам графа от i к i + 1
            const currentDirection = getCurrentDirection(); // Где робот сейчас
            const newDirection = getDirection(path[i], path[i + 1]); // Куда нужно ехать на текущем шаге
            let afterMotion: AfterLineMotion;
            // Определение логики проезда перекрестка
            if (i === path.length - 2) { // Если это последний сегмент пути, используем действие, заданное пользователем (обычно остановка)
                afterMotion = actionAfterMotion;
            } else { // Если путь продолжается, смотрим направление следующего сегмента
                const nextDirection = getDirection(path[i + 1], path[i + 2]);
                if (newDirection == nextDirection) { // Если путь продолжается, смотрим направление следующего сегмента
                    afterMotion = AfterLineMotion.LineContinueRoll; // Продолжаем в том же направлении
                } else { // Если впереди поворот, притормаживаем (SmoothRolling), чтобы точнее спозиционироваться на узле
                    afterMotion = AfterLineMotion.SmoothRolling; // Определяем тип движения после завершения
                }
            }

            // Проверка необходимости поворота
            const directionChanged = currentDirection != newDirection;
            if (directionChanged) { // Если направление движения изменилось, выполняем поворот на месте перед началом движения
                directionSpinTurn(newDirection, lineFollowByPathTurnV, debug);
            }

            if (debug) console.log(`path[${i}]: ${path[i]} -> ${path[i + 1]}, currDir: ${currentDirection}, newDir: ${newDirection}, afterMotion: ${afterMotion}`);
            
            // Выполнение движения по линии
            if (i == 0 || directionChanged) { // Если это старт пути или мы только что повернули
                if (lineFollowByPathAccelStartDist > 0) { // Используем разгон (Ramp), если задана дистанция
                    motions.rampLineFollowToDistanceByTwoSensors(lineFollowByPathAccelStartDist, lineFollowByPathAccelStartDist, 0, MotionBraking.Continue, {
                        vStart: lineFollowByPathMoveStartV, vMax: lineFollowByPathMoveMaxV,
                        Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                    }); // Движение на расстояние для разгона
                }
                // Основная фаза движения до перекрестка после разгона
                motions.lineFollowToCrossIntersection(afterMotion, {
                    v: lineFollowByPathMoveMaxV,
                    Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                }); // Движение до перекрёстка
            } else {  // Если мы уже едем прямо и скорость сбрасывать не нужно — просто продолжаем ехать до следующего перекрестка
                motions.lineFollowToCrossIntersection(afterMotion, {
                    v: lineFollowByPathMoveMaxV,
                    Kp: lineFollowByPathKp, Ki: lineFollowByPathKi, Kd: lineFollowByPathKd, Kf: lineFollowByPathKf
                }); // Движение до перекрёстка
            }

            setCurrentPosition(path[i + 1]); // Записываем новую позицию в глобальную переменную после успешного доезда фиксируем, что робот теперь находится в новом узле
        }
    }

}