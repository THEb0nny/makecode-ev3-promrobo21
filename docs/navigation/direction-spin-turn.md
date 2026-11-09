# directionSpinTurn

Поворот шасси на абсолютное курсовое направление навигационного графа.

## Описание

Вычисляет разность между текущим направлением робота на графе (`getCurrentDirection()`) и целевым углом `inputDirection`, после чего выполняет синхронизированный доворот шасси на минимальный угол (по или против часовой стрелки) и обновляет текущее направление робота.

## Сигнатура

```sig
navigation_motions.directionSpinTurn(NavDirection.Right, 50, false)
```

## Параметры

* **inputDirection** (`number`): целевой угол курса в градусах ($0..360$) или константа `NavDirection` (например, `NavDirection.Right = 0°`, `NavDirection.Up = 90°`, `NavDirection.Left = 180°`, `NavDirection.Down = 270°`).
* **v** (`number`): скорость вращения.
* **debug** (`boolean`): отладка.

## Пример

Повернуться лицом на север поля (угол 90°):

```blocks
navigation_motions.directionSpinTurn(NavDirection.Up, 45)
```

## См. также

[spinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/spin-turn),
[buildGraph](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/build-graph)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
