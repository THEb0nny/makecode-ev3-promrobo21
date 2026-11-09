# algorithmDijkstra

Поиск оптимального маршрута по графу с помощью алгоритма Дейкстры.

## Описание

Находит кратчайший путь между начальным узлом `startNode` и целевым узлом `finishNode` с учётом весов рёбер (дистанций между перекрёстками). Возвращает последовательный массив номеров узлов.

## Сигнатура

```sig
let route = navigation.algorithmDijkstra(0, 16)
```

## Параметры

* **startNode** (`number`): начальный узел.
* **finishNode** (`number`): конечный целевой узел.

## Возвращаемое значение

* Массив чисел (`number[]`), представляющий цепочку узлов от старта к финишу (например, `[0, 10, 11, 12, 13, 14, 15, 16]`). Если путь не найден, возвращается пустой массив.

## Пример

```blocks
let path = navigation.algorithmDijkstra(navigation.getCurrentPosition(), 5)
```

## См. также

[followLineToNode](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/follow-line-to-node),
[followLineByPath](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/follow-line-by-path)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
