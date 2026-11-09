# setPosition

Установка мотора на заданную угловую позицию с ПИД-регулятором.

## Описание

Управляет положением дополнительного мотора (манипулятора, стрелы, захвата) по энкодеру. Использует ПИД-регулятор с фильтрацией производной, контролем насыщения и допустимой погрешностью (deadband), а также защитой по таймауту.

## Сигнатура

```sig
motors.setPosition(motors.mediumA, 90, Braking.Hold, null, false)
```

## Параметры

* **motor** (`motors.Motor`): управляемый двигатель (`motors.largeA`, `motors.mediumD` и др.).
* **position** (`number`): целевой угол энкодера в градусах.
* **braking** (`Braking`): режим торможения по завершении (`Braking.Hold`, `Braking.Coast`).
* **params** (`params.MotorRegulator`, опционально): коэффициенты ПИД (`Kp`, `Ki`, `Kd`, `Kf`), таймаут `timeOut` и допуск ошибки `errorThreshold`.
* **debug** (`boolean`): вывод в консоль.

## Пример

Поднять захват на 180 градусов:

```blocks
motors.setPosition(motors.mediumA, 180, Braking.Hold)
```

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
