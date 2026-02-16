namespace sensors {

    // https://github.com/THEb0nny/makecode-ev3-promrobo21/blob/master/color_hue.png

    /**
     * Получить нормализованные значения RGB с датчика цвета.
     * Возвращает массив RGB.
     */
    //% blockId="GetNormalizeRgb"
    //% block="**color sensor** $sensor normalize RGB"
    //% block.loc.ru="**датчика цвета** $sensor нормализованные RGB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="88" blockGap="8"
    //% group="Color Sensor"
    export function getNormalizeRgb(sensor: sensors.ColorSensor): number[] {
        const rgbRaw = sensor.rgbRaw(); // Получить сырые значения датчика цвета
        let normRgb: number[] = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            // const toHighMap = maxRgb < 255 ? maxRgb : 255;
            normRgb[i] = Math.map(rgbRaw[i], getMinRgbColorSensor(sensor)[i], getMaxRgbColorSensor(sensor)[i], 0, 255);
            normRgb[i] = Math.round(Math.constrain(normRgb[i], 0, 255));
        }
        return normRgb;
    }

}

namespace sensors {

    interface ColorBoundaries {
        whiteBoundary: number;
        blackBoundary: number;
        coloredBoundary: number;
        redBoundary: number;
        orangeBoundary: number;
        brownBoundary: number;
        yellowBoundary: number;
        greenBoundary: number;
        blueBoundary: number;
        purpleBoundary: number;
    }

    let minRgbColorSensors: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Минимальные значения RGB для датчиков цвета
    let maxRgbColorSensors: number[][] = [[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]]; // Максимальные значения RGB для датчиков цвета

    let whiteBoundaryColorSensors: number[] = [5, 5, 5, 5];
    let blackBoundaryColorSensors: number[] = [1, 1, 1, 1];
    let coloredBoundaryColorSensors: number[] = [50, 50, 50, 50];
    let redBoundaryColorSensors: number[] = [25, 25, 25, 25];
    let orangeBoundaryColorSensors: number[] = [-1, -1, -1, -1];
    let brownBoundaryColorSensors: number[] = [-1, -1, -1, -1];
    let yellowBoundaryColorSensors: number[] = [100, 100, 100, 100];
    let greenBoundaryColorSensors: number[] = [170, 170, 170, 170];
    let blueBoundaryColorSensors: number[] = [270, 270, 270, 270];
    let purpleBoundaryColorSensors: number[] = [-1, -1, -1, -1];

    /**
     * Установить минимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param minR минимальное значение красного, eg: 0
     * @param minG минимальное значение зелёного, eg: 0
     * @param minB минимальное значение синего, eg: 0
     */
    //% blockId="SetColorSensorMinRgbValues"
    //% block="set $sensor **color sensor** minimum R = $minR G = $minG B = $minB"
    //% block.loc.ru="установить $sensor **датчику цвета** минимальные R = $minR G = $minG B = $minB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="59" blockGap="8"
    //% group="Color Sensor"
    export function setColorSensorMinRgbValues(sensor: sensors.ColorSensor, minR: number, minG: number, minB: number) {
        if (minR < 0 || minG < 0 || minB < 0) {
            console.log(`Warning: Negative min RGB values for CS${sensor.port()}. Using absolute value.`);
        }
        const index = sensor.port() - 1;
        minRgbColorSensors[index] = [Math.abs(minR), Math.abs(minG), Math.abs(minB)];
    }

    /**
     * Установить максимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param maxR максимальное значение красного, eg: 255
     * @param maxG максимальное значение зелёного, eg: 255
     * @param maxB максимальное значение синего, eg: 255
     */
    //% blockId="SetColorSensorMaxRgbValues"
    //% block="set $sensor **color sensor** maximum R = $maxR G = $maxG B = $maxB"
    //% block.loc.ru="установить $sensor **датчику цвета** максимальные R = $maxR G = $maxG B = $maxB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="58" blockGap="8"
    //% group="Color Sensor"
    export function setColorSensorMaxRgbValues(sensor: sensors.ColorSensor, maxR: number, maxG: number, maxB: number) {
        if (maxR < 0 || maxG < 0 || maxB < 0) {
            console.log(`Warning: Negative max RGB values for CS${sensor.port()}. Using absolute value.`);
        }
        const index = sensor.port() - 1;
        maxRgbColorSensors[index] = [Math.abs(maxR), Math.abs(maxG), Math.abs(maxB)];
    }

