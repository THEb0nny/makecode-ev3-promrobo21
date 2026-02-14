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

    // Установить левый и правый датчик в качестве датчиков линии
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

    // Подготовить датчики к работе изначально
    export function preparationLineSensor() {
        if (leftLineSensor instanceof sensors.ColorSensor && rightLineSensor instanceof sensors.ColorSensor) { // Если датчики цвета были до этого установлены
            pauseUntil(() => leftLineSensor.isActive() && rightLineSensor.isActive()); // Ждать пока датчики не станут активными
            for (let i = 0; i < 4; i++) {
                if (i % 2 == 0) {
                    leftLineSensor.setMode(ColorSensorMode.RgbRaw);
                    rightLineSensor.setMode(ColorSensorMode.RgbRaw);
                } else {
                    leftLineSensor.setMode(ColorSensorMode.RefRaw);
                    rightLineSensor.setMode(ColorSensorMode.RefRaw);
                }
                pause(100);
            }
        } else if (leftLineSensor instanceof sensors.NXTLightSensor && rightLineSensor instanceof sensors.NXTLightSensor) { // Если датчики отражения nxt были до этого установлены
            for (let i = 0; i < 10; i++) { // Опрос датчиков, чтобы датчики дальше давали правильные показания
                leftLineSensor.reflectetLightRaw();
                rightLineSensor.reflectetLightRaw();
                pause(1);
            }
        } else {
            console.log("Error: the line sensors were not installed!");
            // control.assert(false, 2);
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