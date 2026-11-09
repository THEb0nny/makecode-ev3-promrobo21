# followLineToNode

Автоматическое движение по линии в целевой узел графа с расчётом маршрута.

## Описание

Главная функция автономной соревновательной навигации. Робот:
1. Вычисляет оптимальный маршрут от текущего положения `getCurrentPosition()` до целевого узла `newPos` по алгоритму `algorithm` (`Dijkstra`, `BFS`, `DFS`).
2. Для каждого шага определяет требуемое курсовое направление и выполняет доворот шасси.
3. Двигается по линии до перекрёстка и отслеживает прохождение промежуточных вершин.
4. По завершении обновляет текущую позицию и ориентацию в модуле навигации.

## Сигнатура

```sig
navigation_motions.followLineToNode(GraphTraversal.Dijkstra, 5, null, false)
```

## Параметры

* **algorithm** (`GraphTraversal`): алгоритм поиска пути (`GraphTraversal.Dijkstra`, `GraphTraversal.BFS`, `GraphTraversal.DFS`).
* **newPos** (`number`): номер целевого узла графа.
* **params** (`params.NavLineFollow`, опционально): параметры движения и ПИД.
* **debug** (`boolean`): вывод отладки.

## Пример

Доехать до зоны разгрузки (узел 12) по алгоритму Дейкстры:

```blocks
navigation_motions.followLineToNode(GraphTraversal.Dijkstra, 12)
```

## См. также

[followLineByPath](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/follow-line-by-path),
[algorithmDijkstra](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/algorithm-dijkstra)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
