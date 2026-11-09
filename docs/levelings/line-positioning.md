# linePositioning

Позиционирование (центрирование) датчиками на линии.

## Описание

Поворот на месте для сведения к нулю разности между показаниями левого и правого датчиков ($refLeft - refRight = 0$). Применяется для центрирования робота вдоль линии перед стартом движения или после резкого поворота на линию.

## Сигнатура

```sig
levelings.linePositioning(500, null, false)
```

## Параметры

* **regTime** (`number`): время регулирования в миллисекундах.
* **params** (`params.LinePositioning`, опционально): коэффициенты ПИД и ограничение скорости.
* **debug** (`boolean`): отладка.

## Пример

```blocks
levelings.linePositioning(300)
```

## См. также

[lineAlignment](github:theb0nny/makecode-ev3-promrobo21/docs/levelings/line-alignment)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
