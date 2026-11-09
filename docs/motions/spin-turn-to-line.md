# spinTurnToLine

Поворот на линию с помощью датчиков линии с последующим позиционированием.

## Описание

Робот начинает вращаться в указанную сторону `rotateSide` на месте до тех пор, пока соответствующий датчик не зафиксирует черную линию поля, после чего автоматически запускается процедура позиционирования на линии (`linePositioning`) для точного выравнивания по центру.

Поддерживает работу как со стандартными датчиками цвета LEGO EV3, так и с датчиками освещенности LEGO NXT.

## Сигнатура

```sig
motions.spinTurnToLine(TurnSide.Left, 45, null, false)
```

## Параметры

* **rotateSide** (`TurnSide`): сторона вращения при поиске линии (`TurnSide.Left` или `TurnSide.Right`).
* **v** (`number`): скорость вращения шасси.
* **params** (`params.LinePositioning`, опционально): параметры ПИД-регулятора позиционирования на линии.
* **debug** (`boolean`): вывод отладочной информации на экран.

## Пример

```blocks
motions.spinTurnToLine(TurnSide.Left, 40)
```

## См. также

[linePositioning](github:theb0nny/makecode-ev3-promrobo21/docs/levelings/line-positioning)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
