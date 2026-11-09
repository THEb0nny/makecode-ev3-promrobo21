# pivotTurn

Синхронизированный поворот на нужный угол относительно одного из колёс.

## Описание

Одно колесо блокируется (`Braking.Hold`), выполняя роль неподвижной оси, а второе колесо вращается, описывая дугу вокруг первого.

## Сигнатура

```sig
chassis.pivotTurn(WheelPivot.LeftWheel, 90, 50, 2000)
```

## Параметры

* **wheelPivot** (`WheelPivot`): колесо, вокруг которого происходит вращение:
  * `WheelPivot.LeftWheel` — вращение вокруг левого колеса;
  * `WheelPivot.RightWheel` — вращение вокруг правого колеса.
* **deg** (`number`): угол вращения в градусах. Положительное значение — движение вперёд, отрицательное — назад.
* **v** (`number`): скорость вращения активного колеса ($1..100$).
* **timeOut** (`number`, опционально): максимальное время в мс.

## Пример

Поворот вокруг левого колеса на 90 градусов со скоростью 40%:

```blocks
chassis.pivotTurn(WheelPivot.LeftWheel, 90, 40)
```

## См. также

[spinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/spin-turn),
[rampPivotTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-pivot-turn),
[smartPivotTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/smart-pivot-turn)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