    /**
     * Получить минимальные значения RGB для датчика цвета.
     */
    //% blockId="GetMinRgbColorSensor"
    //% block="get $sensor **color sensor** min RGB values"
    //% block.loc.ru="получить $sensor **датчик цвета** мин значения RGB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="57" blockGap="8"
    //% group="Color Sensor"
    export function getMinRgbColorSensor(sensor: sensors.ColorSensor): number[] {
        const index = sensor.port() - 1;
        return minRgbColorSensors[index];
    }

    /**
     * Получить максимальне значения RGB для датчика цвета.
     */
    //% blockId="GetMaxRgbColorSensor"
    //% block="get $sensor **color sensor** max RGB values"
    //% block.loc.ru="получить $sensor **датчик цвета** макс значения RGB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="56"
    //% group="Color Sensor"
    export function getMaxRgbColorSensor(sensor: sensors.ColorSensor): number[] {
        const index = sensor.port() - 1;
        return maxRgbColorSensors[index];
    }

    /**
     * Перевод значений цветового пространства rgb в hsvl.
     * @param normRgb массив значений rgb
     */
    //% blockId="rgbToHsvl"
    //% block="convert rgb $normRgb to hsvl"
    //% block.loc.ru="перевести rgb $normRgb в hsvl"
    //% inlineInputMode="inline"
    //% weight="52" blockGap="8"
    //% group="Color Sensor"
    export function rgbToHsvl(normRgb: number[]): number[] {
        // https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-hsv_models.svg
        // https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/Color.bpm
        let r = normRgb[0], g = normRgb[1], b = normRgb[2];

        // https://clev3r.ru/codesamples/
        // HT Color sensor V2 RGB Maxmium is 255
        // r = Math.constrain(r, 0, 255);
        // g = Math.constrain(g, 0, 255);
        // b = Math.constrain(b, 0, 255);

        let hue = 0, sat = 0, val = 0;
        let max = Math.max3(r, g, b);
        let min = Math.min3(r, g, b);
        let light = (max + min) / 5.12;
        val = max / 2.56; // Тоже самое что brightness в HSB
        if (Math.round(val) == 0 && Math.round(light) == 0) { // It's black, there's no way to tell hue and sat
            hue = -1;
            sat = -1;
        }

        if (hue != -1 && sat != -1) {
            r = r / max;
            g = g / max;
            b = b / max;
            max = Math.max3(r, g, b);
            min = Math.min3(r, g, b);
            sat = (max - min) * 100;
            if (Math.round(sat) == 0) hue = -1;

            if (hue != -1) { // It's white, there's no way to tell hue
                r = (r - min) / (max - min);
                g = (g - min) / (max - min);
                b = (b - min) / (max - min);
                max = Math.max3(r, g, b);
                min = Math.min3(r, g, b);

                if (Math.round(max) == Math.round(r)) {
                    hue = 0 + 60 * (g - b);
                    if (hue < 0) hue += 360;
                } else if (Math.round(max) == Math.round(g)) hue = 120 + 60 * (b - r);
                else hue = 240 + 60 * (r - g);
            }
        }
        return [Math.round(hue), Math.round(sat), Math.round(val), Math.round(light)];
    }

    /**
     * Получить значения HSVL с нормализованных значений RGB с датчика цвета.
     * Возвращает массив HSVL.
     */
    //% blockId="GetHsvl"
    //% block="**color sensor** $sensor HSVL from RGB"
    //% block.loc.ru="**датчика цвета** $sensor HSVL с RGB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="88" blockGap="8"
    //% group="Color Sensor"
    export function getHsvl(sensor: sensors.ColorSensor): number[] {
        const normRgb = getNormalizeRgb(sensor);
        const hsvl = rgbToHsvl(normRgb);
        return hsvl;
    }

