# followLineByPath

Движение по линии по заранее заданному списку узлов маршрута.

## Описание

Последовательно проводит робота по переданному массиву вершин графа `path`. На каждом узле робот автоматически определяет нужный поворот, отслеживает достижение перекрёстка и продолжает движение до финишного узла.

## Сигнатура

```sig
navigation_motions.followLineByPath([0, 10, 11, 12], AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **path** (`number[]`): массив номеров узлов маршрута.
* **actionAfterMotion** (`AfterLineMotion`): действие на финальном узле маршрута.
* **params** (`params.NavLineFollow`, опционально): параметры движения.
* **debug** (`boolean`): отладка.

## Пример

```blocks
navigation_motions.followLineByPath([0, 10, 11], AfterLineMotion.HoldStop)
```

## См. также

[followLineToNode](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/follow-line-to-node)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
