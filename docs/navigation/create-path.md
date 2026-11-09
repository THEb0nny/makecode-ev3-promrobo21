# createPath

Создание ребра (пути) между двумя узлами графа.

## Описание

Создаёт двунаправленную связь между узлом `a` и узлом `b` с указанием курсового направления `direction` и веса ребра `weight` (обычно физическая длина линии в мм).

## Сигнатура

```sig
let path = navigation.createPath(0, 10, NavDirection.DownUp, 380)
```

## Параметры

* **a** (`number`): номер первого узла (вершины).
* **b** (`number`): номер второго узла (вершины).
* **direction** (`number`): направление линии (рекомендуется передавать константу `NavDirection`, например `NavDirection.DownUp`, `NavDirection.RightLeft`).
* **weight** (`number`): вес ребра (длина отрезка в мм для расчёта кратчайшего пути Дейкстрой).

## Возвращаемое значение

* Объект `NavPath` для передачи в `buildGraph`.

## Пример

```blocks
let p = navigation.createPath(1, 2, NavDirection.RightLeft, 435)
```

## См. также

[createBranch](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/create-branch),
[buildGraph](github:theb0nny/makecode-ev3-promrobo21/docs/navigation/build-graph)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
