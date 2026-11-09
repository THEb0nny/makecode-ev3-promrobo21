# createBranch

Создание тупикового ответвления от узла графа.

## Описание

Добавляет информацию о наличии тупикового бокового ответвления от узла `node` в направлении `direction`. Это необходимо, чтобы робот при подъезде к перекрёстку корректно определял его тип (например, Т-образный или крестообразный перекрёсток) и не путал поворотные ветви.

## Сигнатура

```sig
let branch = navigation.createBranch(3, NavDirection.Right, 100)
```

## Параметры

* **node** (`number`): номер узла, от которого отходит ответвление.
* **direction** (`number`): направление ответвления (например, `NavDirection.Right`).
* **weight** (`number`, опционально): вес или длина тупика (по умолчанию `1`).

## Пример

```blocks
let branch = navigation.createBranch(3, NavDirection.Right)
```

## См. также

[createPath](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-path),
[buildGraph](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/build-graph)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
