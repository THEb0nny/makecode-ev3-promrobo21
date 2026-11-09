# lineFollowToCrossIntersection

Движение по линии по двум датчикам до перекрёстка (Т- или Х-образного).

## Описание

Робот удерживает центр линии с помощью ПИД-регулятора рассогласования двух датчиков. Движение продолжается до момента, пока оба датчика одновременно не обнаружат черную линию (перекрёсток). После обнаружения перекрёстка выполняется заданное действие `actionAfterMotion`.

## Сигнатура

```sig
line_follow.lineFollowToCrossIntersection(AfterLineMotion.HoldStop, null, false)
```

## Параметры

* **actionAfterMotion** (`AfterLineMotion`): действие на перекрёстке:
  * `AfterLineMotion.HoldStop` — немедленная остановка с удержанием моторов;
  * `AfterLineMotion.FloatStop` — остановка накатом;
  * `AfterLineMotion.Rolling` — прямолинейная прокатка вперёд на заданную дистанцию;
  * `AfterLineMotion.LineRolling` — прокатка вперёд вдоль линии;
  * `AfterLineMotion.LineSmoothRolling` — плавная прокатка со снижением скорости;
  * `AfterLineMotion.Continue` — продолжение движения без торможения.
* **params** (`params.LineFollow`, опционально): объект настроек скорости и коэффициентов регулятора (`v`, `Kp`, `Ki`, `Kd`, `Kf`).
* **debug** (`boolean`): вывод графиков и ошибок на экран.

## Пример

Движение по линии до перекрёстка и жесткая фиксация:

```blocks
line_follow.lineFollowToCrossIntersection(AfterLineMotion.HoldStop)
```

## См. также

[lineFollowToSideIntersection](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-side-intersection),
[lineFollowToDistanceByTwoSensors](github:theb0nny/makecode-ev3-promrobo21/docs/line-follow/follow-to-distance-by-two-sensors)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
