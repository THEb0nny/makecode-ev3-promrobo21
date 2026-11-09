# rollingLineFollowing

Прокатка по линии на короткую дистанцию.

## Описание

Быстрая прокатка робота по линии на заданную дистанцию `rollingDist` со скоростью `v` с поддержанием курса регулятором линии. Часто применяется сразу после фиксации перекрёстка для выезда датчиками за пределы поперечной линии.

## Сигнатура

```sig
line_follow.rollingLineFollowing(LineFollowMode.TwoSensors, 60, 45, AfterMotion.HoldStop, false)
```

## Параметры

* **lineFollowMode** (`LineFollowMode`): режим следования (`TwoSensors`, `LeftSensor`, `RightSensor`).
* **rollingDist** (`number`): дистанция прокатки в мм.
* **v** (`number`): скорость движения.
* **actionAfterMotion** (`AfterMotion`): действие после окончания движения (`HoldStop`, `FloatStop`, `NoStop`).
* **debug** (`boolean`): отладка.

## Пример

Прокатиться вперед по линии на 50 мм после перекрёстка:

```blocks
line_follow.rollingLineFollowing(LineFollowMode.TwoSensors, 50, 40, AfterMotion.HoldStop)
```

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
