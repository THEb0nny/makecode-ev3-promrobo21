# buildGraph

Построение топологического навигационного графа соревновательного поля.

## Описание

Формирует внутренние матрицы смежности, курсовых направлений и весов путей на основе переданного массива рёбер `paths` (созданных через `createPath` и `createBranch`).

## Сигнатура

```sig
navigation.buildGraph([
    navigation.createPath(0, 1, NavDirection.RightLeft, 300),
    navigation.createBranch(1, NavDirection.Up)
])
```

## Параметры

* **paths** (`NavPath[]`): массив путей и ответвлений между узлами поля.

## Обязательное условие

Перед вызовом `buildGraph` обязательно задайте общее количество узлов графа:
```typescript
navigation.setNodesCount(17);
```

## Пример

```blocks
navigation.setNodesCount(3)
navigation.buildGraph([
    navigation.createPath(0, 1, NavDirection.RightLeft, 350),
    navigation.createPath(1, 2, NavDirection.DownUp, 200)
])
```

## См. также

[createPath](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-path),
[createBranch](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-branch),
[followLineToNode](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/follow-line-to-node)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
