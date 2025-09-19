namespace Math {

    // Вспомогательная функция расчёта движения на дистанцию в мм
    export function calculateDistanceToEncRotate(distance: number): number {
        return (distance / (Math.PI * chassis.getWheelDiametr())) * motors.cpr; // Дистанция в мм, которую нужно пройти
    }

    // This define returns the smallest of the three numbers
    export function min3(a: number, b: number, c: number): number {
        return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
    }

    // This function returns the biggest of the three numbers
    export function max3(a: number, b: number, c: number): number {
        return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
    }

    // Returns x if it is between min and max. If outside the range, it returns min or max.
    export function clip(a: number, b: number, c: number): number {
        return Math.min(c, Math.max(b, a));
    }

}