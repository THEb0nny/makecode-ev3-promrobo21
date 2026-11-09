# smartPivotTurn

Умный поворот относительно колеса с обратной связью по энкодерам через ПИД-регулятор и фазой дорегулирования.

## Описание

Поворот вокруг выбранного колеса с замкнутым контуром регулирования по энкодеру активного мотора. Неподвижное колесо удерживается в зажатом состоянии (`Braking.Hold`).

## Сигнатура

```sig
chassis.smartPivotTurn(90, WheelPivot.LeftWheel, null, false)
```

## Параметры

* **deg** (`number`): целевой угол поворота в градусах.
* **wheelPivot** (`WheelPivot`): колесо-ось вращения (`WheelPivot.LeftWheel` или `WheelPivot.RightWheel`).
* **params** (`params.LineFollow`, опционально): коэффициенты ПИД и скорость.
* **debug** (`boolean`): вывод отладки на экран блока EV3.

## Пример

```blocks
chassis.smartPivotTurn(90, WheelPivot.LeftWheel)
```

## См. также

[smartSpinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/smart-spin-turn),
[pivotTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/pivot-turn)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
