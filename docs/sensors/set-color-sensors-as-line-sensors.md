# setColorSensorsAsLineSensors

Назначение датчиков цвета LEGO EV3 в качестве основных датчиков линии.

## Описание

Связывает левый и правый порты датчиков цвета EV3 с алгоритмами следования по линии, выравнивания и позиционирования библиотеки.

## Сигнатура

```sig
sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3)
```

## Параметры

* **newLeftLineSensor** (`sensors.ColorSensor`): датчик цвета, установленный слева (например, `sensors.color2`).
* **newRightLineSensor** (`sensors.ColorSensor`): датчик цвета, установленный справа (например, `sensors.color3`).

## Пример

```blocks
sensors.setColorSensorsAsLineSensors(sensors.color2, sensors.color3)
```

## См. также

[setNxtLightSensorsAsLineSensors](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/set-nxt-light-sensors-as-line-sensors),
[setLineSensorsRawRefValues](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/set-line-sensors-raw-ref-values)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
