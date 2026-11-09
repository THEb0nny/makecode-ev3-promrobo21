# getNormalizedReflectionValue

Получение нормализованного значения отражения с датчика линии ($0..100\%$).

## Описание

Возвращает процент отражённого света от выбранного датчика:
* `0%` — абсолютно чёрная линия поля;
* `100%` — белое поле.

Значение рассчитывается по калибровочным порогам, установленным через `setLineSensorsRawRefValues`.

## Сигнатура

```sig
let reflection = sensors.getNormalizedReflectionValue(LineSensor.Left, false)
```

## Параметры

* **sensor** (`LineSensor`): опрашиваемый датчик (`LineSensor.Left` или `LineSensor.Right`).
* **recalibrate** (`boolean`, опционально): режим автокалибровки при вызове (по умолчанию `false`).

## Возвращаемое значение

* Число (`number`) от `0` до `100`.

## Пример

```blocks
let leftRef = sensors.getNormalizedReflectionValue(LineSensor.Left)
brick.showValue("LeftRef", leftRef, 1)
```

## См. также

[setLineSensorsRawRefValues](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/set-line-sensors-raw-ref-values)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
