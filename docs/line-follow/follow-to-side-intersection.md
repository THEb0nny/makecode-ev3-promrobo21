# lineFollowToSideIntersection

Движение по линии до бокового перекрёстка (ответвления).

## Описание

Следование по линии до момента, когда один из датчиков зафиксирует боковое ответвление траектории согласно выбранному шаблону `sideIntersection`.

## Сигнатура

```sig
line_follow.lineFollowToSideIntersection(SideIntersection.LeftInside, AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **sideIntersection** (`SideIntersection`): тип ожидаемого бокового перекрёстка:
  * `SideIntersection.LeftInside` — слева изнутри;
  * `SideIntersection.RightInside` — справа изнутри;
  * `SideIntersection.LeftOutside` — слева снаружи;
  * `SideIntersection.RightOutside` — справа снаружи.
* **actionAfterMotion** (`AfterLineMotion`): действие после фиксации ответвления.
* **params** (`params.LineFollow`, опционально): параметры ПИД-регулятора.
* **debug** (`boolean`): отладка.

## Пример

```blocks
line_follow.lineFollowToSideIntersection(SideIntersection.RightInside, AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToCrossIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-cross-intersection),
[lineFollowToLeftIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-left-intersection),
[lineFollowToRightIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-right-intersection)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
