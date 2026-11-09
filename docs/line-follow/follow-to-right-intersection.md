# lineFollowToRightIntersection

Движение по линии до правого ответвления перекрёстка.

## Описание

Специализированная функция движения по линии до обнаружения перекрёстка справа с учётом расположения линии (`Inside` или `Outside`).

## Сигнатура

```sig
line_follow.lineFollowToRightIntersection(LineLocation.Inside, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **lineLocation** (`LineLocation`): положение линии относительно траектории (`LineLocation.Inside` или `LineLocation.Outside`).
* **actionAfterMotion** (`AfterLineMotion`): действие после обнаружения перекрёстка.
* **params** (`params.LineFollow`, опционально): параметры ПИД-регулятора.
* **debug** (`boolean`): отладка.

## Пример

```blocks
line_follow.lineFollowToRightIntersection(LineLocation.Inside, AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToLeftIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-left-intersection),
[lineFollowToCrossIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-cross-intersection)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
