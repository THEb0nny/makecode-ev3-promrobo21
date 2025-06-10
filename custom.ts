namespace custom {

    /**
     * Поиск наиболее часто встречающегося числа в массиве.
     * @param arr массив с числами
     */
    //% blockId="MostFrequentNumber"
    //% block="get most common number from $arr array"
    //% block.loc.ru="получить часто встречающийся элемент из массива $arr"
    //% weight="99"
    //% group="Сортировка массива"
    export function mostFrequentNumber(arr: number[]): number {
        arr.sort((a, b) => a - b); // Сортируем массив для более эффективного подсчета частоты
        let maxCount = 0, currentCount = 1;
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

    export function calculateMedian(numbers: number[]): number {
        if (numbers.length === 0) return null;
        numbers = numbers.sort((a, b) => a - b);
        const half = Math.floor(numbers.length / 2);
        return numbers.length % 2 ? numbers[half] : (numbers[half - 1] + numbers[half]) / 2;
    }

}

namespace music {

    /**
     * Функция для запуска тона в фоне (паралельной задачи).
     * @param frequency высота воспроизводимого звукового сигнала в герцах (Гц), eg: Note.C
     * @param duration длительность звукового сигнала в миллисекундах (мс), eg: BeatFraction.Half
     */
    //% blockId="PlayToneInBackground"
    //% block="play tone at $frequency for $duration in the background"
    //% block.loc.ru="проиграть тон $frequency продолжительностью $duration в фоне"
    //% frequency.shadow="device_note"
    //% duration.shadow="device_beat"
    //% weight="75" blockGap="8"
    //% group="Tone"
    export function playToneInBackground(frequency: number, duration: number) {
        control.runInParallel(function () {
            music.playTone(frequency, duration);
        });
    }

}

namespace brick {

    /**
     * Функция для установки индикатору шаблона цвета в фоне (паралельной задачи).
     * @param pattern создайте шаблон подсветки для использования, eg: StatusLight.Orange
     * @param duration длительность в миллисекундах (мс), eg: 100
     */
    //% blockId="SetStatusLightInBackground"
    //% block="set status light to $pattern at $duration in the background"
    //% block.loc.ru="установить индикатор $pattern продолжительностью $duration в фоне"
    //% help="brick/set-status-light"
    //% weight="98"
    //% group="Indicator"
    export function setStatusLightInBackground(pattern: StatusLight, duration: number) {
        control.runInParallel(function () {
            brick.setStatusLight(pattern);
            pause(duration);
            brick.setStatusLight(StatusLight.Off);
        });
    }

}