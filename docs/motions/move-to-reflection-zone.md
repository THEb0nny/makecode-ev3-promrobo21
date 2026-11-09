# moveToReflectionZone

Движение по направлению с постоянной скоростью до зоны с определённым отражением.

## Описание

Робот едет с заданным рулевым курсом (`turnRatio`) до тех пор, пока выбранные датчики линии не зафиксируют совпадение с пороговым уровнем отраженного света (например, заезд на белую зону поля или наезд на черную полосу).

## Сигнатура

```sig
motions.moveToReflectionZone(0, 50, LineSensorSelection.LeftAndRight, Comparison.LessOrEqual, 25, AfterMotion.HoldStop, false)
```

## Параметры

* **turnRatio** (`number`): соотношение руления (0 — прямо, отрицательное — влево, положительное — вправо).
* **v** (`number`): скорость движения в процентах.
* **sensorsSelection** (`LineSensorSelection`): условие проверки датчиков:
  * `LineSensorSelection.LeftAndRight` — оба датчика должны удовлетворять условию;
  * `LineSensorSelection.LeftOrRight` — хотя бы один из датчиков;
  * `LineSensorSelection.OnlyLeft` — только левый датчик;
  * `LineSensorSelection.OnlyRight` — только правый датчик.
* **refCondition** (`Comparison`): оператор сравнения (`Greater`, `GreaterOrEqual`, `Less`, `LessOrEqual`, `Equal`).
* **refTreshold** (`number`): пороговый процент отражения (0..100).
* **actionAfterMotion** (`AfterMotion`): действие после выхода из зоны (`HoldStop`, `FloatStop`, `NoStop`).
* **debug** (`boolean`): отладка на экран.

## Пример

Движение прямо до наезда обоими датчиками на черную линию (отражение <= 25%):

```blocks
motions.moveToReflectionZone(0, 50, LineSensorSelection.LeftAndRight, Comparison.LessOrEqual, 25, AfterMotion.HoldStop)
```

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