    /**
     * Значения перевода HSVL в цветовые коды.
     * @param newColoredBoundary значение границы цветности S, если значение S выше, тогда объект будет считаться цветным иначе чёрно-белым (или что ничего нет), eg: 50
     * @param newWhiteBoundary значение границы белого V, если значение V ≥ этому, тогда объект будет считаться белым, eg: 10
     * @param newBlackBoundary значение границы чёрного V, если значение ≥ этому числу, но меньше белого числа, тогда будет считаться чёрным цветом, а всё что ниже этого будет считаться, что цвета нет, eg: 1
     * @param newRedBoundary значение границы красного H, от 0 до этого значения, eg: 25
     * @param newOrangeBoundary значение границы оранжевого H, от 0 до этого значения, eg: 35
     * @param newBrownBoundary значение границы коричневого H, от красного до этого значения, eg: 40
     * @param newYellowBoundary значение границы жёлтого H, от коричневого до этого значения, eg: 100
     * @param newGreenBoundary значение границы зелёного H, от жёлтого до этого значения, eg: 180
     * @param newBlueBoundary значение границы синего H, от зелёного до этого значения, eg: 260
     * @param newPurpleBoundary значение границы пурпурного H, от синего до этого значения, а после до 360 (включительно) снова идёт красный, eg: 260
     */
    //% blockId="HsvlToColorNumBoundaries"
    //% block="converting params HSVL to color at boundars chroma = $newColoredBoundary white = $newWhiteBoundary black = $newBlackBoundary|red = $newRedBoundary orange = $newOrangeBoundary brown = $newBrownBoundary yellow = $newYellowBoundary|green = $newGreenBoundary blue = $newBlueBoundary purple = $newPurpleBoundary"
    //% block.loc.ru="параметры перевода HSVL в цвет при границах цветности = $newColoredBoundary белого = $newWhiteBoundary чёрного = $newBlackBoundary|красного = $newRedBoundary оранжевого = $newOrangeBoundary коричневого = $newBrownBoundary жёлтого = $newYellowBoundary|зелёного = $newGreenBoundary синего = $newBlueBoundary пурпурный = $newPurpleBoundary"
    //% inlineInputMode="external"
    //% weight="55" blockGap="8"
    //% group="Color Sensor"
    export function hsvlToColorNumBoundaries(newColoredBoundary: number, newWhiteBoundary: number, newBlackBoundary: number, newRedBoundary: number, newOrangeBoundary: number, newBrownBoundary: number, newYellowBoundary: number, newGreenBoundary: number, newBlueBoundary: number, newPurpleBoundary: number): ColorBoundaries {
        return {
            whiteBoundary: newWhiteBoundary,
            blackBoundary: newBlackBoundary,
            coloredBoundary: newColoredBoundary,
            redBoundary: newRedBoundary,
            orangeBoundary: newOrangeBoundary,
            brownBoundary: newBrownBoundary,
            yellowBoundary: newYellowBoundary,
            greenBoundary: newGreenBoundary,
            blueBoundary: newBlueBoundary,
            purpleBoundary: newPurpleBoundary
        }
    }

    /**
     * Установить значения перевода HSVL в цветовые коды.
     * @param boundaries параметры перевода
     */
    //% blockId="SetHsvlToColorNumBoundaries"
    //% block="set converting params HSVL **color sensor** $sensor to color code $boundaries"
    //% block.loc.ru="установить параметры перевода HSVL **датчика цвета** $sensor в цветовой код $boundaries"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="54" blockGap="8"
    //% group="Color Sensor"
    export function setHsvlToColorNumBoundaries(sensor: sensors.ColorSensor, boundaries: ColorBoundaries) {
        const index = sensor.port() - 1;
        whiteBoundaryColorSensors[index] = boundaries.whiteBoundary;
        blackBoundaryColorSensors[index] = boundaries.blackBoundary;
        coloredBoundaryColorSensors[index] = boundaries.coloredBoundary;
        redBoundaryColorSensors[index] = boundaries.redBoundary;
        orangeBoundaryColorSensors[index] = boundaries.orangeBoundary;
        brownBoundaryColorSensors[index] = boundaries.brownBoundary;
        yellowBoundaryColorSensors[index] = boundaries.yellowBoundary;
        greenBoundaryColorSensors[index] = boundaries.greenBoundary;
        blueBoundaryColorSensors[index] = boundaries.blueBoundary;
        purpleBoundaryColorSensors[index] = boundaries.purpleBoundary;
    }

