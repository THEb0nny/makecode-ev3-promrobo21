# steeringUntilFindLine

Руление до момента нахождения линии указанным датчиком.

## Описание

Робот выполняет движение с заданным значением руления `steering` и скоростью `v` до тех пор, пока выбранный датчик `lineSensor` не зафиксирует уровень отражения меньше порогового значения чёрного цвета (`getLineRefThreshold()`).

## Сигнатура

```sig
line_follow.steeringUntilFindLine(LineSensor.Left, -30, 40)
```

## Параметры

* **lineSensor** (`LineSensor`): сенсор, которым ожидается обнаружение линии (`LineSensor.Left` или `LineSensor.Right`).
* **steering** (`number`): значение руления (отрицательное — влево, положительное — вправо).
* **v** (`number`): скорость движения моторов.

## Пример

```blocks
line_follow.steeringUntilFindLine(LineSensor.Right, 25, 45)
```

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
