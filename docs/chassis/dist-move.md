# distMove

Движение на расстояние в мм с независимыми скоростями на моторы (движение по дуге).

## Описание

Позволяет роботу перемещаться на заданную дистанцию по дуге с фиксированным радиусом за счёт разницы скоростей левого и правого мотора. Обе скорости должны быть положительными и больше нуля.

## Сигнатура

```sig
chassis.distMove(150, 40, 70, MotionBraking.Hold)
```

## Параметры

* **dist** (`number`): дистанция движения в мм. Знак определяет направление: положительное — вперёд, отрицательное — назад.
* **vLeft** (`number`): скорость левого мотора в процентах ($1..100$).
* **vRight** (`number`): скорость правого мотора в процентах ($1..100$).
* **braking** (`MotionBraking`): тип торможения (`MotionBraking.Hold`, `MotionBraking.Coast`, `MotionBraking.Continue`).

## Пример

В этом примере робот совершает плавное дуговое движение вправо на 300 мм:

```blocks
chassis.distMove(300, 60, 40, MotionBraking.Hold)
```

## См. также

[linearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/linear-dist-move)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
