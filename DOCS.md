# Документация библиотеки makecode-ev3-promrobo21

Библиотека высокоуровневых алгоритмов и блоков MakeCode для соревновательного робота LEGO Mindstorms EV3 (олимпиады WRO, РРО и др.).

---

## Содержание

1. [Общие сведения и быстрый старт](#1-общие-сведения-и-быстрый-старт)
2. [Модуль `chassis` — Базовое движение и рампы](#2-модуль-chassis--базовое-движение-и-рампы)
3. [Модуль `chassis` (Повороты) — Базовые, рамповые и умные повороты](#3-модуль-chassis-повороты--базовые-рамповые-и-умные-повороты)
4. [Модуль `motions` — Движения до условий и действия](#4-модуль-motions--движения-до-условий-и-действия)
5. [Модуль `line_follow` — Следование по линии](#5-модуль-line_follow--следование-по-линии)
6. [Модуль `ramp_line_follow` — Следование по линии с рампой скоростей](#6-модуль-ramp_line_follow--следование-по-линии-с-рампой-скоростей)
7. [Модуль `levelings` — Выравнивания на линии](#7-модуль-levelings--выравнивания-на-линии)
8. [Модуль `sensors` — Датчики линии и цвета (EV3 и HiTechnic)](#8-модуль-sensors--датчики-линии-и-цвета-ev3-и-hitechnic)
9. [Модули `navigation` и `navigation_motions` — Навигация на графах](#9-модули-navigation-и-navigation_motions--навигация-на-графах)
10. [Модуль `motors` — Позиционирование отдельных двигателей](#10-модуль-motors--позиционирование-отдельных-двигателей)
11. [Вспомогательные модули: `math`, `statistics`, `custom`, `tune`](#11-вспомогательные-модули-math-statistics-custom-tune)
12. [Модуль `params` — Конфигураторы параметров регуляторов](#12-модуль-params--конфигураторы-параметров-регуляторов)
13. [Справочник перечислений (Enums)](#13-справочник-перечислений-enums)

---

## 1. Общие сведения и быстрый старт

### Подключение расширения

Для использования расширения в проекте MakeCode EV3 ([brickcode.org](https://brickcode.org/)):
1. Откройте проект или создайте новый.
2. В меню настроек («шестерёнка») выберите **Расширения** (Extensions).
3. Введите URL репозитория: `https://github.com/theb0nny/makecode-ev3-promrobo21`.

### Базовая инициализация шасси и датчиков

Перед вызовом алгоритмов движения необходимо сконфигурировать геометрию робота и подключенные моторы/датчики:

```typescript
// 1. Конфигурация шасси
chassis.setMotors(motors.largeB, motors.largeC, false, false); // левый мотор, правый мотор, инверсияL, инверсияR
chassis.setWheelDiametr(62.4);  // Диаметр колеса в мм
chassis.setBaseLength(160);     // Расстояние между колесами (колея) в мм
chassis.setBrakeSettleTime(100); // Пауза стабилизации после остановки (мс)

// 2. Коэффициенты синхронизации моторов (ПИД)
chassis.setSyncRegulatorGains(0.005, 0.0001, 0.5);

// 3. Назначение датчиков линии (EV3 Color или NXT Light)
sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight2, sensors.nxtLight3);
// Калибровка сырых значений (черное/белое для каждого датчика)
sensors.setLineSensorsRawRefValues(2400, 1700, 2000, 1300);
```

---

## 2. Модуль `chassis` — Базовое движение и рампы

Модуль отвечает за управление ведущими моторами робота: дифференциальное руление, синхронизированное прямолинейное движение и движение с трапецеидальными профилями скорости (ускорение $\rightarrow$ движение на круизной скорости $\rightarrow$ торможение).

---

### `chassis.regulatorSteering`
Дифференциальное руление шасси от регулятора без нормализации. Подает мощности $v + u$ на левый мотор и $v - u$ на правый мотор.

```typescript
function regulatorSteering(u: number, v: number): void
```

* **Параметры:**
  * `u` (`number`): Управляющее воздействие регулятора (разность мощностей).
  * `v` (`number`): Базовая скорость/мощность движения в процентах.
* **Блок MakeCode:** `руление регулятором на u = $u на $v%`
* **Пример:**
  ```typescript
  chassis.regulatorSteering(15, 60); // Левый мотор: 75%, Правый: 45%
  ```

---

### `chassis.normalizedRegulatorSteering`
Нормализованное руление шасси. Если мощности моторов превышают допустимый предел, масштабирует обе мощности с сохранением их соотношения, удерживая максимальную из них на уровне $v$.

```typescript
function normalizedRegulatorSteering(u: number, v: number): void
```

* **Параметры:**
  * `u` (`number`): Управляющее воздействие регулятора.
  * `v` (`number`): Базовая скорость/мощность движения.
* **Блок MakeCode:** `нормализованное руление регулятором по u = $u на $v%`

---

### `chassis.normalizedRegulatorSteering2`
Альтернативный алгоритм нормализованного руления. Масштабирует мощности моторов только в том случае, если расчетное значение одного из моторов превышает допустимую максимальную скорость $v$. Защищен от деления на ноль.

```typescript
function normalizedRegulatorSteering2(u: number, v: number): void
```

* **Параметры:**
  * `u` (`number`): Управляющее воздействие.
  * `v` (`number`): Базовая скорость.

---

### `chassis.linearDistMove`
Синхронизированное прямолинейное перемещение на заданную дистанцию с постоянной мощностью. Оба мотора синхронизируются по энкодерам.

```typescript
function linearDistMove(dist: number, v: number, braking: MotionBraking): void
```

* **Параметры:**
  * `dist` (`number`): Дистанция в мм. Положительное значение — вперед, отрицательное — назад.
  * `v` (`number`): Скорость (мощность) движения (всегда берется по модулю, $0..100$).
  * `braking` (`MotionBraking`): Режим торможения (`MotionBraking.Hold`, `MotionBraking.Coast`, `MotionBraking.Continue`).
* **Блок MakeCode:** `линейное движение на расстояние $dist мм с $v% торможение $braking`
* **Пример:**
  ```typescript
  chassis.linearDistMove(300, 70, MotionBraking.Hold); // Вперед на 300 мм
  chassis.linearDistMove(-150, 40, MotionBraking.Coast); // Назад на 150 мм
  ```

---

### `chassis.distMove`
Синхронизированное перемещение на расстояние в мм с независимыми скоростями для левого и правого мотора. Позволяет двигаться по дуге с фиксированным радиусом.

```typescript
function distMove(dist: number, vLeft: number, vRight: number, braking: MotionBraking): void
```

* **Параметры:**
  * `dist` (`number`): Дистанция ведущего колеса в мм (знак определяет направление).
  * `vLeft` (`number`): Мощность левого мотора (по модулю).
  * `vRight` (`number`): Мощность правого мотора (по модулю).
  * `braking` (`MotionBraking`): Тип торможения.
* **Блок MakeCode:** `движение на расстояние $dist мм с $vLeft% $vRight% торможение $braking`

---

### `chassis.rampLinearDistMove`
Прямолинейное движение с трапецеидальным профилем скорости (плавный разгон $\rightarrow$ движение на максимальной скорости $\rightarrow$ плавное замедление). Позволяет избегать пробуксовки колес и срыва робота при высоких скоростях.

```typescript
function rampLinearDistMove(
    vStart: number,
    vMax: number,
    vFinish: number,
    totalDist: number,
    accelDist: number,
    decelDist: number
): void
```

* **Параметры:**
  * `vStart` (`number`): Начальная скорость в процентах (старт движения).
  * `vMax` (`number`): Крейсерская максимальная скорость в процентах.
  * `vFinish` (`number`): Финишная скорость в процентах перед остановкой.
  * `totalDist` (`number`): Общая дистанция перемещения в мм (знак задает направление).
  * `accelDist` (`number`): Дистанция участка разгона в мм.
  * `decelDist` (`number`): Дистанция участка замедления в мм.
* **Блок MakeCode:** `линейное движение на расстояние $totalDist мм при ускорении $accelDist замедлении $decelDist c стартовой $vStart% макс $vMax% финишной $vFinish%`
* **Ограничения:** `totalDist >= accelDist + decelDist`. Завершается удержанием (`Braking.Hold`).

---

### `chassis.accelStartLinearDistMove`
Синхронизированное прямолинейное движение только с фазой разгона без торможения. Предназначено для бесшовной стыковки со следующим участком движения на полной скорости.

```typescript
function accelStartLinearDistMove(
    vStart: number,
    vMax: number,
    totalDist: number,
    accelDist: number
): void
```

* **Параметры:**
  * `vStart` (`number`): Начальная скорость.
  * `vMax` (`number`): Целевая скорость к концу разгона.
  * `totalDist` (`number`): Общая дистанция движения в мм.
  * `accelDist` (`number`): Дистанция, за которую робот разгоняется до `vMax`.

---

### `chassis.decelFinishLinearDistMove`
Синхронизированное прямолинейное движение с фазой плавного замедления и настраиваемым завершением (`AfterMotion`).

```typescript
function decelFinishLinearDistMove(
    v: number,
    vFinish: number,
    totalDist: number,
    decelDist: number,
    actionAfterMotion: AfterMotion
): void
```

* **Параметры:**
  * `v` (`number`): Начальная скорость участка.
  * `vFinish` (`number`): Финишная скорость перед торможением.
  * `totalDist` (`number`): Общая дистанция в мм.
  * `decelDist` (`number`): Дистанция замедления в мм.
  * `actionAfterMotion` (`AfterMotion`): Действие после завершения (`HoldStop`, `FloatStop`, `NoStop`).

---

### `chassis.rampDistMove`
Низкоуровневое синхронизированное движение с ускорениями и замедлениями на базе внешнего драйвера `advmotctrls` и ПИД-регулятора рассогласования энкодеров моторов.

```typescript
function rampDistMove(
    minSpeed: number,
    maxSpeedLeft: number,
    maxSpeedRight: number,
    totalDist: number,
    accelDist: number,
    decelDist: number
): void
```

---

## 3. Модуль `chassis` (Повороты) — Базовые, рамповые и умные повороты

Модуль предоставляет три группы алгоритмов вращения:
1. **Синхронные повороты** на фиксированный угол по тикам энкодеров.
2. **Рамповые повороты** с плавным разгоном и торможением.
3. **Умные повороты (Smart Turns)** с замкнутым ПИД-регулятором и контролем стабилизации (дорегулированием).

---

### 3.1. Базовые синхронизированные повороты

#### `chassis.spinTurn`
Поворот робота на месте (относительно центра оси колес) на заданный угол.
* Колеса вращаются в противоположные стороны с равной скоростью.
* Положительный угол `deg` — поворот вправо, отрицательный — влево.

```typescript
function spinTurn(deg: number, v: number, timeOut?: number): void
```

* **Параметры:**
  * `deg` (`number`): Угол поворота в градусах ($\pm^\circ$).
  * `v` (`number`): Скорость вращения моторов в процентах.
  * `timeOut` (`number`, опционально): Защитный таймаут в миллисекундах.
* **Блок MakeCode:** `поворот шасси на $deg° с $v% относительно центра оси колёс||таймаут $timeOut мс`

#### `chassis.pivotTurn`
Поворот шасси относительно одного из неподвижных колес.
* Одно колесо заблокировано (`Braking.Hold`), второе колесо выполняет движение.
* Положительный угол — движение вперед, отрицательный — назад.

```typescript
function pivotTurn(wheelPivot: WheelPivot, deg: number, v: number, timeOut?: number): void
```

* **Параметры:**
  * `wheelPivot` (`WheelPivot`): Неподвижное колесо-ось (`WheelPivot.LeftWheel` или `WheelPivot.RightWheel`).
  * `deg` (`number`): Угол поворота в градусах.
  * `v` (`number`): Скорость вращения активного колеса.
  * `timeOut` (`number`, опционально): Таймаут в мс.

---

### 3.2. Рамповые повороты (с плавным разгоном и замедлением)

#### `chassis.rampSpinTurn`
Плавный поворот на месте с трапецеидальным профилем скорости. Исключает пробуксовку колес по поверхности поля.

```typescript
function rampSpinTurn(
    deg: number,
    vMin: number,
    vMax: number,
    accelDeg?: number,
    decelDeg?: number,
    timeOut?: number
): void
```

* **Параметры:**
  * `deg` (`number`): Угол поворота (положительный — вправо, отрицательный — влево).
  * `vMin` (`number`): Стартовая и финишная минимальная скорость ($0..100$).
  * `vMax` (`number`): Максимальная скорость в середине поворота.
  * `accelDeg` (`number`, опционально): Угол фазы разгона (по умолчанию $25\%$ от `abs(deg)`).
  * `decelDeg` (`number`, опционально): Угол фазы замедления (по умолчанию $25\%$ от `abs(deg)`).
  * `timeOut` (`number`, опционально): Защитный таймаут в мс.

#### `chassis.rampPivotTurn`
Плавный поворот относительно одного колеса с ускорением и замедлением.

```typescript
function rampPivotTurn(
    wheelPivot: WheelPivot,
    deg: number,
    vMin: number,
    vMax: number,
    accelDeg?: number,
    decelDeg?: number,
    timeOut?: number
): void
```

---

### 3.3. Умные повороты с ПИД-регулятором (`smart_turns`)

Умные повороты используют полноценный ПИД-регулятор обратной связи по энкодерам. Робот контролирует ошибку рассогласования, плавно выходит на целевой угол и включает этап **дорегулирования** (settling), когда ошибка и мощность регулятора меньше пороговых.

#### Функции настройки умных поворотов:
* `setSmartSpinTurnTimeOut(timeOut: number)`: Максимальное время поворота на месте (мс).
* `setSmartPivotTurnTimeOut(timeOut: number)`: Максимальное время поворота относительно колеса (мс).
* `setSmartTurnDeregTimeOut(timeOut: number)`: Время дорегулирования после достижения порога ошибки (мс, по умолчанию 200).
* `setSmartTurnConditionErrDifference(maxErr: number)`: Порог ошибки энкодеров для фиксации достижения угла.
* `setSmartTurnConditionRegDifference(maxU: number)`: Порог мощности регулятора для фиксации окончания поворота.

#### `chassis.smartSpinTurn`
Умный поворот на месте с ПИД-регулятором.

```typescript
function smartSpinTurn(deg: number, params?: params.LineFollow, debug: boolean = false): void
```

* **Параметры:**
  * `deg` (`number`): Целевой угол поворота в градусах.
  * `params` (`params.LineFollow`, опционально): Параметры регулятора (`v`, `Kp`, `Ki`, `Kd`, `Kf`).
  * `debug` (`boolean`): Вывод ошибок и мощности регулятора на экран EV3.

#### `chassis.smartPivotTurn`
Умный поворот относительно колеса с ПИД-регулятором.

```typescript
function smartPivotTurn(
    deg: number,
    wheelPivot: WheelPivot,
    params?: params.LineFollow,
    debug: boolean = false
): void
```

---

## 4. Модуль `motions` — Движения до условий и действия

Модуль объединяет алгоритмы движения до наступления определенного события на датчиках (до границы цвета, до линии) и управление состоянием моторов после алгоритмов.

---

### `motions.actionAfterMotion`
Вспомогательная функция, исполняющая действие по завершении движения:
* `AfterMotion.HoldStop` / `MotionBraking.Hold` — жесткий тормоз с удержанием.
* `AfterMotion.FloatStop` / `MotionBraking.Coast` — торможение накатом (свободный выбег).
* `AfterMotion.NoStop` / `MotionBraking.Continue` — моторы не тормозятся, управление передается следующему алгоритму.

```typescript
function actionAfterMotion(actionAfterMotion: AfterMotion | MotionBraking, v?: number): void
```

---

### `motions.setMinPwrAtEndMovement` / `motions.getMinPwrAtEndMovement`
Установка и чтение минимального порога мощности моторов на фазе замедления (для преодоления трения покоя редукторов).

```typescript
function setMinPwrAtEndMovement(pwr: number): void
function getMinPwrAtEndMovement(): number
```

---

### `motions.moveToReflectionZone`
Прямолинейное движение или движение по курсу (`turnRatio`) до достижения заданного уровня отраженного света на выбранных датчиках линии.

```typescript
function moveToReflectionZone(
    turnRatio: number,
    v: number,
    sensorsSelection: LineSensorSelection,
    refCondition: Comparison,
    refTreshold: number,
    actionAfterMotion: AfterMotion,
    debug: boolean = false
): void
```

* **Параметры:**
  * `turnRatio` (`number`): Рулевое соотношение (0 — строго прямо, -100..100 — поворот).
  * `v` (`number`): Скорость движения.
  * `sensorsSelection` (`LineSensorSelection`): Выбор датчиков (`LeftAndRight`, `LeftOrRight`, `OnlyLeft`, `OnlyRight`).
  * `refCondition` (`Comparison`): Условие сравнения (`Greater`, `GreaterOrEqual`, `Less`, `LessOrEqual`, `Equal`).
  * `refTreshold` (`number`): Пороговое значение нормализованного отражения ($0..100$).
  * `actionAfterMotion` (`AfterMotion`): Действие после завершения.
  * `debug` (`boolean`): Вывод отладки на экран.
* **Пример:**
  ```typescript
  // Двигаться прямо со скоростью 50% пока оба датчика не увидят черное (отражение <= 20%)
  motions.moveToReflectionZone(0, 50, LineSensorSelection.LeftAndRight, Comparison.LessOrEqual, 20, AfterMotion.HoldStop);
  ```

---

### `motions.spinTurnToLine`
Вращение робота на месте до обнаружения линии датчиками с последующим автопозиционированием по центру линии.
* Поддерживает как датчики цвета EV3 Color Sensor, так и датчики освещенности NXT Light Sensor.

```typescript
function spinTurnToLine(
    rotateSide: TurnSide,
    v: number,
    params?: params.LinePositioning,
    debug: boolean = false
): void
```

* **Параметры:**
  * `rotateSide` (`TurnSide`): Сторона вращения (`TurnSide.Left` или `TurnSide.Right`).
  * `v` (`number`): Скорость вращения при поиске линии.
  * `params` (`params.LinePositioning`, опционально): Параметры регулятора последующего позиционирования.

---

## 5. Модуль `line_follow` — Следование по линии

Ключевой соревновательный модуль. Реализует движение по линии по одному или двум датчикам с пропорционально-дифференциальным регулированием, детекцией перекрестков и настраиваемыми реакциями.

---

### 5.1. Глобальные свойства и уставки регулятора линии

| Функция | Описание | Значение по умолчанию |
|---|---|---|
| `setLineRefThreshold(ref)` / `getLineRefThreshold()` | Порог черного для фиксации перекрестка | 30 |
| `setLineFollowRefThreshold(ref)` / `getLineFollowRefThreshold()` | Порог для регулятора следования | 30 |
| `setLineFollowSetPoint(val)` / `getLineFollowSetPoint()` | Целевая уставка отражения регулятора | 50 |
| `setDistRollingAfterIntersection(dist)` | Дистанция прокатки вперед после перекрестка (мм) | 50 мм |
| `setDistRollingFromLineAfterIntersection(dist)`| Дистанция съезда с линии после перекрестка (мм) | 50 мм |
| `setLineFollowLoopDt(dt)` | Время шага цикла регулирования (мс) | 10 мс |
| `setLineFollowOneSensorConditionMaxErr(err)` | Допустимая ошибка при езде по 1 датчику | 30 |
| `setLineFollowSearchTolerance(tol)` | Допуск поиска линии при срыве | 5 |

---

### 5.2. Алгоритмы движения по линии до перекрестков

#### `line_follow.lineFollowToCrossIntersection`
Движение по линии по двум датчикам до Т- или Х-образного перекрестка (когда оба датчика одновременно зафиксировали черное).

```typescript
function lineFollowToCrossIntersection(
    actionAfterMotion: AfterLineMotion,
    params?: params.LineFollow,
    debug: boolean = false
): void
```

* **Параметры:**
  * `actionAfterMotion` (`AfterLineMotion`): Реакция на перекресток:
    * `AfterLineMotion.HoldStop` — мгновенная остановка с удержанием.
    * `AfterLineMotion.Rolling` — прямолинейная прокатка на заданное расстояние.
    * `AfterLineMotion.LineRolling` — прокатка по линии дальше за перекресток.
    * `AfterLineMotion.LineSmoothRolling` — плавная прокатка по линии со сбросом скорости.
    * `AfterLineMotion.Continue` — продолжать движение без торможения.
  * `params` (`params.LineFollow`, опционально): ПИД-параметры (`v`, `Kp`, `Ki`, `Kd`, `Kf`).

#### `line_follow.lineFollowToSideIntersection`
Движение по линии до обнаружения бокового ответвления (слева или справа, изнутри или снаружи).

```typescript
function lineFollowToSideIntersection(
    sideIntersection: SideIntersection,
    actionAfterMotion: AfterLineMotion,
    params?: params.LineFollow,
    debug: boolean = false
): void
```

* **Параметры:**
  * `sideIntersection` (`SideIntersection`): Тип бокового перекрестка (`LeftInside`, `RightInside`, `LeftOutside`, `RightOutside`).

#### `line_follow.lineFollowToLeftIntersection` / `line_follow.lineFollowToRightIntersection`
Специализированные удобные вызовы для левых и правых перекрестков с указанием расположения робота относительно линии (`LineLocation.Inside` / `LineLocation.Outside`).

```typescript
function lineFollowToLeftIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug?: boolean): void
function lineFollowToRightIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug?: boolean): void
```

---

### 5.3. Алгоритмы движения по линии на дистанцию

#### `line_follow.lineFollowToDistanceByTwoSensors`
Движение по линии по двум датчикам на строго заданное расстояние в миллиметрах. Ошибка вычисляется как разность отражений левого и правого датчиков: $error = refLeft - refRight$.

```typescript
function lineFollowToDistanceByTwoSensors(
    dist: number,
    actionAfterMotion: AfterLineMotion,
    params?: params.LineFollow,
    debug: boolean = false
): void
```

* **Параметры:**
  * `dist` (`number`): Дистанция в мм.
  * `actionAfterMotion` (`AfterLineMotion`): Действие после завершения дистанции.
  * `params` (`params.LineFollow`, опционально): Настройки скорости и ПИД.

#### `line_follow.lineFollowToDistanceByOneSensor`
Движение по границе черного и белого с помощью одного выбранного датчика на заданное расстояние.

```typescript
function lineFollowToDistanceByOneSensor(
    dist: number,
    followLineSensor: FollowLineSensor,
    actionAfterMotion: AfterLineMotion,
    params?: params.LineFollow,
    debug: boolean = false
): void
```

* **Параметры:**
  * `followLineSensor` (`FollowLineSensor`): Режим движения (`LeftInside`, `RightInside`, `LeftOutside`, `RightOutside`).

#### `line_follow.lineFollowToDistanceByLeftSensor` / `lineFollowToDistanceByRightSensor`
Специализированные функции следования по левому или правому датчику линии.

---

### 5.4. Вспомогательные функции линии

* `line_follow.rollingLineFollowing(lineFollowMode, rollingDist, v, actionAfterMotion, debug?)`: Прокатка по линии на короткую дистанцию с поддержанием курса.
* `line_follow.steeringUntilFindLine(lineSensor, steering, v)`: Руление роботом до момента, пока указанный датчик не наедет на черную линию.
* `line_follow.getLineFollowError(lineFollowMode, refLeftLS, refRightLS)`: Внутренний расчет текущей ошибки регулирования.

---

## 6. Модуль `ramp_line_follow` — Следование по линии с рампой скоростей

Модуль комбинирует ПИД-следование по линии и расчет трапецеидального профиля скорости (плавный разгон в начале участка и замедление перед перекрестком или финишем).

---

### `ramp_line_follow.rampLineFollowToDistanceByTwoSensors`
Движение по линии по двум датчикам на общую дистанцию с зонами разгона и замедления.

```typescript
function rampLineFollowToDistanceByTwoSensors(
    totalDist: number,
    accelDist: number,
    decelDist: number,
    braking: MotionBraking,
    params?: params.RampLineFollow,
    debug: boolean = false
): void
```

* **Параметры:**
  * `totalDist` (`number`): Общая дистанция участка в мм.
  * `accelDist` (`number`): Расстояние фазы разгона в мм.
  * `decelDist` (`number`): Расстояние фазы замедления в мм.
  * `braking` (`MotionBraking`): Режим остановки (`Hold`, `Coast`, `Continue`).
  * `params` (`params.RampLineFollow`, опционально): Объект с начальной, максимальной и конечной скоростями и коэффициентами ПИД.

---

### `ramp_line_follow.rampLineFollowToCrossIntersection`
Следование по линии с разгоном от старта до перекрестка. При подъезде к перекрестку скорость сбрасывается для точной фиксации линии.

```typescript
function rampLineFollowToCrossIntersection(
    totalDist: number,
    accelDist: number,
    decelDist: number,
    actionAfterMotion: AfterLineMotion,
    params?: params.RampLineFollowToCross,
    debug: boolean = false
): void
```

---

### `ramp_line_follow.rampRollingLineFollowingByTwoSensors`
Прокатка по линии с поддержанием постоянной скорости и последующим торможением.

```typescript
function rampRollingLineFollowingByTwoSensors(
    rollingDist: number,
    speed: number,
    braking: MotionBraking,
    debug: boolean = false
): void
```

---

## 7. Модуль `levelings` — Выравнивания на линии

Выравнивания используются для сброса накопившейся ошибки одометрии и ориентации робота при пересечении перпендикулярных линий поля.

---

### `levelings.setDistanceBetweenLineSensors`
Установка расстояния между центрами двух датчиков линии в мм. Необходима для математического расчета выравнивания на ходу.

```typescript
function setDistanceBetweenLineSensors(dist: number): void
```

---

### `levelings.lineAlignment`
Перпендикулярное выравнивание робота на линии с использованием двух независимых ПИД-регуляторов (каждый мотор управляется своим датчиком линии).
Робот подъезжает к линии и корректирует наклон корпуса до идеального перпендикуляра.

```typescript
function lineAlignment(
    lineLocation: VerticalLineLocation,
    regulatorTime: number,
    params?: params.LineAlignment,
    debug: boolean = false
): void
```

* **Параметры:**
  * `lineLocation` (`VerticalLineLocation`): Наезд на линию передом (`VerticalLineLocation.Front`) или задом (`VerticalLineLocation.Behind`).
  * `regulatorTime` (`number`): Время дорегулирования (мс), в течение которого регуляторы удерживают линию.
  * `params` (`params.LineAlignment`, опционально): Настройки скоростей и коэффициентов регулятора отдельно для левого и правого мотора.
* **Блок MakeCode:** `выравнивание на линии $lineLocation за $regulatorTimeмс||параметры: $params|отладка $debug`

---

### `levelings.linePositioning`
Позиционирование (центрирование) робота по линии вращением на месте. Сводит разницу показаний датчиков к нулю ($refLeft - refRight \rightarrow 0$).

```typescript
function linePositioning(
    regTime: number,
    params?: params.LinePositioning,
    debug: boolean = false
): void
```

* **Параметры:**
  * `regTime` (`number`): Время стабилизации регулятора на линии (мс).
  * `params` (`params.LinePositioning`, опционально): Коэффициенты ПИД и максимальная скорость позиционирования.

---

### `levelings.lineAlignmentInMotion`
**Динамическое выравнивание перпендикулярно линии на ходу без остановки.**
При пересечении поперечной линии робот засекает энкодер в момент срабатывания первого датчика, затем энкодер второго датчика, тригонометрически вычисляет точный угол перекоса $\alpha = \arctan(a / b)$ и выполняет мгновенный компенсирующий поворот колесом, продолжая движение.

```typescript
function lineAlignmentInMotion(
    speed: number,
    actionAfterMotion: AfterMotion,
    debug: boolean = false
): void
```

* **Параметры:**
  * `speed` (`number`): Скорость движения при выравнивании.
  * `actionAfterMotion` (`AfterMotion`): Действие после завершения выравнивания.

---

## 8. Модуль `sensors` — Датчики линии и цвета (EV3 и HiTechnic)

Модуль обеспечивает абстракцию над сенсорами, калибровку сырых значений в проценты (нормализация 0..100%), работу с цветовыми пространствами RGB и HSV/HSVL.

---

### 8.1. Инициализация и нормализация датчиков линии

* `sensors.setColorSensorsAsLineSensors(left, right)`: Назначить стандартные датчики цвета EV3 датчиками линии.
* `sensors.setNxtLightSensorsAsLineSensors(left, right)`: Назначить датчики освещенности NXT датчиками линии.
* `sensors.setLineSensorsRawRefValues(bL, wL, bR, wR)`: Установить калибровочные сырые значения черного и белого для левого и правого сенсоров.
* `sensors.getNormalizedReflectionValue(sensor: LineSensor): number`: Возвращает нормализованное значение отраженного света от 0 (абсолютно черный) до 100 (белый).
* `sensors.normalizingReflectionRawValue(raw, bRaw, wRaw): number`: Формула нормализации:
  $$\text{ref} = \text{clamp}\left(0, 100, \frac{\text{raw} - \text{bRaw}}{\text{wRaw} - \text{bRaw}} \times 100\right)$$

---

### 8.2. Работа с датчиком цвета EV3 Color Sensor

#### `sensors.getNormalizeRgb`
Считывает с датчика сырые компоненты Red, Green, Blue и нормализует их в диапазон $0..255$ на основе предварительно сохраненных калибровочных Min/Max значений.

```typescript
function getNormalizeRgb(sensor: sensors.ColorSensor): number[]
```

#### `sensors.rgbToHsvl`
Преобразует нормализованный массив `[R, G, B]` в координаты цветового пространства `[H, S, V, L]`:
* `H` (Hue / Тон): от $0^\circ$ до $360^\circ$.
* `S` (Saturation / Насыщенность): $0..100\%$.
* `V` (Value / Яркость): $0..100\%$.
* `L` (Lightness / Освещенность): $0..100\%$.

```typescript
function rgbToHsvl(normRgb: number[]): number[]
```

#### `sensors.convertHsvlToColorNum`
Определяет соревновательный цвет объекта по вектору HSVL и граничным порогам `ColorBoundaries`. Возвращает номер цвета:
* `1` — Черный
* `2` — Синий
* `3` — Зеленый
* `4` — Желтый
* `5` — Красный
* `6` — Белый
* `7` — Коричневый
* `0` — Цвет не определен / пусто

```typescript
function convertHsvlToColorNum(hsvl: number[], boundaries: ColorBoundaries): number
```

#### `sensors.hueByVectorSum`
Вычисление цветового оттенка (Hue) методом векторной суммы на цветовом круге, что исключает разрыв около $0^\circ / 360^\circ$ для оттенков красного цвета.

```typescript
function hueByVectorSum(normRgb: number[]): number
```

---

### 8.3. HiTechnic Color Sensor V2 (`ht_color_sensor`)

Поддержка высокоточного внешнего датчика цвета HiTechnic v2 по шине I2C:
* `setHsvlToColorNumBoundariesHtColorSensor(sensor, boundaries)`
* `getHsvlToColorNumBoundariesHtColorSensor(sensor): ColorBoundaries`

---

## 9. Модули `navigation` и `navigation_motions` — Навигация на графах

Модуль реализует топологическую навигацию робота по узловым точкам (перекресткам) соревновательного поля с использованием взвешенных ориентированных графов.

---

### 9.1. Построение графа и свойства

#### `navigation.buildGraph`
Формирует матрицу смежности, направлений и весов ребер на основе массива путей и ответвлений.

```typescript
function buildGraph(paths: NavPath[]): void
```

#### `navigation.createPath` / `navigation.createBranch`
Создание двунаправленного ребра графа или тупикового ответвления:

```typescript
function createPath(a: number, b: number, direction: number, weight: number): NavPath
function createBranch(node: number, direction: number, weight?: number): NavPath
```

* **Пример конфигурации поля (как в олимпиаде РРО):**
  ```typescript
  navigation.setNodesCount(17);
  navigation.buildGraph([
      navigation.createPath(0, 10, NavDirection.DownUp, 380),
      navigation.createPath(1, 2, NavDirection.RightLeft, 435),
      navigation.createBranch(3, NavDirection.Right),
      navigation.createPath(4, 11, NavDirection.DownUp, 320)
  ]);
  navigation.setCurrentPosition(0);
  navigation.setCurrentDirection(NavDirection.Down); // 270 градусов
  ```

---

### 9.2. Алгоритмы поиска пути на графе

* `navigation.algorithmDFS(start, finish): number[]`: Поиск в глубину (DFS).
* `navigation.algorithmBFS(start, finish): number[]`: Поиск в ширину (BFS) — гарантирует минимальное количество ребер/перекрестков.
* `navigation.algorithmDijkstra(start, finish): number[]`: Алгоритм Дейкстры — находит маршрут с минимальной физической дистанцией (весом).

---

### 9.3. Движение по графу (`navigation_motions`)

#### `navigation_motions.followLineToNode`
Автоматически находит оптимальный маршрут от текущего узла до целевого `newPos` по выбранному алгоритму (`GraphTraversal.Dijkstra`, `BFS`, `DFS`) и осуществляет проезд по всем промежуточным узлам с коррекцией курсового угла.

```typescript
function followLineToNode(
    algorithm: GraphTraversal,
    newPos: number,
    params?: params.NavLineFollow,
    debug: boolean = false
): void
```

#### `navigation_motions.followLineByPath`
Исполнение роботом заранее рассчитанного массива узлов `path` (например, `[0, 10, 11, 12, 13]`).

```typescript
function followLineByPath(
    path: number[],
    actionAfterMotion: AfterLineMotion,
    params?: params.NavLineFollow,
    debug: boolean = false
): void
```

#### Курсовые повороты с учетом ориентации графа:
* `directionSpinTurn(inputDirection, v, debug?)`: Поворот шасси на абсолютное направление графа (например, повернуться на `NavDirection.Right = 0°`).
* `directionRampSpinTurn(inputDirection, vMin, vMax, accelDeg?, decelDeg?, timeOut?, debug?)`: Плавный поворот на абсолютное направление графа с разгоном и замедлением.
* `relativeSpinTurn(relativeDegrees, v, debug?)`: Относительный поворот с обновлением текущего направления в навигаторе.
* `relativeRampSpinTurn(relativeDegrees, vMin, vMax, accelDeg?, decelDeg?, timeOut?, debug?)`: Плавный относительный поворот с обновлением навигатора.

---

## 10. Модуль `motors` — Позиционирование отдельных двигателей

Предназначен для управления вспомогательными двигателями робота (манипуляторы, захваты, лифты).

---

### `motors.setPosition`
Поворот мотора на абсолютный угол с использованием ПИД-регулятора положения. Имеет защиту по таймауту, фильтр производной и настраиваемый допуск ошибки (deadband).

```typescript
function setPosition(
    motor: motors.Motor,
    position: number,
    braking: Braking,
    params?: params.MotorRegulator,
    debug: boolean = false
): void
```

* **Параметры:**
  * `motor` (`motors.Motor`): Выбранный мотор (`motors.mediumA`, `motors.largeD` и др.).
  * `position` (`number`): Целевой угол энкодера в градусах.
  * `braking` (`Braking`): Тормоз по окончании (`Braking.Hold`, `Braking.Coast`).
  * `params` (`params.MotorRegulator`, опционально): Параметры регулятора (`vMax`, `Kp`, `Ki`, `Kd`, `Kf`, `timeOut`, `errorThreshold`, `vMinThreshold`).
  * `debug` (`boolean`): Вывод отладочной информации.

---

## 11. Вспомогательные модули: `math`, `statistics`, `custom`, `tune`

### 11.1. Модуль `Math`
* `Math.distanceToTicks(distance: number): number`: Пересчет миллиметров пути в градусы энкодера колеса по формуле:
  $$\text{ticks} = \frac{\text{distance}}{\pi \times D_{\text{wheel}}} \times 360$$
* `Math.turnToTicks(degrees: number): number`: Пересчет угла поворота корпуса робота в градусы вращения моторов:
  $$\text{ticks} = \frac{\text{degrees} \times L_{\text{base}}}{D_{\text{wheel}}}$$
* `Math.min3(a, b, c): number`: Минимальное из трех чисел.
* `Math.max3(a, b, c): number`: Максимальное из трех чисел.
* `Math.clip(a, b, c): number`: Ограничение числа $a$ диапазоном $[b, c]$.

---

### 11.2. Модуль `arrays` (Статистика)
Функции для обработки массивов данных датчиков и фильтрации шума:
* `sum(numbers: number[]): number`: Сумма элементов.
* `min(numbers: number[]): number` / `max(numbers: number[]): number`: Минимум и максимум.
* `median(numbers: number[]): number`: Медиана (идеальна для фильтрации резких единичных выбросов ультразвуковых и оптических датчиков).
* `mean(numbers: number[]): number`: Среднее арифметическое значение.
* `mode(numbers: number[]): number`: Мода выборки (наиболее часто встречающееся значение).
* `range(numbers: number[]): number`: Размах (максимум минус минимум).
* `populationVariance` / `populationStandardDeviation`: Дисперсия и стандартное отклонение совокупности.
* `sampleVariance` / `sampleStandardDeviation`: Выборочная дисперсия и стандартное отклонение.

---

### 11.3. Модуль `custom` (Фоновые задачи)
* `music.playToneInBackground(frequency, duration)`: Воспроизведение звука в отдельном параллельном потоке `control.runInParallel` без блокировки основного движения робота.
* `brick.setStatusLightInBackground(pattern, duration)`: Включение подсветки кнопок EV3 на заданный промежуток времени в фоне.

---

### 11.4. Модуль `tune.functionsTune`
Интерактивное калибровочное меню, запускаемое прямо на экране блока EV3. Позволяет с помощью кнопок блока оперативно менять и тестировать коэффициенты ПИД, пороги датчиков и геометрию базы прямо на соревновательном поле без повторной прошивки кода с компьютера.

```typescript
function functionsTune(startupScreen: number = 0): void
```

---

## 12. Модуль `params` — Конфигураторы параметров регуляторов

Для удобства передачи параметров и уменьшения количества аргументов в блоках MakeCode модуль `params` предоставляет компактные структуры и функции-конструкторы.

### 12.1. Параметры следования по линии (`params.LineFollow`)
* `lineFollowEmptyParams()`: Пустой объект параметров.
* `lineFollowOneParams(v)`: Задание только скорости $v$.
* `lineFollowTwoParams(v, Kp)`: Скорость и пропорциональный коэффициент.
* `lineFollowFourParams(v, Kp, Kd, Kf)`: Скорость, $K_p$, $K_d$ и фильтр производной.
* `lineFollowAllParams(v, Kp, Ki, Kd, Kf)`: Полный набор параметров ПИД-регулятора.
* `setLineFollow2SensorParams(...)`: Глобальная установка параметров движения по линии.

### 12.2. Параметры выравнивания на линии (`params.LineAlignment`)
* `lineAlignmentEmptyParams()`
* `lineAlignmentThreeParams(v, leftKp, rightKp)`
* `lineAlignmentSevenParams(v, leftKp, rightKp, leftKd, rightKd, leftKf, rightKf)`
* `lineAlignmentAllParams(...)`

### 12.3. Параметры позиционирования (`params.LinePositioning`)
* `linePositioningEmptyParams()`
* `linePositioningAllParams(timeOut, maxV, Kp, Ki, Kd, Kf)`

### 12.4. Параметры рампового следования по линии (`params.RampLineFollow`)
* `rampLineFollowEmptyParams()`
* `rampLineFollowThreeParams(startV, maxV, finishV)`
* `rampLineFollowFourParams(startV, maxV, finishV, Kp)`
* `rampLineFollowAllParams(startV, maxV, finishV, Kp, Ki, Kd, Kf)`

### 12.5. Параметры моторов (`params.MotorRegulator`)
* `motorSetPosEmptyParams()`: Создает объект с полями `vMax`, `Kp`, `Ki`, `Kd`, `Kf`, `timeOut`, `errorThreshold`, `vMinThreshold`.

---

## 13. Справочник перечислений (Enums)

### `AfterMotion`
Действие моторов шасси после завершения движения:
* `HoldStop` (0) — торможение моторами с жестким удержанием позиции.
* `FloatStop` (1) — торможение накатом (моторы свободно вращаются).
* `NoStop` (2) — продолжать вращение без торможения.

### `AfterLineMotion`
Действия после обнаружения перекрестка или окончания движения по линии:
* `Rolling` — прямолинейная прокатка на фиксированное расстояние.
* `SmoothRolling` — плавная прокатка с замедлением.
* `LineRolling` — прокатка вперед вдоль линии.
* `LineSmoothRolling` — плавная прокатка вдоль линии с замедлением.
* `LineContinueRoll` — продолжение следования без остановки.
* `HoldStop` — мгновенная остановка с удержанием.
* `FloatStop` — остановка накатом.
* `Continue` — не тормозить.

### `LineLocation` & `VerticalLineLocation`
* `LineLocation`: Расположение линии относительно траектории (`Inside` — изнутри контура, `Outside` — снаружи).
* `VerticalLineLocation`: Направление подъезда к линии (`Front` — спереди, `Behind` — сзади).

### `LineSensor` & `FollowLineSensor`
* `LineSensor`: Выбор физического датчика (`Left`, `Right`).
* `FollowLineSensor`: Режим следования одним датчиком (`LeftInside`, `RightInside`, `LeftOutside`, `RightOutside`).

### `SideIntersection`
Тип бокового перекрестка:
* `LeftInside`, `RightInside`, `LeftOutside`, `RightOutside`.

### `TurnSide` & `WheelPivot`
* `TurnSide`: Направление вращения (`Left`, `Right`).
* `WheelPivot`: Колесо, выступающее осью вращения (`LeftWheel`, `RightWheel`).

### `Comparison`
Операторы сравнения значений сенсоров:
* `Greater` ($>$), `GreaterOrEqual` ($\ge$), `Less` ($<$), `LessOrEqual` ($\le$), `Equal` ($=$).

### `NavDirection`
Ориентация ребер топологического графа:
* **Односторонние:** `Right` ($0^\circ$), `UpRight` ($45^\circ$), `Up` ($90^\circ$), `UpLeft` ($135^\circ$), `Left` ($180^\circ$), `DownLeft` ($225^\circ$), `Down` ($270^\circ$), `DownRight` ($315^\circ$).
* **Двусторонние ребра:** `UpDown` ($90^\circ/270^\circ$), `DownUp` ($270^\circ/90^\circ$), `RightLeft` ($0^\circ/180^\circ$), `LeftRight` ($180^\circ/0^\circ$), `UpRightDownLeft` ($45^\circ/225^\circ$), `UpLeftDownRight` ($135^\circ/315^\circ$).

### `GraphTraversal`
Алгоритмы поиска маршрута по графу:
* `DFS` — поиск в глубину.
* `BFS` — поиск в ширину (минимальное число переходов).
* `Dijkstra` — алгоритм Дейкстры (минимальный вес/расстояние).

### `SensorColors`
Идентификаторы соревновательных цветов:
* `None` (0), `Black` (1), `Blue` (2), `Green` (3), `Yellow` (4), `Red` (5), `White` (6), `Brown` (7).
