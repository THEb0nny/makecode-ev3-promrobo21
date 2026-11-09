# convertHsvlToColorNum

Определение соревновательного номера цвета по вектору HSVL.

## Описание

Анализирует координаты цветового пространства HSVL (`[Hue, Saturation, Value, Lightness]`) и сопоставляет их с порогами `boundaries`, возвращая идентификатор обнаруженного цвета объекта.

Номера цветов:
* `1` — Чёрный (Black)
* `2` — Синий (Blue)
* `3` — Зелёный (Green)
* `4` — Жёлтый (Yellow)
* `5` — Красный (Red)
* `6` — Белый (White)
* `7` — Коричневый (Brown)
* `0` — Пусто / цвет не распознан (None)

## Сигнатура

```sig
let colorId = sensors.convertHsvlToColorNum([120, 80, 70, 60], boundaries)
```

## Параметры

* **hsvl** (`number[]`): массив из 4 элементов `[H, S, V, L]`.
* **boundaries** (`ColorBoundaries`): структура настроенных границ распознавания цветов.

## Возвращаемое значение

* Число (`number`) от `0` до `7`.

## Пример

```blocks
let hsvl = sensors.getColorSensorHsvl(sensors.color4)
let bounds = sensors.getHsvlToColorNumBoundariesColorSensor(sensors.color4)
let colorNum = sensors.convertHsvlToColorNum(hsvl, bounds)
```

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
