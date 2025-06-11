namespace sensors {

    export let leftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Левый датчик для движения по линии
    export let rightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Правый датчик для движения по линии

    export let bRefRawLeftLineSensor: number; // Сырые значения на чёрном для левого датчика линии
    export let wRefRawLeftLineSensor: number; // Сырые значения на белом для левого датчика линии

    export let bRefRawRightLineSensor: number; // Сырые значения на чёрном для правого датчика линии
    export let wRefRawRightLineSensor: number; // Сырые значения на белом для правого датчика линии

    /**
     * Метод установки датчиков цвета в качестве датчиков для движения и работы с линией. Устанавливать датчики линии требуется только один раз!
     * @param newLeftLineSensor левый датчик цвета, eg: sensors.color2
     * @param newRightLineSensor правый датчик цвета, eg: sensors.color3
     */
    //% blockId="SetColorSensorsAsLineSensors"
    //% block="set **color sensors** as line sensors left $newLeftLineSensor right $newRightLineSensor"
    //% block.loc.ru="установить **датчики цвета** в качестве датчиков линии левый $newLeftLineSensor правый $newRightLineSensor"
    //% inlineInputMode="inline"
    //% newLeftLineSensor.fieldEditor="images"
    //% newLeftLineSensor.fieldOptions.columns="4"
    //% newLeftLineSensor.fieldOptions.width="300"
    //% newRightLineSensor.fieldEditor="images"
    //% newRightLineSensor.fieldOptions.columns="4"
    //% newRightLineSensor.fieldOptions.width="300"
    //% weight="99"
    //% group="Line Sensor"
    export function setColorSensorsAsLineSensors(newLeftLineSensor: sensors.ColorSensor, newRightLineSensor: sensors.ColorSensor) {
        setLineSensor(newLeftLineSensor, newRightLineSensor);
        if (leftLineSensor instanceof sensors.ColorSensor && rightLineSensor instanceof sensors.ColorSensor) {
            for (let i = 0; i < 20; i++) { // Опрос датчиков, чтобы датчики дальше давали правильные показания
                getLineSensorRawRefValue(LineSensor.Left);
                getLineSensorRawRefValue(LineSensor.Right);
                pause(10);
            }
        }
    }

    /**
     * Метод установки nxt датчиков отражения в качестве датчиков для движения и работы с линией. Устанавливать датчики линии требуется только один раз!
     * @param newLeftLineSensor левый nxt датчик отражения, eg: sensors.nxtLight1
     * @param newRightLineSensor правый nxt датчик отражения, eg: sensors.nxtLight4
     */
    //% blockId="SetNxtLightSensorsAsLineSensors"
    //% block="set **nxt light sensors** as line sensors left $newLeftLineSensor right $newRightLineSensor"
    //% block.loc.ru="установить **nxt датчики** отражения в качестве датчиков линии левый $newLeftLineSensor правый $newRightLineSensor"
    //% inlineInputMode="inline"
    //% newLeftLineSensor.fieldEditor="images"
    //% newLeftLineSensor.fieldOptions.columns="4"
    //% newLeftLineSensor.fieldOptions.width="300"
    //% newRightLineSensor.fieldEditor="images"
    //% newRightLineSensor.fieldOptions.columns="4"
    //% newRightLineSensor.fieldOptions.width="300"
    //% weight="98"
    //% group="Line Sensor"
    export function setNxtLightSensorsAsLineSensors(newLeftLineSensor: sensors.NXTLightSensor, newRightLineSensor: sensors.NXTLightSensor) {
        setLineSensor(newLeftLineSensor, newRightLineSensor);
    }

    function setLineSensor(newLeftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor, newRightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor) {
        if (!leftLineSensor && !rightLineSensor) { // Если датчики до этого не были установлены
            if (newLeftLineSensor !== newRightLineSensor) { // Если сенсоры установили не одинаковые
                leftLineSensor = newLeftLineSensor;
                rightLineSensor = newRightLineSensor;
            } else {
                console.log("Error: the left and right line sensors are installed the same way!");
                control.assert(false, 1);
            }
        } else {
            console.log("Error: the line sensors have already been installed! You're doing it repeatedly!");
            control.assert(false, 2);
        }
    }

    /**
     * Метод установки датчику линии сырых значений на чёрном и белом.
     */
    //% blockId="SetLineSensorRawRefValue"
    //% block="set $sensor **line sensor** black $bRefRawVal white $wRefRawVal raw values"
    //% block.loc.ru="установить $sensor **датчику линии** сырые значения чёрного $bRefRawVal белого $wRefRawVal"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Line Sensor"
    export function setLineSensorRawRefValue(sensor: LineSensor, bRefRawVal: number, wRefRawVal: number) {
        if (sensor == LineSensor.Left) {
            bRefRawLeftLineSensor = bRefRawVal;
            wRefRawLeftLineSensor = wRefRawVal;
        } else if (sensor == LineSensor.Right) {
            bRefRawRightLineSensor = bRefRawVal;
            wRefRawRightLineSensor = wRefRawVal;
        }
    }

    /**
     * Новый метод установки датчикам линии сырых значений на чёрном и белом.
     */
    //% blockId="SetLineSensorsRawRefValues"
    //% block="set ref raw values ​​for **left line sensor** black $blackRefRawValLeftSensor white $whiteRefRawValLeftSensor **right** black $blackRefRawValRightSensor white $whiteRefRawValRightSensor"
    //% block.loc.ru="установить сырые значения отражения **левому датчику линии** чёрный $blackRefRawValLeftSensor белый $whiteRefRawValLeftSensor **правому** чёрный $blackRefRawValRightSensor белый $whiteRefRawValRightSensor"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Line Sensor"
    export function setLineSensorsRawRefValues(blackRefRawValLeftSensor: number, whiteRefRawValLeftSensor: number, blackRefRawValRightSensor: number, whiteRefRawValRightSensor: number) {
        bRefRawLeftLineSensor = blackRefRawValLeftSensor;
        wRefRawLeftLineSensor = whiteRefRawValLeftSensor;
        bRefRawRightLineSensor = blackRefRawValRightSensor;
        wRefRawRightLineSensor = whiteRefRawValRightSensor;
    }

    /**
     * Метод получения с датчика линии сырого значения отражения.
     * @param sensor датчик линии, eg: LineSensor.Left
     */
    //% blockId="GetLineSensorRawRefValue"
    //% block="**line sensor** $sensor reflection raw"
    //% block.loc.ru="сырое значение отражения **датчика линии** $sensor"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Line Sensor"
    export function getLineSensorRawRefValue(sensor: LineSensor): number {
        if (sensor == LineSensor.Left) {
            if (leftLineSensor instanceof sensors.ColorSensor) {
                return (leftLineSensor as sensors.ColorSensor).light(LightIntensityMode.ReflectedRaw);
            } else if (leftLineSensor instanceof sensors.NXTLightSensor) {
                return (leftLineSensor as sensors.NXTLightSensor).light(NXTLightIntensityMode.ReflectedRaw);
            }
        } else if (sensor == LineSensor.Right) {
            if (rightLineSensor instanceof sensors.ColorSensor) {
                return (rightLineSensor as sensors.ColorSensor).light(LightIntensityMode.ReflectedRaw);
            } else if (rightLineSensor instanceof sensors.NXTLightSensor) {
                return (rightLineSensor as sensors.NXTLightSensor).light(NXTLightIntensityMode.ReflectedRaw);
            }
        }
        return 0;
    }

    /**
     * Метод нормализации значения отражения для датчика линии из сырых значений.
     * @param refRawVal текущее сырое значение отражения, eg: 0
     * @param bRefRawVal сырое значение отражения на чёрном, eg: 500
     * @param wRefRawVal сырое значение отражения на белом, eg: 650
     */
    //% blockId="NormalizingReflectionRawValue"
    //% block="normalize raw reflection $refRawVal at black $bRefRawVal white $wRefRawVal"
    //% block.loc.ru="нормализовать сырое значения отражения $refRawVal при чёрном $bRefRawVal белом $wRefRawVal"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Line Sensor"
    export function normalizingReflectionRawValue(refRawVal: number, bRefRawVal: number, wRefRawVal: number): number {
        let refVal = Math.map(refRawVal, bRefRawVal, wRefRawVal, 0, 100);
        refVal = Math.constrain(refVal, 0, 100);
        return refVal;
    }

    /**
     * Метод получения нормализованного значения отражения для датчика линии из сырых значений.
     * @param refRawVal текущее сырое значение отражения, eg: 0
     * @param bRefRawVal сырое значение отражения на чёрном, eg: 500
     * @param wRefRawVal сырое значение отражения на белом, eg: 650
     */
    //% blockId="GetNormalizedReflectionValue"
    //% block="normalized reflection **line sensor** $sensor"
    //% block.loc.ru="нормализованное отражение **датчика линии** $sensor"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Line Sensor"
    export function getNormalizedReflectionValue(sensor: LineSensor, recalibrate: boolean = false): number {
        const refRawLS = getLineSensorRawRefValue(sensor); // Сырое значение с датчика цвета
        if (recalibrate) recalibrateLineSensors(sensor, refRawLS); // Перекалибруем, если есть необходимость
        if (sensor == LineSensor.Left) {
            return normalizingReflectionRawValue(refRawLS, bRefRawLeftLineSensor, wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
        } else if (sensor == LineSensor.Right) {
            return normalizingReflectionRawValue(refRawLS, bRefRawRightLineSensor, wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
        }
        return 0;
    }

    // Функция перекалибровки значений датчика
    function recalibrateLineSensors(sensor: LineSensor, refRawVal: number) {
        if (sensor == LineSensor.Left) {
            if (refRawVal > bRefRawLeftLineSensor) bRefRawLeftLineSensor = refRawVal;
            else if (refRawVal < wRefRawLeftLineSensor) wRefRawLeftLineSensor = refRawVal;
        } else if (sensor == LineSensor.Right) {
            if (refRawVal > bRefRawRightLineSensor) bRefRawRightLineSensor = refRawVal;
            else if (refRawVal < wRefRawRightLineSensor) wRefRawRightLineSensor = refRawVal;
        }
    }

}

namespace sensors {

    /**
     * Получить нормализованные значения RGB с датчика цвета.
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
        for(let i = 0; i < 3; i++) {
            const toHighMap = getMaxRgbColorSensor(sensor)[i] < 255 ? getMaxRgbColorSensor(sensor)[i] : 255;
            normRgb[i] = Math.map(rgbRaw[i], getMinRgbColorSensor(sensor)[i], getMaxRgbColorSensor(sensor)[i], 0, toHighMap);
            normRgb[i] = Math.round(Math.constrain(normRgb[i], 0, 255));
        }
        return normRgb;
    }

}

namespace sensors {

    let minRgbColorSensors: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Минимальные значения RGB для датчиков цвета
    let maxRgbColorSensors: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Максимальные значения RGB для датчиков цвета

    let colorBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let whiteBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let blackBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let redBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let brownBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let yellowBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let greenBoundaryColorSensors: number[] = [0, 0, 0, 0];
    let blueBoundaryColorSensors: number[] = [0, 0, 0, 0];

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
            console.log("Error: the min RGB value is less than zero!");
            control.assert(false, 3);
        }
        const index = sensor.port() - 1;
        minRgbColorSensors[index] = [minR, minG, minB];
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
            console.log("Error: the max RGB value is less than zero!");
            control.assert(false, 4);
        }
        const index = sensor.port() - 1;
        maxRgbColorSensors[index] = [maxR, maxG, maxB];
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

    interface HsvlToColorNumber {
        colorBoundary: number;
        whiteBoundary: number;
        blackBoundary: number;
        redBoundary: number;
        brownBoundary: number;
        yellowBoundary: number;
        greenBoundary: number;
        blueBoundary: number;
    }

    /**
     * Значения перевода HSVL в цветовые коды.
     * @param newColorBoundary значение границы цветности S, если значение S выше, тогда объект будет считаться цветным иначе чёрно-белым (или что ничего нет), eg: 50
     * @param newWhiteBoundary значение границы белого V, если значение V ≥ этому, тогда объект будет считаться белым, eg: 10
     * @param newBlackBoundary значение границы чёрного V, если значение ≥ этому числу, но меньше белого числа, тогда будет считаться чёрным цветом, а всё что ниже этого будет считаться, что цвета нет, eg: 1
     * @param newRedBoundary значение границы красного H, от 0 до этого значения, eg: 25
     * @param newBrownBoundary значение границы коричневого H, от красного до этого значения, eg: 40
     * @param newYellowBoundary значение границы жёлтого H, от коричневого до этого значения, eg: 100
     * @param newGreenBoundary значение границы зелёного H, от жёлтого до этого значения, eg: 180
     * @param newBlueBoundary значение границы синего H, от зелёного до этого значения, а после до 360 (включительно) снова идёт красный, eg: 260
     */
    //% blockId="HsvlToColorNumParams"
    //% block="converting params HSVL to color at boundars chroma = $newColorBoundary white = $newWhiteBoundary black = $newBlackBoundary|red = $newRedBoundary brown = $newBrownBoundary yellow = $newYellowBoundary|green = $newGreenBoundary blue = $newBlueBoundary"
    //% block.loc.ru="параметры перевода HSVL в цвет при границах цветности = $newColorBoundary белого = $newWhiteBoundary чёрного = $newBlackBoundary|красного = $newRedBoundary коричневого = $newBrownBoundary жёлтого = $newYellowBoundary|зелёного = $newGreenBoundary синего = $newBlueBoundary"
    //% inlineInputMode="external"
    //% weight="55" blockGap="8"
    //% group="Color Sensor"
    export function hsvlToColorNumParams(newColorBoundary: number, newWhiteBoundary: number, newBlackBoundary: number, newRedBoundary: number, newBrownBoundary: number, newYellowBoundary: number, newGreenBoundary: number, newBlueBoundary: number): HsvlToColorNumber {
        return {
            colorBoundary: newColorBoundary,
            whiteBoundary: newWhiteBoundary,
            blackBoundary: newBlackBoundary,
            redBoundary: newRedBoundary,
            brownBoundary: newBrownBoundary,
            yellowBoundary: newYellowBoundary,
            greenBoundary: newGreenBoundary,
            blueBoundary: newBlueBoundary
        }
    }

    /**
     * Установить значения перевода HSVL в цветовые коды.
     * @param params параметры перевода
     */
    //% blockId="SetHsvlToColorNumParams"
    //% block="set converting params HSVL **color sensor** $sensor to color code $params"
    //% block.loc.ru="установить параметры перевода HSVL **датчика цвета** $sensor в цветовой код $params"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="54" blockGap="8"
    //% group="Color Sensor"
    export function setHsvlToColorNumParams(sensor: sensors.ColorSensor, params: HsvlToColorNumber) {
        const index = sensor.port() - 1;
        colorBoundaryColorSensors[index] = params.colorBoundary;
        whiteBoundaryColorSensors[index] = params.whiteBoundary;
        blackBoundaryColorSensors[index] = params.blackBoundary;
        redBoundaryColorSensors[index] = params.redBoundary;
        brownBoundaryColorSensors[index] = params.brownBoundary;
        yellowBoundaryColorSensors[index] = params.yellowBoundary;
        greenBoundaryColorSensors[index] = params.greenBoundary;
        blueBoundaryColorSensors[index] = params.blueBoundary;
    }

    /**
     * Получить значения перевода HSVL в цветовые коды.
     */
    //% blockId="GetHsvlToColorNumParams"
    //% block="get converting params HSVL **color sensor** $sensor to color code"
    //% block.loc.ru="получить параметры перевода HSVL **датчика цвета** $sensor в цветовой код"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="53"
    //% group="Color Sensor"
    export function getHsvlToColorNumParams(sensor: sensors.ColorSensor): HsvlToColorNumber {
        const index = sensor.port() - 1;
        return {
            colorBoundary: colorBoundaryColorSensors[index],
            whiteBoundary: whiteBoundaryColorSensors[index],
            blackBoundary: blackBoundaryColorSensors[index],
            redBoundary: redBoundaryColorSensors[index],
            brownBoundary: brownBoundaryColorSensors[index],
            yellowBoundary: yellowBoundaryColorSensors[index],
            greenBoundary: greenBoundaryColorSensors[index],
            blueBoundary: blueBoundaryColorSensors[index]
        }
    }

    /**
     * Перевод значений цветового пространства rgb в hsvl.
     * @param refRawValCS текущее сырое значение отражения, eg: 0
     * @param bRefRawValCS сырое значение отражения на чёрном, eg: 500
     * @param wRefRawValCS сырое значение отражения на белом, eg: 650
     */
    //% blockId="ConvertRgbToHsvl"
    //% block="convert rgb $rgbArr to hsvl"
    //% block.loc.ru="перевести rgb $rgbArr в hsvl"
    //% inlineInputMode="inline"
    //% weight="52" blockGap="8"
    //% group="Color Sensor"
    export function convertRgbToHsvl(rgbArr: number[]): number[] {
        // https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-hsv_models.svg
        // https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/Color.bpm
        let r = rgbArr[0], g = rgbArr[1], b = rgbArr[2];

        // https://clev3r.ru/codesamples/
        // HT Color sensor V2 RGB Maxmium is 255
        // r = Math.constrain(r, 0, 255);
        // g = Math.constrain(g, 0, 255);
        // b = Math.constrain(b, 0, 255);

        let hue = 0, sat = 0, val = 0;

        let max = Math.max3(r, g, b);
        let min = Math.min3(r, g, b);
        let light = (max + min) / 5.12;
        val = max / 2.56;
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
     * Перевести HSV в код цвета. Получаемые коды цвета соотвествуют кодам LEGO.
     * @param hsvl массив значений hsvl
     */
    //% blockId="ConvertHsvlToColorNum"
    //% block="convert HSVL $hsvl to color code at params $params"
    //% block.loc.ru="перевести HSVL $hsvl в цветовой код при параметрах $params"
    //% inlineInputMode="inline"
    //% weight="51"
    //% group="Color Sensor"
    export function convertHsvlToColorNum(hsvl: number[], params: HsvlToColorNumber): number {
        const H = hsvl[0], S = hsvl[1], V = hsvl[2], L = hsvl[3];
        if (S > params.colorBoundary) { // Граница цветности
            if (H < params.redBoundary) return SensorColors.Red; // red
            else if (H < params.brownBoundary) return SensorColors.Brown; // brown
            else if (H < params.yellowBoundary) return SensorColors.Yellow; // yellow
            else if (H < params.greenBoundary) return SensorColors.Green; // green
            else if (H < params.blueBoundary) return SensorColors.Blue; // blue
            else if (H < 360) return SensorColors.Red; // red
            else return -1; // error
        } else if (V >= params.whiteBoundary) return SensorColors.White; // white
        else if (V >= params.blackBoundary) return SensorColors.Black; // black
        return SensorColors.None; // Empty
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
            let loopTime = currTime - prevTime;
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