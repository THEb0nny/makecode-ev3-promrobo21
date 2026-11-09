# lineAlignmentInMotion

Выравнивание перпендикулярно линии в движении (без остановки).

## Описание

Динамическое выравнивание робота на ходу: при пересечении поперечной линии поля фиксируется энкодер в момент срабатывания первого датчика, затем энкодер в момент срабатывания второго датчика. По разнице пройденного пути $a$ и расстоянию между датчиками $b$ (`setDistanceBetweenLineSensors`) робот тригонометрически вычисляет точный угол перекоса:

$$\alpha = \arctan\left(\frac{a}{b}\right)$$

Затем робот мгновенно выполняет компенсирующий доворот опорным колесом и продолжает движение вперёд.

## Сигнатура

```sig
levelings.lineAlignmentInMotion(35, AfterMotion.HoldStop, false)
```

## Параметры

* **speed** (`number`): скорость движения при выравнивании (рекомендуются невысокие скорости, например 25–40%).
* **actionAfterMotion** (`AfterMotion`): действие после завершения выравнивания.
* **debug** (`boolean`): отладка.

## Обязательное предварительное условие

Перед вызовом необходимо установить межцентровое расстояние между датчиками линии:
```typescript
levelings.setDistanceBetweenLineSensors(32); // например, 32 мм
```

## Пример

```blocks
levelings.lineAlignmentInMotion(30, AfterMotion.NoStop)
```

## См. также

[lineAlignment](github:theb0nny/makecode-ev3-promrobo21/docs/levelings/line-alignment)

```package
promrobo21=github:theb0nny/makecode-ev3-promrobo21
```
