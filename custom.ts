namespace music {

    /**
     * A function to trigger a tone in the background (parallel task).
     * Функция для запуска тона в фоне (паралельной задачи).
     * @param frequency pitch of the tone to play in Hertz (Hz), eg: Note.C
     * @param ms tone duration in milliseconds(ms), eg: BeatFraction.Half
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
     * A function for setting the color pattern indicator in the background (parallel task).
     * Функция для установки индикатору шаблона цвета в фоне (паралельной задачи).
     * @param pattern the lights pattern to use. eg: StatusLight.Orange
     * @param duration in milliseconds(ms), eg: 100
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