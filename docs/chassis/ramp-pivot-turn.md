# rampPivotTurn

Синхронизированный поворот на нужный угол относительно одного из колёс с ускорением и замедлением.

## Описание

Плавный поворот относительно неподвижного колеса с трапецеидальным профилем скорости активного мотора. Устраняет рывки механизма и соскальзывание опорного колеса.

## Сигнатура

```sig
chassis.rampPivotTurn(WheelPivot.RightWheel, 90, 20, 60, 20, 20, 2000)
```

## Параметры

* **wheelPivot** (`WheelPivot`): колесо-ось (`WheelPivot.LeftWheel` или `WheelPivot.RightWheel`).
* **deg** (`number`): угол поворота в градусах (положительный — вперёд, отрицательный — назад).
* **vMin** (`number`): начальная и конечная минимальная скорость.
* **vMax** (`number`): максимальная скорость в середине дуги поворота.
* **accelDeg** (`number`, опционально): угол участка ускорения (по умолчанию 25% от угла).
* **decelDeg** (`number`, опционально): угол участка замедления (по умолчанию 25% от угла).
* **timeOut** (`number`, опционально): таймаут в миллисекундах.

## Пример

```blocks
chassis.rampPivotTurn(WheelPivot.RightWheel, 90, 20, 60)
```

## См. также

[rampSpinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-spin-turn),
[pivotTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/pivot-turn)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
