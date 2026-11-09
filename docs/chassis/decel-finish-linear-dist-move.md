# decelFinishLinearDistMove

Синхронизированное прямолинейное движение с плавным сбросом скорости и настраиваемым завершением.

## Описание

Снижает скорость движения робота от начальной `v` до `vFinish` на отрезке замедления `decelDist` в пределах общего расстояния `totalDist`. По завершении выполняется указанное действие `actionAfterMotion`.

## Сигнатура

```sig
chassis.decelFinishLinearDistMove(70, 20, 250, 100, AfterMotion.HoldStop)
```

## Параметры

* **v** (`number`): начальная скорость движения.
* **vFinish** (`number`): финишная скорость в конце участка торможения.
* **totalDist** (`number`): общая дистанция в мм.
* **decelDist** (`number`): дистанция фазы замедления в мм.
* **actionAfterMotion** (`AfterMotion`): действие после окончания движения:
  * `AfterMotion.HoldStop` — жёсткий тормоз с удержанием;
  * `AfterMotion.FloatStop` — торможение накатом;
  * `AfterMotion.NoStop` — продолжать движение дальше без тормоза.

## Пример

```blocks
chassis.decelFinishLinearDistMove(80, 20, 200, 120, AfterMotion.HoldStop)
```

## См. также

[accelStartLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/accel-start-linear-dist-move),
[rampLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-linear-dist-move)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
