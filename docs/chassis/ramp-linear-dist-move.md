# rampLinearDistMove

Линейное движение на заданное расстояние с трапецеидальным профилем скорости (разгон, круизная скорость, замедление).

## Описание

Предотвращает проскальзывание колёс при резком старте и перелёт позиции при торможении. Робот начинает движение со скорости `vStart`, разгоняется до `vMax` на участке `accelDist`, едет на крейсерской скорости, а затем на участке `decelDist` плавно снижает скорость до `vFinish` и останавливается с удержанием (`Braking.Hold`).

## Сигнатура

```sig
chassis.rampLinearDistMove(30, 80, 20, 500, 100, 150)
```

## Параметры

* **vStart** (`number`): начальная скорость движения (в процентах).
* **vMax** (`number`): максимальная (крейсерская) скорость движения (в процентах).
* **vFinish** (`number`): финишная скорость в конце замедления перед остановкой.
* **totalDist** (`number`): общее расстояние в мм. Знак задает направление движения.
* **accelDist** (`number`): длина участка ускорения в мм.
* **decelDist** (`number`): длина участка замедления в мм.

## Условия корректности

* `totalDist >= accelDist + decelDist`
* `vStart <= vMax` и `vFinish <= vMax`

## Пример

```blocks
chassis.rampLinearDistMove(20, 75, 15, 600, 120, 150)
```

## См. также

[accelStartLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/accel-start-linear-dist-move),
[decelFinishLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/decel-finish-linear-dist-move)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
