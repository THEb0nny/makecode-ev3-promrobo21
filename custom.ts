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