# lineAlignment

Выравнивание робота на линии перпендикулярно.

## Описание

Робот использует два независимых ПИД-регулятора (по одному на каждое колесо). Каждый мотор выравнивается по показаниям своего датчика линии. В результате робот ориентируется строго перпендикулярно поперечной линии поля, полностью устраняя угловую ошибку.

## Сигнатура

```sig
levelings.lineAlignment(VerticalLineLocation.Front, 500, null, false)
```

## Параметры

* **lineLocation** (`VerticalLineLocation`): наезд на линию передом или задом:
  * `VerticalLineLocation.Front` — наезд на линию спереди;
  * `VerticalLineLocation.Behind` — движение на линию назад.
* **regulatorTime** (`number`): время дорегулирования (мс), в течение которого регуляторы удерживают линию.
* **params** (`params.LineAlignment`, опционально): коэффициенты ПИД для левой и правой стороны отдельно.
* **debug** (`boolean`): вывод отладки.

## Пример

Выравнивание передом на линии с временем стабилизации 500 мс:

```blocks
levelings.lineAlignment(VerticalLineLocation.Front, 500)
```

## См. также

[linePositioning](github:theb0nny/makecode-ev3-promrobo21/docs/levelings/line-positioning),
[lineAlignmentInMotion](github:theb0nny/makecode-ev3-promrobo21/docs/levelings/line-alignment-in-motion)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
