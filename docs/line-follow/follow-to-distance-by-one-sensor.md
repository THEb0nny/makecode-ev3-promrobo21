# lineFollowToDistanceByOneSensor

Движение по линии на дистанцию по одному датчику.

## Описание

Следование вдоль одной границы чёрного и белого с помощью одного выбранного сенсора. Позволяет роботу следовать по контурам фигур, одинарным тонким линиям или вдоль одного из краёв широкой полосы.

## Сигнатура

```sig
line_follow.lineFollowToDistanceByOneSensor(300, FollowLineSensor.LeftInside, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **dist** (`number`): дистанция в мм.
* **followLineSensor** (`FollowLineSensor`): режим следования датчиком:
  * `FollowLineSensor.LeftInside` — левым датчиком по внутренней стороне;
  * `FollowLineSensor.RightInside` — правым датчиком по внутренней стороне;
  * `FollowLineSensor.LeftOutside` — левым датчиком по внешней стороне;
  * `FollowLineSensor.RightOutside` — правым датчиком по внешней стороне.
* **actionAfterMotion** (`AfterLineMotion`): действие по завершении.
* **params** (`params.LineFollow`, опционально): коэффициенты ПИД.
* **debug** (`boolean`): отладка.

## Пример

```blocks
line_follow.lineFollowToDistanceByOneSensor(300, FollowLineSensor.LeftInside, AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToDistanceByTwoSensors](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-distance-by-two-sensors)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
