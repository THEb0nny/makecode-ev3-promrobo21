# lineFollowToLeftIntersection

Движение по линии до левого ответвления перекрёстка.

## Описание

Специализированная функция движения по линии до обнаружения перекрёстка слева с учётом расположения траектории робота (`Inside` или `Outside`).

## Сигнатура

```sig
line_follow.lineFollowToLeftIntersection(LineLocation.Inside, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **lineLocation** (`LineLocation`): положение линии относительно траектории (`LineLocation.Inside` или `LineLocation.Outside`).
* **actionAfterMotion** (`AfterLineMotion`): действие после обнаружения перекрёстка.
* **params** (`params.LineFollow`, опционально): параметры ПИД-регулятора.
* **debug** (`boolean`): отладка.

## Пример

```blocks
line_follow.lineFollowToLeftIntersection(LineLocation.Inside, AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToRightIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-right-intersection),
[lineFollowToCrossIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-cross-intersection)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
