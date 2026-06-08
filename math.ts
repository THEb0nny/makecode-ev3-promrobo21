namespace Math {

    // Вспомогательная функция расчёта движения на дистанцию в мм
    export function distanceToTicks(distance: number): number {
        return (distance / (Math.PI * chassis.getWheelDiametr())) * motors.cpr; // Дистанция в мм, которую нужно пройти
    }

    // Вспомогательная функция расчёта поворота в градусах
    export function turnToTicks(degrees: number): number {
        return ((degrees * chassis.getBaseLength()) / chassis.getWheelDiametr()) * (motors.cpr / 360);
    }

    // Вспомогательная функция, которая возвращает наименьшее из трех чисел
    export function min3(a: number, b: number, c: number): number {
        return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
    }

    // Вспомогательная функция, которая возвращает наибольшее из трех чисел
    export function max3(a: number, b: number, c: number): number {
        return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
    }

    // Возвращает значение x, если оно находится в диапазоне от min до max. Если значение выходит за пределы диапазона, возвращает min или max
    export function clip(a: number, b: number, c: number): number {
        return Math.min(c, Math.max(b, a));
    }

}