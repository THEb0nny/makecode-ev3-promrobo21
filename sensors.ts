namespace sensors {

    export let leftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Левый датчик для движения по линии
    export let rightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor; // Правый датчик для движения по линии

    export let bRefRawLeftLineSensor: number; // Сырые значения на чёрном для левого датчика линии
    export let wRefRawLeftLineSensor: number; // Сырые значения на белом для левого датчика линии

    export let bRefRawRightLineSensor: number; // Сырые значения на чёрном для правого датчика линии
    export let wRefRawRightLineSensor: number; // Сырые значения на белом для правого датчика линии

    export let minRgbColorSensor1: number[] = [0, 0, 0]; // Минимальные значения RGB для датчика цвета в первом порту
    export let minRgbColorSensor2: number[] = [0, 0, 0]; // Минимальные значения RGB для датчика цвета во втором порту
    export let minRgbColorSensor3: number[] = [0, 0, 0]; // Минимальные значения RGB для датчика цвета в третьем порту
    export let minRgbColorSensor4: number[] = [0, 0, 0]; // Минимальные значения RGB для датчика цвета в четвёртом порту

    export let maxRgbColorSensor1: number[]; // Максимальные значения RGB для датчика цвета в первом порту
    export let maxRgbColorSensor2: number[]; // Максимальные значения RGB для датчика цвета во втором порту
    export let maxRgbColorSensor3: number[]; // Максимальные значения RGB для датчика цвета в третьем порту
    export let maxRgbColorSensor4: number[]; // Максимальные значения RGB для датчика цвета в четвёртом порту

    /**
     * The method of installing sensors for movement and working with the line.
     * Метод установки датчиков для движения и работы с линией.
     */
    //% blockId="SetLineSensors"
    //% block="set left $newLeftLineSensor| right $newRightLineSensor| line sensors"
    //% block.loc.ru="установить левый $newLeftLineSensor| правый $newRightLineSensor| датчики линии"
    //% inlineInputMode="inline"
    //% newLeftLineSensor.fieldEditor="images"
    //% newLeftLineSensor.fieldOptions.columns="4"
    //% newLeftLineSensor.fieldOptions.width="300"
    //% newRightLineSensor.fieldEditor="images"
    //% newRightLineSensor.fieldOptions.columns="4"
    //% newRightLineSensor.fieldOptions.width="300"
    //% weight="99"
    //% group="Line Sensor"
    export function SetLineSensors(newLeftLineSensor: sensors.ColorSensor | sensors.NXTLightSensor, newRightLineSensor: sensors.ColorSensor | sensors.NXTLightSensor) {
        if (newLeftLineSensor !== newRightLineSensor) { // Если сенсоры установили не одинаковые
            leftLineSensor = newLeftLineSensor;
            rightLineSensor = newRightLineSensor;
        } else control.assert(false, 1);
    }

    /**
     * The method of setting the sensor line of raw values on black and white.
     * Метод установки датчику линии сырых значений на чёрном и белом.
     */
    //% blockId="SetLineSensorRawRefValue"
    //% block="set $sensor| line sensor white $wRefRawVal| black $bRefRawVal| raw values"
    //% block.loc.ru="установить датчику линии $sensor| сырые значения чёрного $bRefRawVal| белого $wRefRawVal"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
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
     */
    //% blockId="GetLineSensorRawRefValue"
    //% block="line sensor $sensor| raw value"
    //% block.loc.ru="сырое значение датчика линии $sensor"
    //% inlineInputMode="inline"
    //% weight="87" blockGap="8"
    //% group="Line Sensor"
    export function GetLineSensorRawRefValue(sensor: LineSensor): number {
        if (sensor == LineSensor.Left) {
            if (leftLineSensor instanceof sensors.ColorSensor){
                return (leftLineSensor as sensors.ColorSensor).light(LightIntensityMode.ReflectedRaw);
            } else if (leftLineSensor instanceof sensors.NXTLightSensor) {
                return (rightLineSensor as sensors.NXTLightSensor).light(NXTLightIntensityMode.ReflectedRaw);
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
     * A method for obtaining a normalized reflection value for a line sensor from raw values.
     * Метод получения нормализованного значения отражения для датчика линии из сырых значений.
     * @param refRawValCS текущее сырое значение отражения, eg: 0
     * @param bRefRawValCS сырое значение отражения на чёрном, eg: 500
     * @param wRefRawValCS сырое значение отражения на белом, eg: 650
     */
    //% blockId="GetNormRefCS"
    //% block="normalize reflection $refRawValCS| at black $bRefRawValCS| white $wRefRawValCS"
    //% block.loc.ru="нормализовать отраж-е $refRawValCS| при чёрном $bRefRawValCS| белом $wRefRawValCS"
    //% inlineInputMode="inline"
    //% weight="88" blockGap="8"
    //% group="Line Sensor"
    export function GetNormRefCS(refRawValCS: number, bRefRawValCS: number, wRefRawValCS: number): number {
        let refValCS = Math.map(refRawValCS, bRefRawValCS, wRefRawValCS, 0, 100);
        refValCS = Math.constrain(refValCS, 0, 100);
        return refValCS;
    }

}

namespace sensors {

    interface HsvlToColorNum {
        colorBoundary: number;
        whiteBoundary: number;
        blackBoundary: number;
        redBoundary: number;
        brownBoundary: number;
        yellowBoundary: number;
        greenBoundary: number;
        blueBoundary: number;
    }

    export function SetHSVLColorNumParams(newColorBoundary: number, newWhiteBoundary: number, newBlackBoundary: number, newRedBoundary: number, newBrownBoundary: number, newYellowBoundary: number, newGreenBoundary: number, newBlueBoundary: number): HsvlToColorNum {
        return {
            colorBoundary: 65,
            whiteBoundary: 10,
            blackBoundary: 1,
            redBoundary: 25,
            brownBoundary: 50,
            yellowBoundary: 100,
            greenBoundary: 180,
            blueBoundary: 260
        }
    }

    /**
     * Set the minimum RGB values for the color sensor. The maximum values are obtained on white.
     * Установить минимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param maxRgbArr массив с тремя значениями rgb
     */
    //% blockId="SetColorSensorMinRgbValues"
    //% block="set $sensor| color sensor min RGB values $maxRgbArr"
    //% block.loc.ru="установить $sensor| датчику цвета минимальные значения RGB $maxRgbArr"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="90" blockGap="8"
    //% group="Color Sensor"
    export function SetColorSensorMinRgbValues(sensor: sensors.ColorSensor | sensors.NXTLightSensor, minRgbArr: number[]) {
        if (sensor.port() == 1) minRgbColorSensor1 = minRgbArr;
        else if (sensor.port() == 2) minRgbColorSensor2 = minRgbArr;
        else if (sensor.port() == 3) minRgbColorSensor3 = minRgbArr;
        else if (sensor.port() == 4) minRgbColorSensor4 = minRgbArr;
    }

    /**
     * Set the maximum RGB values for the color sensor. The maximum values are obtained on white.
     * Установить максимальные значения RGB для датчика цвета. Максимальные значения получаются на белом.
     * @param maxRgbArr массив с тремя значениями rgb
     */
    //% blockId="SetColorSensorMaxRgbValues"
    //% block="set $sensor| color sensor max RGB values $maxRgbArr"
    //% block.loc.ru="установить $sensor| датчику цвета максимальные значения RGB $maxRgbArr"
    //% inlineInputMode="inline"
    //% sensor.fieldEditor="images"
    //% sensor.fieldOptions.columns="4"
    //% sensor.fieldOptions.width="300"
    //% weight="90" blockGap="8"
    //% group="Color Sensor"
    export function SetColorSensorMaxRgbValues(sensor: sensors.ColorSensor | sensors.NXTLightSensor, maxRgbArr: number[]) {
        if (sensor.port() == 1) maxRgbColorSensor1 = maxRgbArr;
        else if (sensor.port() == 2) maxRgbColorSensor2 = maxRgbArr;
        else if (sensor.port() == 3) maxRgbColorSensor3 = maxRgbArr;
        else if (sensor.port() == 4) maxRgbColorSensor4 = maxRgbArr;
    }

    /**
     * Convert HSV to a color code. The resulting color codes correspond to the LEGO codes.
     * Перевести HSV в код цвета. Получаемые коды цвета соотвествуют кодам LEGO.
     * @param hsvl массив значений hsvl
     */
    //% blockId="HsvlToColorNum"
    //% block="convert $hsvl| to color code at params $params"
    //% block.loc.ru="перевести $hsvl| в цветовой код при параметрах $params"
    //% inlineInputMode="inline"
    //% weight="88" blockGap="8"
    //% group="Color Sensor"
    export function HsvlToColorNum(hsvl: number[], params: HsvlToColorNum): number {
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
    //% weight="80" blockGap="8"
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
            colorRgb[1] = sensors.color2.rgbRaw();
            colorRgb[2] = sensors.color3.rgbRaw();
            colorRgb[3] = sensors.color4.rgbRaw();
            brick.clearScreen();
            for (let i = 0; i < 4; i++) {
                brick.printString(`RGB_${i + 1}: ${colorRgb[i][0]} ${colorRgb[i][1]} ${colorRgb[i][2]}`, i + 1, 12);
            }
            if (btnPressed == 0) {
                brick.showString("Press Enter to freeze", 12);
            }
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

    /**
     * Converting rgb color space values to hsvl.
     * Перевод значений цветового пространства rgb в hsvl.
     * @param refRawValCS текущее сырое значение отражения, eg: 0
     * @param bRefRawValCS сырое значение отражения на чёрном, eg: 500
     * @param wRefRawValCS сырое значение отражения на белом, eg: 650
     */
    //% blockId="RgbToHsvlConverter"
    //% block="convert rgb $rgbArr| to hsvl"
    //% block.loc.ru="перевести rgb $rgbArr| в hsvl"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
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

}