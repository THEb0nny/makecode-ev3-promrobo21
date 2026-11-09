# linearDistMove

Линейное синхронизированное движение на расстояние в мм с постоянной скоростью.

## Описание

Робот проезжает заданную дистанцию `dist` по прямой линии. Оба ведущих мотора шасси синхронизируются по энкодерам через внутренний ПИД-регулятор. Для движения вперёд задаётся положительная дистанция, для движения назад — отрицательная.

## Сигнатура

```sig
chassis.linearDistMove(100, 60, MotionBraking.Hold)
```

## Параметры

* **dist** (`number`): дистанция движения в мм (например, `100`). Знак определяет направление: положительное — вперёд, отрицательное — назад.
* **v** (`number`): скорость (мощность) моторов в процентах от `1` до `100` (например, `60`). Всегда берётся по модулю.
* **braking** (`MotionBraking`): тип торможения после завершения:
  * `MotionBraking.Hold` — активное торможение с удержанием позиции;
  * `MotionBraking.Coast` — торможение накатом (выбег);
  * `MotionBraking.Continue` — продолжение движения без торможения.

## Пример

В этом примере робот проезжает 200 мм вперёд со скоростью 60% и удерживает позицию моторов:

```blocks
chassis.linearDistMove(200, 60, MotionBraking.Hold)
```

## См. также

[distMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/dist-move),
[rampLinearDistMove](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-linear-dist-move)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
