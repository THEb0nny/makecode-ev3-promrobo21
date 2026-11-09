# rampLineFollowToDistanceByTwoSensors

Движение по линии по двум датчикам на дистанцию с ускорением и замедлением.

## Описание

Комбинирует ПИД-регулирование следования по линии с профилем изменения скорости: плавный разгон со стартовой скорости `startV` до максимальной `maxV` на отрезке `accelDist`, движение на круизной скорости и плавное замедление до `finishV` на отрезке `decelDist`. Исключает срыв робота с линии на высоких скоростях.

## Сигнатура

```sig
ramp_line_follow.rampLineFollowToDistanceByTwoSensors(600, 150, 150, MotionBraking.Hold, null, false)
```

## Параметры

* **totalDist** (`number`): общая дистанция пути в мм.
* **accelDist** (`number`): дистанция разгона в мм.
* **decelDist** (`number`): дистанция замедления в мм.
* **braking** (`MotionBraking`): режим торможения (`Hold`, `Coast`, `Continue`).
* **params** (`params.RampLineFollow`, опционально): скорости (`startV`, `maxV`, `finishV`) и коэффициенты ПИД.
* **debug** (`boolean`): отладка.

## Пример

```blocks
ramp_line_follow.rampLineFollowToDistanceByTwoSensors(500, 100, 120, MotionBraking.Hold)
```

## См. также

[rampLineFollowToCrossIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/ramp-follow-to-cross-intersection),
[lineFollowToDistanceByTwoSensors](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-distance-by-two-sensors)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
