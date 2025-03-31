namespace math {

    /**
     * Find the most frequently occurring number in an array.
     * Поиск наиболее часто встречающегося числа в массиве.
     * @param arr массив с числами
     */
    //% blockId="MostFrequentNumber"
    //% block="get most common number from $arr array"
    //% block.loc.ru="получить часто встречающийся элемент из массива $arr"
    //% weight="89"
    export function mostFrequentNumber(arr: number[]): number {
        arr.sort((a, b) => a - b); // Сортируем массив для более эффективного подсчета частоты
        let maxCount = 0, currentCount = 1;;
        let currentNum = arr[0], mostFrequentNum = arr[0];
        // Проходим по отсортированному массиву, подсчитывая частоту каждого числа
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === currentNum) currentCount++;
            else {
                if (currentCount > maxCount) {
                    maxCount = currentCount;
                    mostFrequentNum = currentNum;
                }
                currentNum = arr[i];
                currentCount = 1;
            }
        }
        if (currentCount > maxCount) mostFrequentNum = currentNum; // Проверяем последнее число
        return mostFrequentNum;
    }

    // Вспомогательная функция расчёта движения на дистанцию в мм
    export function calculateDistanceToEncRotate(distance: number): number {
        return (distance / (Math.PI * chassis.getWheelDiametr())) * 360; // Дистанция в мм, которую нужно пройти
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