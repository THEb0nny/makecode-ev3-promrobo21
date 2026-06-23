namespace sensors {

    // let minRgbHtColorSensors: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Минимальные значения RGB для датчиков цвета
    // let maxRgbHtColorSensors: number[][] = [[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]]; // Максимальные значения RGB для датчиков цвета

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

    // export function setHtColorSensorMinRgbValues(sensor: sensors.HiTechnicColorSensor2, minR: number, minG: number, minB: number) {
    //     if (minR < 0 || minG < 0 || minB < 0) {
    //         console.log(`Warning: Negative min RGB values for CS${sensor.port()}. Using absolute value.`);
    //     }
    //     const index = sensor.port() - 1;
    //     minRgbColorSensors[index] = [Math.abs(minR), Math.abs(minG), Math.abs(minB)];
    // }

    // export function setHtColorSensorMaxRgbValues(sensor: sensors.HiTechnicColorSensor2, maxR: number, maxG: number, maxB: number) {
    //     if (maxR < 0 || maxG < 0 || maxB < 0) {
    //         console.log(`Warning: Negative max RGB values for CS${sensor.port()}. Using absolute value.`);
    //     }
    //     const index = sensor.port() - 1;
    //     maxRgbColorSensors[index] = [Math.abs(maxR), Math.abs(maxG), Math.abs(maxB)];
    // }

    // export function getMinRgbHtColorSensor(sensor: sensors.HiTechnicColorSensor2): number[] {
    //     const index = sensor.port() - 1;
    //     return minRgbColorSensors[index];
    // }

    // export function getMaxRgbHtColorSensor(sensor: sensors.HiTechnicColorSensor2): number[] {
    //     const index = sensor.port() - 1;
    //     return maxRgbColorSensors[index];
    // }

    export function setHsvlToColorNumBoundariesHtColorSensor(sensor: sensors.HiTechnicColorSensor2, boundaries: ColorBoundaries) {
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

    export function getHsvlToColorNumBoundariesHtColorSensor(sensor: sensors.HiTechnicColorSensor2): ColorBoundaries {
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

}