# setNxtLightSensorsAsLineSensors

Назначение датчиков освещённости LEGO NXT в качестве датчиков линии.

## Описание

Позволяет использовать аналоговые датчики освещённости LEGO NXT вместо датчиков цвета EV3 для высокочастотного считывания линии.

## Сигнатура

```sig
sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight2, sensors.nxtLight3)
```

## Параметры

* **newLeftLineSensor** (`sensors.NXTLightSensor`): датчик освещённости слева (например, `sensors.nxtLight2`).
* **newRightLineSensor** (`sensors.NXTLightSensor`): датчик освещённости справа (например, `sensors.nxtLight3`).

## Пример

```blocks
sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight2, sensors.nxtLight3)
```

## См. также

[setColorSensorsAsLineSensors](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/set-color-sensors-as-line-sensors),
[setLineSensorsRawRefValues](github:theb0nny/makecode-ev3-promrobo21/docs/sensors/set-line-sensors-raw-ref-values)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
