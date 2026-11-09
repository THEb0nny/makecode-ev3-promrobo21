# setLineSensorsRawRefValues

Установка калибровочных значений чёрного и белого для датчиков линии.

## Описание

Калибрует левый и правый датчики линии. Задаёт минимальные («чёрное») и максимальные («белое») сырые показания, на основе которых выполняется математическая нормализация отражённого света в универсальный диапазон от `0%` (чёрный) до `100%` (белый).

## Сигнатура

```sig
sensors.setLineSensorsRawRefValues(2400, 1700, 2000, 1300)
```

## Параметры

* **blackRefRawValLeftSensor** (`number`): сырое значение чёрного для левого сенсора.
* **whiteRefRawValLeftSensor** (`number`): сырое значение белого для левого сенсора.
* **blackRefRawValRightSensor** (`number`): сырое значение чёрного для правого сенсора.
* **whiteRefRawValRightSensor** (`number`): сырое значение белого для правого сенсора.

## Пример

```blocks
sensors.setLineSensorsRawRefValues(2420, 1740, 2004, 1308)
```

## См. также

[getNormalizedReflectionValue](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/get-normalized-reflection-value)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