    /**
     * Получить значения перевода HSVL в цветовые коды.
     */
    //% blockId="GetHsvlToColorNumBoundaries"
    //% block="get converting params HSVL **color sensor** $sensor to color code"
    //% block.loc.ru="получить параметры перевода HSVL **датчика цвета** $sensor в цветовой код"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="53"
    //% group="Color Sensor"
    export function getHsvlToColorNumBoundaries(sensor: sensors.ColorSensor): ColorBoundaries {
        const index = sensor.port() - 1;
        return {
            whiteBoundary: whiteBoundaryColorSensors[index],
            blackBoundary: blackBoundaryColorSensors[index],
            coloredBoundary: coloredBoundaryColorSensors[index],
            redBoundary: redBoundaryColorSensors[index],
            orangeBoundary: orangeBoundaryColorSensors[index],
            brownBoundary: brownBoundaryColorSensors[index],
            yellowBoundary: yellowBoundaryColorSensors[index],
            greenBoundary: greenBoundaryColorSensors[index],
            blueBoundary: blueBoundaryColorSensors[index],
            purpleBoundary: purpleBoundaryColorSensors[index]
        }
    }

    /**
     * Перевести HSV в код цвета. Получаемые коды цвета соотвествуют кодам LEGO.
     * @param hsvl массив значений hsvl
     */
    //% blockId="ConvertHsvlToColorNum"
    //% block="convert HSVL $hsvl to color code at params $boundaries"
    //% block.loc.ru="перевести HSVL $hsvl в цветовой код при параметрах $boundaries"
    //% inlineInputMode="inline"
    //% weight="51"
    //% group="Color Sensor"
    export function convertHsvlToColorNum(hsvl: number[], boundaries: ColorBoundaries): number {
        const H = hsvl[0], S = hsvl[1], V = hsvl[2], L = hsvl[3];
        if (S > boundaries.coloredBoundary) { // Граница цветности
            return hueToColorNum(H, boundaries);
        } else if (V >= boundaries.whiteBoundary) return SensorColors.White; // Белый
        else if (V >= boundaries.blackBoundary) return SensorColors.Black; // Чёрный
        return SensorColors.None; // Пусто
    }

    // Перевод hue в цветовой код
    export function hueToColorNum(hue: number, boundaries: ColorBoundaries): number {
        if (boundaries.redBoundary != -1 && hue < boundaries.redBoundary) return SensorColors.Red; // Красный
        else if (boundaries.brownBoundary != -1 && hue < boundaries.brownBoundary) return SensorColors.Brown; // Коричневый
        else if (boundaries.yellowBoundary != -1 && hue < boundaries.yellowBoundary) return SensorColors.Yellow; // Желтый
        else if (boundaries.greenBoundary != -1 && hue < boundaries.greenBoundary) return SensorColors.Green; // Зелёный
        else if (boundaries.blueBoundary != -1 && hue < boundaries.blueBoundary) return SensorColors.Blue; // Синий
        else if (boundaries.redBoundary != -1 && hue < 360) return SensorColors.Red; // Снова красный
        else return -1; // Ошибка
    }

