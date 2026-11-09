# rampLineFollowToCrossIntersection

Движение по линии с разгоном и замедлением до перекрёстка.

## Описание

Движение по линии с плавным набором скорости и плавным сбросом скорости перед перекрёстком. Снижение скорости к концу отрезка позволяет роботам надёжно и без проскока фиксировать перекрёсток на высокой скорости прохождения дистанции.

## Сигнатура

```sig
ramp_line_follow.rampLineFollowToCrossIntersection(600, 150, 150, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **totalDist** (`number`): ожидаемая дистанция до перекрёстка в мм.
* **accelDist** (`number`): дистанция разгона в мм.
* **decelDist** (`number`): дистанция замедления перед перекрёстком в мм.
* **actionAfterMotion** (`AfterLineMotion`): действие на перекрёстке (`HoldStop`, `Rolling`, `LineRolling` и др.).
* **params** (`params.RampLineFollowToCross`, опционально): параметры рампы и ПИД.
* **debug** (`boolean`): отладка.

## Пример

```blocks
ramp_line_follow.rampLineFollowToCrossIntersection(500, 100, 120, AfterLineMotion.HoldStop)
```

## См. также

[rampLineFollowToDistanceByTwoSensors](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/ramp-follow-to-distance),
[lineFollowToCrossIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-cross-intersection)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
