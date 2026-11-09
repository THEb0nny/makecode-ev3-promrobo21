# spinTurn

Синхронизированный поворот шасси относительно центра на нужный угол с определенной скоростью.

## Описание

Поворот на месте: колёса вращаются в противоположные стороны с одинаковой скоростью, вращая робота вокруг центра межколёсной оси. Точность поворота рассчитывается по энкодерам на основе параметров диаметра колёс и базы робота (`setWheelDiametr` и `setBaseLength`).

## Сигнатура

```sig
chassis.spinTurn(90, 50, 2000)
```

## Параметры

* **deg** (`number`): угол поворота в градусах. Положительное значение — поворот вправо, отрицательное — влево.
* **v** (`number`): скорость (мощность) вращения моторов в процентах ($1..100$).
* **timeOut** (`number`, опционально): максимальное время выполнения в мс (защита от застревания).

## Пример

Поворот на 90 градусов вправо со скоростью 50%:

```blocks
chassis.spinTurn(90, 50)
```

## См. также

[pivotTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/pivot-turn),
[rampSpinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/ramp-spin-turn),
[smartSpinTurn](github:theb0nny/makecode-ev3-promrobo21/docs/chassis/smart-spin-turn)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
