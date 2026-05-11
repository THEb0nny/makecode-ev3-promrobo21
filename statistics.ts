namespace arrays {

    /**
     * Нахождение суммы элементов массива.
     * Если массив был пустым, то вернёт 0.
     * @param numbers массив чисел
     */
    //% blockId="Sum"
    //% block="sum of $numbers array"
    //% block.loc.ru="сумма элементов массива $numbers"
    //% weight="99"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function sum(numbers: number[]): number {
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) sum += numbers[i];
        return sum;
    }

    /**
     * Нахождение минимального элемента массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="Min"
    //% block="minimum of $numbers array"
    //% block.loc.ru="минимальный элемент массива $numbers"
    //% weight="98"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function min(numbers: number[]): number {
        if (numbers.length === 0) return null;
        let min = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] < min) min = numbers[i];
        }
        return min;
    }

    /**
     * Нахождение максимального элемента массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="Max"
    //% block="maximum of $numbers array"
    //% block.loc.ru="максимальный элемент массива $numbers"
    //% weight="97"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function max(numbers: number[]): number {
        if (numbers.length === 0) return null;
        let max = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) max = numbers[i];
        }
        return max;
    }

    /**
     * Поиск наиболее часто встречающегося числа в массиве - мода.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив с числами
     */
    //% blockId="Mode"
    //% block="mode of $numbers array"
    //% block.loc.ru="часто встречающийся элемент массива $numbers"
    //% weight="89"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function mode(numbers: number[]): number {
        if (numbers.length === 0) return null;
        numbers.sort((a, b) => a - b); // Сортируем массив для более эффективного подсчета частоты
        let maxCount = 0, currentCount = 1;
        let currentNum = numbers[0], mostFrequentNum = numbers[0];
        // Проходим по отсортированному массиву, подсчитывая частоту каждого числа
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] === currentNum) currentCount++;
            else {
                if (currentCount > maxCount) {
                    maxCount = currentCount;
                    mostFrequentNum = currentNum;
                }
                currentNum = numbers[i];
                currentCount = 1;
            }
        }
        if (currentCount > maxCount) mostFrequentNum = currentNum; // Проверяем последнее число
        return mostFrequentNum;
    }

    /**
     * Нахождение медианы массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="Median"
    //% block="median of $numbers array"
    //% block.loc.ru="медиана массива $numbers"
    //% weight="88"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function median(numbers: number[]): number {
        if (numbers.length === 0) return null;
        numbers = numbers.sort((a, b) => a - b);
        const half = Math.floor(numbers.length / 2);
        return numbers.length % 2 ? numbers[half] : (numbers[half - 1] + numbers[half]) / 2;
    }

    /**
     * Нахождение среднего арифметического числа из массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="Mean"
    //% block="average of $numbers array"
    //% block.loc.ru="среднее арифметическое массива $numbers"
    //% weight="87"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function mean(numbers: number[]): number {
        if (numbers.length === 0) return null;
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) sum += numbers[i];
        return sum / numbers.length;
    }

    /**
     * Нахождение размаха массива.
     * Размах - это максимальный элемент - минимальный элемент.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="Range"
    //% block="range of $numbers array"
    //% block.loc.ru="размах массива $numbers"
    //% weight="86"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function range(numbers: number[]): number {
        if (numbers.length === 0) return null;
        let min = numbers[0];
        let max = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            const value = numbers[i];
            if (value < min) min = value;
            else if (value > max) max = value;
        }
        return max - min;
    }

    /**
     * Вычисление суммы квадратов отклонений элементов массива от среднего значения.
     * Используется для расчёта дисперсии и стандартного отклонения.
     */
    function varianceCore(numbers: number[]): number {
        // Welford algorithm
        let mean = 0;
        let varianceSum = 0;
        for (let i = 0; i < numbers.length; i++) {
            const value = numbers[i];
            const deltaBefore = value - mean; // Насколько новое значение отличается от текущего среднего
            mean += deltaBefore / (i + 1); // Обновляем среднее
            const deltaAfter = value - mean; // Отклонение после обновления среднего
            varianceSum += deltaBefore * deltaAfter; // Накапливаем сумму квадратов отклонений
        }
        return varianceSum;
    }

    /**
     * Нахождение генеральной дисперсии массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="PopulationVariance"
    //% block="population variance of $numbers array"
    //% block.loc.ru="генеральная дисперсия массива $numbers"
    //% weight="79"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function populationVariance(numbers: number[]): number {
        if (numbers.length === 0) return null;
        return varianceCore(numbers) / numbers.length;
    }

    /**
     * Нахождение генерального стандартного отклонения массива.
     * Если массив был пустым, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="PopulationStandardDeviation"
    //% block="population standard deviation of $numbers array"
    //% block.loc.ru="генеральное стандартное отклонение массива $numbers"
    //% weight="78"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function populationStandardDeviation(numbers: number[]): number {
        return Math.sqrt(populationVariance(numbers));
    }

    /**
     * Нахождение выборочной дисперсии массива.
     * Если массив содержит менее двух элементов, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="SampleVariance"
    //% block="sample variance of $numbers array"
    //% block.loc.ru="выборочная дисперсия массива $numbers"
    //% weight="77"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function sampleVariance(numbers: number[]): number {
        if (numbers.length < 2) return null;
        return varianceCore(numbers) / (numbers.length - 1);
    }

    /**
     * Нахождение выборочного стандартного отклонения массива.
     * Если массив содержит менее двух элементов, то вернёт null.
     * @param numbers массив чисел
     */
    //% blockId="SampleStandardDeviation"
    //% block="sample standard deviation of $numbers array"
    //% block.loc.ru="выборочное стандартное отклонение массива $numbers"
    //% weight="76"
    //% blockNamespace="custom"
    //% subcategory="Дополнительно"
    //% group="Статистика"
    export function sampleStandardDeviation(numbers: number[]): number {
        return Math.sqrt(sampleVariance(numbers));
    }
}