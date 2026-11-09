# accelStartLinearDistMove

Синхронизированное прямолинейное движение с плавным разгоном без остановки.

## Описание

Разгоняет робота от стартовой скорости `vStart` до максимальной скорости `vMax` за дистанцию `accelDist` на общем отрезке `totalDist`. Команда торможения не подаётся — робот продолжает движение вперед на скорости `vMax`, что позволяет бесшовно передать управление следующему алгоритму (например, движению по линии или фиксации перекрёстка).

## Сигнатура

```sig
chassis.accelStartLinearDistMove(20, 70, 300, 100)
```

## Параметры

* **vStart** (`number`): начальная скорость старта.
* **vMax** (`number`): целевая скорость к окончанию участка разгона.
* **totalDist** (`number`): общая длина отрезка в мм.
* **accelDist** (`number`): дистанция разгона в мм.

## Пример

Разгон со старта на базе до крейсерской скорости:

```blocks
chassis.accelStartLinearDistMove(20, 80, 200, 100)
```

## См. также

[decelFinishLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/decel-finish-linear-dist-move),
[rampLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-linear-dist-move)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
