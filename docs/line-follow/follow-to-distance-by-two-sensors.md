# lineFollowToDistanceByTwoSensors

Движение по линии на заданную дистанцию в мм по двум датчикам.

## Описание

Робот едет по линии, удерживая положение по двум датчикам (ошибка вычисляется как разность отражений левого и правого датчиков: $error = refLeft - refRight$), строго на заданное расстояние `dist` в миллиметрах.

## Сигнатура

```sig
line_follow.lineFollowToDistanceByTwoSensors(400, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **dist** (`number`): расстояние в мм, которое нужно проехать по линии.
* **actionAfterMotion** (`AfterLineMotion`): действие по достижении дистанции.
* **params** (`params.LineFollow`, опционально): коэффициенты ПИД и скорость.
* **debug** (`boolean`): отладка.

## Пример

Проехать 450 мм по линии со скоростью по умолчанию:

```blocks
line_follow.lineFollowToDistanceByTwoSensors(450, AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToDistanceByOneSensor](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-distance-by-one-sensor),
[rampLineFollowToDistanceByTwoSensors](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/ramp-follow-to-distance)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
