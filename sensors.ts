namespace sensors {

    /**
     * Функция для программной калибровки и нормализации сырых значений с датчика.
     * @param rawRefValColorS направление поворота, eg: 0
     * @param blackValColorS направление поворота, eg: 500
     * @param whiteValColorS скорость движения, eg: 650
     */
    //% blockId="GetNormRefValCS"
    //% block="получить норм-ое знач-е отраж-я где сырое значение $refRawValCS|и чёрное $bRefRawValCS|и белое $wRefRawValCS"
    //% inlineInputMode="inline"
    //% weight="8"
    //% group="Color Sensor"
    export function GetNormRefValCS(refRawValCS: number, bRefRawValCS: number, wRefRawValCS: number): number {
        let refValCS = Math.map(refRawValCS, bRefRawValCS, wRefRawValCS, 0, 100);
        refValCS = Math.constrain(refValCS, 0, 100);
        return refValCS;
    }

    export function RgbToHsvlConverter(rgbArr: number[]): number[] {
        // https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/Color.bpm
        let r = rgbArr[0], g = rgbArr[1], b = rgbArr[2];

        // https://clev3r.ru/codesamples/
        // Color sensor V2 RGB Maxmium is 255
        r = Math.constrain(r, 0, 255);
        g = Math.constrain(g, 0, 255);
        b = Math.constrain(b, 0, 255);

        let hue = 0, sat = 0, val = 0;

        let max = Math.max(Math.max(r, g), b);
        let min = Math.min(Math.min(r, g), b);
        let light = (max + min) / 5.12;
        val = max / 2.56;
        if (val == 0) { // It's black, there's no way to tell hue and sat
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
            if (sat == 0) hue = -1;

            if (hue != -1) { // It's white, there's no way to tell hue
                r = (r - min) / (max - min);
                g = (g - min) / (max - min);
                b = (b - min) / (max - min);
                max = Math.max(Math.max(r, g), b);
                min = Math.min(Math.min(r, g), b);

                if (max == r) {
                    hue = 0 + 60 * (g - b);
                    if (hue < 0) hue += 360;
                } else if (max == g) hue = 120 + 60 * (b - r);
                else hue = 240 + 60 * (r - g);
            }
        }
        return [Math.round(hue), Math.round(sat), Math.round(val), Math.round(light)];
    }

    // Перевести HSV в код цвета
    export function HsvToColorNum(hsvl: number[]): number {
        const HSV_TO_COLOR_S_TRESHOLD = 50;
        const H = hsvl[0], S = hsvl[1], V = hsvl[2];
        if (S > HSV_TO_COLOR_S_TRESHOLD) { // Граница цветности
            if (H < 25) return 5; // red
            else if (H < 50) return 7; // brown
            else if (H < 100) return 4; // yellow
            else if (H < 180) return 3; // green
            else if (H < 250) return 2; // blue
            else if (H < 360) return 5; // red
            else return -1; // error
        } else if (V >= 40) return 6; // white
        else if (V > 5) return 1; // black
        else return 0;
    }

}