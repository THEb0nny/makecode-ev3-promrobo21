namespace sensors {

    export let leftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Левый датчик для движения по линии
    export let rightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Правый датчик для движения по линии

    export let bRefRawLeftLineSensor: number; // Сырые значения на чёрном для левого датчика линии
    export let wRefRawLeftLineSensor: number; // Сырые значения на белом для левого датчика линии

    export let bRefRawRightLineSensor: number; // Сырые значения на чёрном для правого датчика линии
    export let wRefRawRightLineSensor: number; // Сырые значения на белом для правого датчика линии

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
     * Method for installing color sensors as motion and line sensors. Line sensors only need to be installed once!
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
    export function SetColorSensorsAsLineSensors(newLeftLineSensor: sensors.ColorSensor, newRightLineSensor: sensors.ColorSensor) {
        SetLineSensor(newLeftLineSensor, newRightLineSensor);
    }

    /**
     * Method for installing nxt reflection sensors as motion and line sensors. Line sensors only need to be installed once!
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
    export function SetNxtLightSensorsAsLineSensors(newLeftLineSensor: sensors.NXTLightSensor, newRightLineSensor: sensors.NXTLightSensor) {
        SetLineSensor(newLeftLineSensor, newRightLineSensor);
    }

    function SetLineSensor(newLeftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor, newRightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor) {
        if (!leftLineSensor && !rightLineSensor) { // Если датчики до этого не были установлены
            if (newLeftLineSensor !== newRightLineSensor) { // Если сенсоры установили не одинаковые
                leftLineSensor = newLeftLineSensor;
                rightLineSensor = newRightLineSensor;
            } else control.assert(false, 1);
        } else control.assert(false, 2);
    }

    /**
     * The method of setting the sensor line of raw values on black and white.
     * Метод установки датчику линии сырых значений на чёрном и белом.
     */
    //% blockId="SetLineSensorRawRefValue"
    //% block="set $sensor **line sensor** black $bRefRawVal white $wRefRawVal raw values"
    //% block.loc.ru="установить $sensor **датчику линии** сырые значения чёрного $bRefRawVal белого $wRefRawVal"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Line Sensor"
    export function SetLineSensorRawRefValue(sensor: LineSensor, bRefRawVal: number, wRefRawVal: number) {
        if (sensor == LineSensor.Left) {
            bRefRawLeftLineSensor = bRefRawVal;
            wRefRawLeftLineSensor = wRefRawVal;
        } else if (sensor == LineSensor.Right) {
            bRefRawRightLineSensor = bRefRawVal;
            wRefRawRightLineSensor = wRefRawVal;
        }
    }

    /**
     * A method for obtaining a raw reflection value from a line sensor.
     * Метод получения с датчика линии сырого значения отражения.
     * @param sensor датчик линии, eg: LineSensor.Left
     */
    //% blockId="GetLineSensorRawRefValue"
    //% block="**line sensor** $sensor reflection raw"
    //% block.loc.ru="сырое значение отражения **датчика линии** $sensor"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Line Sensor"
    export function GetLineSensorRawRefValue(sensor: LineSensor): number {
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
     * A method for normalizing the reflectance value for a line sensor from raw values..
     * Метод нормализации значения отражения для датчика линии из сырых значений.
     * @param refRawVal текущее сырое значение отражения, eg: 0
     * @param bRefRawVal сырое значение отражения на чёрном, eg: 500
     * @param wRefRawVal сырое значение отражения на белом, eg: 650
     */
    //% blockId="NormalizingReflectionValue"
    //% block="normalize raw reflection $refRawVal at black $bRefRawVal white $wRefRawVal"
    //% block.loc.ru="нормализовать сырое значения отражения $refRawVal при чёрном $bRefRawVal белом $wRefRawVal"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Line Sensor"
    export function NormalizingReflectionValue(refRawVal: number, bRefRawVal: number, wRefRawVal: number): number {
        let refVal = Math.map(refRawVal, bRefRawVal, wRefRawVal, 0, 100);
        refVal = Math.constrain(refVal, 0, 100);
        return refVal;
    }

    /**
     * A method for obtaining a normalized reflection value for a line sensor from raw values.
     * Метод получения нормализованного значения отражения для датчика линии из сырых значений.
     * @param refRawVal текущее сырое значение отражения, eg: 0
     * @param bRefRawVal сырое значение отражения на чёрном, eg: 500
     * @param wRefRawVal сырое значение отражения на белом, eg: 650
     */
    //% blockId="GetNormalizedReflectionValue"
    //% block="normalized reflection **line sensor** $sensor"
    //% block.loc.ru="нормализованное отражение **датчика линии** $sensor"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Line Sensor"
    export function GetNormalizedReflectionValue(sensor: LineSensor, recalibrate: boolean = false): number {
        const refRawLS = GetLineSensorRawRefValue(sensor); // Сырое значение с датчика цвета
        if (recalibrate) RecalibrateLineSensors(sensor, refRawLS); // Перекалибруем, если есть необходимость
        if (sensor == LineSensor.Left) {
            return NormalizingReflectionValue(refRawLS, bRefRawLeftLineSensor, wRefRawLeftLineSensor); // Нормализованное значение с левого датчика линии
        } else if (sensor == LineSensor.Right) {
            return NormalizingReflectionValue(refRawLS, bRefRawRightLineSensor, wRefRawRightLineSensor); // Нормализованное значение с правого датчика линии
        }
        return 0;
    }

    // Функция перекалибровки значений датчика
    function RecalibrateLineSensors(sensor: LineSensor, refRawVal: number) {
        if (sensor == LineSensor.Left) {
            if (refRawVal > bRefRawLeftLineSensor) bRefRawLeftLineSensor = refRawVal;
            else if (refRawVal < wRefRawLeftLineSensor) wRefRawLeftLineSensor = refRawVal;
        } else if (sensor == LineSensor.Right) {
            if (refRawVal > bRefRawRightLineSensor) bRefRawRightLineSensor = refRawVal;
            else if (refRawVal < wRefRawRightLineSensor) wRefRawRightLineSensor = refRawVal;
        }
    }

    /**
     * Set the minimum RGB values for the color sensor. The maximum values are obtained on white.
     * Установить минимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param minR минимальное значение красного, eg: 0
     * @param minG минимальное значение зелёного, eg: 0
     * @param minB минимальное значение синего, eg: 0
     */
    //% blockId="SetColorSensorMinRgbValues"
    //% block="set $sensor **color sensor** min values R = $minR G = $minG B = $minB"
    //% block.loc.ru="установить $sensor **датчику цвета** мин значения R = $minR G = $minG B = $minB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="59" blockGap="8"
    //% group="Color Sensor"
    export function SetColorSensorMinRgbValues(sensor: sensors.ColorSensor, minR: number, minG: number, minB: number) {
        if (minR < 0 || minG < 0 || minB < 0) {
            music.playSoundEffect(sounds.systemGeneralAlert);
            control.panic(30);
        }
        const index = sensor.port() - 1;
        minRgbColorSensors[index] = [minR, minG, minB];
    }

    /**
     * Set the maximum RGB values for the color sensor. The maximum values are obtained on white.
     * Установить максимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param maxR максимальное значение красного, eg: 255
     * @param maxG максимальное значение зелёного, eg: 255
     * @param maxB максимальное значение синего, eg: 255
     */
    //% blockId="SetColorSensorMaxRgbValues"
    //% block="set $sensor color **sensor max** RGB values R = $maxR G = $maxG B = $maxB"
    //% block.loc.ru="установить $sensor **датчику цвета** макс значения R = $maxR G = $maxG B = $maxB"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="58" blockGap="8"
    //% group="Color Sensor"
    export function SetColorSensorMaxRgbValues(sensor: sensors.ColorSensor, maxR: number, maxG: number, maxB: number) {
        if (maxR < 0 || maxG < 0 || maxB < 0) {
            music.playSoundEffect(sounds.systemGeneralAlert);
            control.panic(31);
        }
        const index = sensor.port() - 1;
        maxRgbColorSensors[index] = [maxR, maxG, maxB];
    }

    /**
     * Set the maximum RGB values for the color sensor.
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
    export function GetMinRgbColorSensor(sensor: sensors.ColorSensor): number[] {
        const index = sensor.port() - 1;
        return minRgbColorSensors[index];
    }

    /**
     * Get the maximum RGB values for the color sensor.
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
    export function GetMaxRgbColorSensor(sensor: sensors.ColorSensor): number[] {
        const index = sensor.port() - 1;
        return maxRgbColorSensors[index];
    }

    interface HsvlToColorNumInterface {
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
     * HSVL conversion values to color codes.
     * Значения перевода HSVL в цветовые коды.
     * @param newColorBoundary значение границы цветности, eg: 50
     * @param newWhiteBoundary значение границы белого, eg: 10
     * @param newBlackBoundary значение границы чёрного, eg: 1
     * @param newRedBoundary значение границы красного, eg: 25
     * @param newBrownBoundary значение границы коричневого, eg: 40
     * @param newYellowBoundary значение границы жёлтого, eg: 100
     * @param newGreenBoundary значение границы зелёного, eg: 180
     * @param newBlueBoundary значение границы синего, после которого до 360 снова идёт красный, eg: 260
     */
    //% blockId="HsvlToColorNumParams"
    //% block="converting params HSVL **color sensor** to color code|at boundars chroma  = $newColorBoundary|white = $newWhiteBoundary black = $newBlackBoundary|red = $newRedBoundary brown = $newBrownBoundary yellow = $newYellowBoundary green = $newGreenBoundary blue = $newBlueBoundary"
    //% block.loc.ru="параметры перевода HSVL **датчика цвета** в цветовой код|при границе цветности = $newColorBoundary|белого = $newWhiteBoundary чёрного = $newBlackBoundary|красного = $newRedBoundary коричневого = $newBrownBoundary жёлтого = $newYellowBoundary зелёного = $newGreenBoundary синего = $newBlueBoundary"
    //% inlineInputMode="inline"
    //% weight="55" blockGap="8"
    //% group="Color Sensor"
    export function HsvlToColorNumParams(newColorBoundary: number, newWhiteBoundary: number, newBlackBoundary: number, newRedBoundary: number, newBrownBoundary: number, newYellowBoundary: number, newGreenBoundary: number, newBlueBoundary: number): HsvlToColorNumInterface {
        return {
            colorBoundary: newColorBoundary, whiteBoundary: newWhiteBoundary, blackBoundary: newBlackBoundary, redBoundary: newRedBoundary, brownBoundary: newBrownBoundary, yellowBoundary: newYellowBoundary, greenBoundary: newGreenBoundary, blueBoundary: newBlueBoundary
        }
    }

    /**
     * Set HSVL conversion values to color codes.
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
    export function SetHsvlToColorNumParams(sensor: sensors.ColorSensor, params: HsvlToColorNumInterface) {
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
     * Get HSVL conversion values to color codes.
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
    export function GetHsvlToColorNumParams(sensor: sensors.ColorSensor): HsvlToColorNumInterface {
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
     * Converting rgb color space values to hsvl.
     * Перевод значений цветового пространства rgb в hsvl.
     * @param refRawValCS текущее сырое значение отражения, eg: 0
     * @param bRefRawValCS сырое значение отражения на чёрном, eg: 500
     * @param wRefRawValCS сырое значение отражения на белом, eg: 650
     */
    //% blockId="RgbToHsvlConverter"
    //% block="convert rgb $rgbArr to hsvl"
    //% block.loc.ru="перевести rgb $rgbArr в hsvl"
    //% inlineInputMode="inline"
    //% weight="52" blockGap="8"
    //% group="Color Sensor"
    export function RgbToHsvlConverter(rgbArr: number[]): number[] {
        // https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-hsv_models.svg
        // https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/Color.bpm
        let r = rgbArr[0], g = rgbArr[1], b = rgbArr[2];

        // https://clev3r.ru/codesamples/
        // Color sensor V2 RGB Maxmium is 255
        // r = Math.constrain(r, 0, 255);
        // g = Math.constrain(g, 0, 255);
        // b = Math.constrain(b, 0, 255);

        let hue = 0, sat = 0, val = 0;

        let max = Math.max(Math.max(r, g), b);
        let min = Math.min(Math.min(r, g), b);
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
            max = Math.max(Math.max(r, g), b);
            min = Math.min(Math.min(r, g), b);
            sat = (max - min) * 100;
            if (Math.round(sat) == 0) hue = -1;

            if (hue != -1) { // It's white, there's no way to tell hue
                r = (r - min) / (max - min);
                g = (g - min) / (max - min);
                b = (b - min) / (max - min);
                max = Math.max(Math.max(r, g), b);
                min = Math.min(Math.min(r, g), b);

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
     * Convert HSV to a color code. The resulting color codes correspond to the LEGO codes.
     * Перевести HSV в код цвета. Получаемые коды цвета соотвествуют кодам LEGO.
     * @param hsvl массив значений hsvl
     */
    //% blockId="HsvlToColorNum"
    //% block="convert HSVL $hsvl to color code at params $params"
    //% block.loc.ru="перевести HSVL $hsvl в цветовой код при параметрах $params"
    //% inlineInputMode="inline"
    //% weight="51"
    //% group="Color Sensor"
    export function HsvlToColorNum(hsvl: number[], params: HsvlToColorNumInterface): number {
        const H = hsvl[0], S = hsvl[1], V = hsvl[2], L = hsvl[3];
        if (S > params.colorBoundary) { // Граница цветности
            if (H < params.redBoundary) return 5; // red
            else if (H < params.brownBoundary) return 7; // brown
            else if (H < params.yellowBoundary) return 4; // yellow
            else if (H < params.greenBoundary) return 3; // green
            else if (H < params.blueBoundary) return 2; // blue
            else if (H < 360) return 5; // red
            else return -1; // error
        } else if (V >= params.whiteBoundary) return 6; // white
        else if (V >= params.blackBoundary) return 1; // black
        return 0; // empty
    }

    /**
     * Search for the maximum RGB values of the color sensor, i.e. these are the maximum values on white.
     * Поиск максимальных значений RGB датчика цвета, т.е. это максимальные значения на белом.
     */
    //% blockId="SearchRgbMaxColorSensors"
    //% block="show max RGB color sensors"
    //% block.loc.ru="показать максимальные RGB датчиков цвета"
    //% inlineInputMode="inline"
    //% weight="49"
    //% group="Color Sensor"
    export function SearchRgbMaxColorSensors() {
        let rgbMax: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let btnPressed = 0;
        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (btnPressed < 2) {
            let currTime = control.millis();
            let loopTime = currTime - prevTime;
            prevTime = currTime;
            if (brick.buttonEnter.wasPressed()) { // Переключение режима
                btnPressed++;
                pause(250);
            }
            let colorRgb: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
            colorRgb[0] = [0, 0, 0]; // sensors.color1.rgbRaw();
            colorRgb[1] = sensors.color2.rgbRaw(); // sensors.color2.rgbRaw();
            colorRgb[2] = [0, 0, 0]; // sensors.color3.rgbRaw();
            colorRgb[3] = [0, 0, 0] // sensors.color4.rgbRaw();
            brick.clearScreen();
            for (let i = 0; i < 4; i++) {
                brick.printString(`RGB_${i + 1}: ${colorRgb[i][0]} ${colorRgb[i][1]} ${colorRgb[i][2]}`, i + 1, 12);
            }
            if (btnPressed == 0) brick.showString("Press Enter to freeze", 12);
            if (btnPressed == 1) {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 3; j++) {
                        rgbMax[i][j] = Math.max(colorRgb[i][j], rgbMax[i][j]);
                    }
                }
                for (let i = 0, str = 7; i < 4; i++) {
                    brick.printString(`RGB_max: ${rgbMax[i][0]} ${rgbMax[i][1]} ${rgbMax[i][2]}`, str++, 12);
                }
                brick.showString("Press Enter to exit", 12);
            }
            control.pauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        brick.clearScreen();
    }

}