    /**
     * Поиск максимальных значений RGB датчика цвета, т.е. это максимальные значения на белом.
     */
    //% blockId="SearchRgbMinMax"
    //% block="show max RGB $sensor color sensor"
    //% block.loc.ru="показать минимальные и максимальные RGB $sensor датчика цвета"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="49"
    //% group="Color Sensor"
    export function searchRgbMinMax(sensor: ColorSensor) {
        let maxSensorRgb: number[] = [0, 0, 0];
        const sensorPort = sensor.port() - 1;

        let btnUpState = false, btnDownState = false;
        let btnRightNumberClicks = 0;

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла

        while (!brick.buttonEnter.isPressed()) { // while (!brick.buttonEnter.wasPressed())
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;

            if (brick.buttonUp.isPressed()) {
                if (btnRightNumberClicks > 0) {
                    btnUpState = true;
                    console.log(`btnUpState: ${btnUpState}`);
                }
            } else if (brick.buttonDown.isPressed()) {
                maxRgbColorSensors[sensorPort] = maxSensorRgb;
            } else if (brick.buttonRight.isPressed()) {
                btnRightNumberClicks++;
                if (btnRightNumberClicks > 2) { // Сброс
                    btnRightNumberClicks = 0;
                    maxSensorRgb = [0, 0, 0];
                    minRgbColorSensors[sensorPort] = [0, 0, 0];
                    maxRgbColorSensors[sensorPort] = [0, 0, 0];
                }
                brick.buttonRight.pauseUntil(ButtonEvent.Released);
                pause(250);
            }

            let sensorRgb = sensor.rgbRaw(); // Считать значение с датчика
            brick.clearScreen(); // Очистить экран
            // console.log(`btnUpState: ${btnUpState}`);
            brick.printString(`CS${sensor.port()} RGB: ${sensorRgb[0]} ${sensorRgb[1]} ${sensorRgb[2]}`, 1);

            if (btnRightNumberClicks > 0) {
                if (btnRightNumberClicks == 1) {
                    for (let i = 0; i < 3; i++) maxSensorRgb[i] = Math.max(sensorRgb[i], maxSensorRgb[i]);
                }
                if (btnUpState == true) {
                    console.log(`maxSensorRgb: ${maxSensorRgb}`);
                    minRgbColorSensors[sensorPort] = maxSensorRgb;
                    btnUpState = false;
                }

                brick.printString(`CS${sensor.port()} RGB MAX: ${maxSensorRgb[0]} ${maxSensorRgb[1]} ${maxSensorRgb[2]}`, 3);
                brick.printString(`CS${sensor.port()} MIN RGB: ${minRgbColorSensors[sensorPort][0]} ${minRgbColorSensors[sensorPort][1]} ${minRgbColorSensors[sensorPort][2]}`, 5);
                brick.printString(`CS${sensor.port()} MAX RGB: ${maxRgbColorSensors[sensorPort][0]} ${maxRgbColorSensors[sensorPort][1]} ${maxRgbColorSensors[sensorPort][2]}`, 6);

                if (btnRightNumberClicks == 1) brick.showString("Press RIGHT to freeze", 11);
                else brick.showString("Press RIGHT to reset", 11);

                if (btnRightNumberClicks > 0) {
                    brick.showString("Press UP to save to min RGB", 9);
                    brick.showString("Press DOWN to save to max RGB", 10);
                }
            } else {
                brick.showString("Press RIGHT to search max", 11);
            }
            brick.showString("Press ENTER to exit", 12);
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        brick.clearScreen();
    }

}

namespace sensors {

    // Предвычисленные таблицы (делаешь один раз)
    const sinTable: number[] = [];
    const cosTable: number[] = [];

    for (let i = 0; i < 360; i++) {
        sinTable.push(Math.sin(i * Math.PI / 180));
        cosTable.push(Math.cos(i * Math.PI / 180));
    }

    export function hueByVectorSum(normRgb: number[]): number {
        const anglesRGB = [0, 120, 240]; // Векторы: R=0°, G=120°, B=240°
        let x = 0, y = 0;
        for (let i = 0; i < 3; i++) {
            x += normRgb[i] * cosTable[anglesRGB[i]];
            y += normRgb[i] * sinTable[anglesRGB[i]];
        }

        let hue = Math.atan2(y, x) * 180 / Math.PI;
        if (hue < 0) hue += 360;

        return Math.round(hue); // 0-359 — твой цвет по кольцу!
    }

}