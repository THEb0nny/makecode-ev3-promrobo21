namespace chassis {

    /**
     * Linear movement over a distance in mm at a constant speed.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * Линейное движение на расстояние в мм с постоянной скоростью.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость движения, eg: 60
     * @param braking тип торможения, eg: Braking.Hold
     */
    //% blockId="LinearDistMove"
    //% block="linear distance moving $dist mm at $speed\\% braking $braking"
    //% block.loc.ru="линейное движение на расстояние $dist мм на $speed\\% торможение $braking"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="79" blockGap="8"
    //% group="Синхронизированное движение"
    export function LinearDistMove(dist: number, speed: number, braking: Braking = Braking.Hold) {
        if (speed == 0 || dist == 0) {
            chassis.stop(true);
            return;
        } else if (dist < 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const mRotCalc = Math.abs((dist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speed, speed, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Movement over a distance in mm with independent speeds on motors.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Движение на расстояние в мм с независимыми скоростями на моторы.
     * @param dist дистанция движения в мм, eg: 100
     * @param speedLeft скорость левого мотора, eg: 50
     * @param speedRight скорость правого мотора, eg: 50
     * @param braking тип торможения, eg: Braking.Hold
     */
    //% blockId="DistMove"
    //% block="distance moving $dist mm at $speedLeft\\% $speedRight\\% braking $braking"
    //% block.loc.ru="движение на расстояние $dist мм на $speedLeft\\% $speedRight\\% торможение $braking"
    //% inlineInputMode="inline"
    //% speedLeft.shadow="motorSpeedPicker"
    //% speedRight.shadow="motorSpeedPicker"
    //% weight="78"
    //% group="Синхронизированное движение"
    export function DistMove(dist: number, speedLeft: number, speedRight: number, braking: Braking = Braking.Hold) {
        if (dist == 0 || speedLeft == 0 && speedRight == 0) {
            chassis.stop(true);
            return;
        } else if (dist < 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const mRotCalc = Math.abs((dist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчёт угла поворота на дистанцию
        chassis.syncMovement(speedLeft, speedRight, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Linear movement over a given distance with acceleration and deceleration in mm. It is not recommended to use a minimum speed of less than 10.
     * The distance value must be positive! If the speed value is positive, then the motors spin forward, and if it is negative, then backward.
     * The speed values must have the same sign!
     * Линейное движение на заданное расстояние с ускорением и замедлением в мм. Не рекомендуется использоваться минимальную скорость меньше 10.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Значения скоростей должны иметь одинаковый знак!
     * @param minSpeed начальная скорость движения, eg: 10
     * @param maxSpeed максимальная скорость движения, eg: 50
     * @param totalDist общее расстояние в мм, eg: 300
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 100
     */
    //% blockId="RampLinearDistMove"
    //% block="linear distance moving $totalDist mm|at acceleration $accelDist deceleration $decelDist|min speed $minSpeed\\% max $maxSpeed\\%"
    //% block.loc.ru="линейное движение на расстояние $totalDist мм|при ускорении $accelDist замедлении $decelDist|c мин скоростью $minSpeed\\% макс $maxSpeed\\%"
    //% inlineInputMode="inline"
    //% minSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% weight="77" blockGap="8"
    //% group="Синхронизированное движение"
    export function RampLinearDistMove(minSpeed: number, maxSpeed: number, totalDist: number, accelDist: number, decelDist: number) {
        if (maxSpeed == 0 || Math.abs(minSpeed) >= Math.abs(maxSpeed) || (minSpeed < 0 && maxSpeed > 0) || (minSpeed > 0 && maxSpeed < 0) || totalDist <= 0 || accelDist < 0 || decelDist < 0) {
            chassis.stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        let mRotAccelCalc = Math.abs((accelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние ускорения
        let mRotDecelCalc = Math.abs((decelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние замедления
        let mRotTotalCalc = Math.abs((totalDist / (Math.PI * chassis.getWheelRadius())) * 360); // Рассчитываем общюю дистанцию
        chassis.syncRampMovement(minSpeed, maxSpeed, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
    }

    /**
     * Synchronization with smooth acceleration in straight-line motion without braking. It is not recommended to set the minimum speed to less than 10.
     * Синхронизация с плавным ускорением при прямолинейном движении без торможения. Не рекомендуется устанавливать минимальную скорость меньше 10.
     * @param totalDist total length encoder value at, eg. 500
     * @param accelDist accelerate length encoder value, eg. 50
     * @param minSpeed start motor speed, eg. 10
     * @param maxSpeed max motor speed, eg. 50
     */
    //% blockId="RampLinearDistMoveWithoutBraking"
    //% block="linear distance moving $totalDist mm at acceleration $accelDist|min speed $minSpeed\\% max $maxSpeed\\% without braking"
    //% block.loc.ru="линейное движение на расстояние $totalDist мм при ускорении $accelDist|c мин скоростью $minSpeed\\% макс $maxSpeed\\% без торможения"
    //% inlineInputMode="inline"
    //% minSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% weight="76"
    //% group="Синхронизированное движение"
    export function RampLinearDistMoveWithoutBraking(minSpeed: number, maxSpeed: number, totalDist: number, accelDist: number) {
        //if (!motorsPair) return;
        if (maxSpeed == 0 || totalDist == 0) {
            stop(true);
            music.playSoundEffect(sounds.systemGeneralAlert);
            pause(2000);
            return;
        }
        const emlPrev = leftMotor.angle(); // Перед запуском мы считываем значение с энкодера на левом двигателе
        const emrPrev = rightMotor.angle(); // Перед запуском мы считываем значение с энкодера на правом двигателе
        advmotctrls.accTwoEncConfig(minSpeed, maxSpeed, accelDist, 0, totalDist);
        const pidChassisSync = new automation.PIDController(); // Создаём объект пид регулятора
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Setting the regulator coefficients
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор
        let prevTime = 0;
        while (true) {
            let currTime = control.millis();
            let dt = currTime - prevTime;
            prevTime = currTime;
            let eml = leftMotor.angle() - emlPrev;
            let emr = rightMotor.angle() - emrPrev;
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break;
            let error = advmotctrls.getErrorSyncMotorsInPwr(eml, emr, out.pwrOut, out.pwrOut);
            pidChassisSync.setPoint(error);
            let U = pidChassisSync.compute(dt, 0);
            let powers = advmotctrls.getPwrSyncMotorsInPwr(U, out.pwrOut, out.pwrOut);
            chassis.leftMotor.run(powers.pwrLeft);
            chassis.rightMotor.run(powers.pwrRight);
            control.pauseUntilTime(currTime, 5);
        }
        // Без команды торможения
    }

    // /**
    //  * Movement over a given distance with acceleration and deceleration in mm. It is not recommended to set the minimum speed to less than 10.
    //  * Движение на заданное расстояние с ускорением и замедлением в мм. Не рекомендуется устанавливать минимальную скорость меньше 10.
    //  * @param speedLeft скорость движения, eg: 50
    //  * @param speedRight скорость движения, eg: 50
    //  * @param totalDist общее расстояние в мм, eg: 300
    //  * @param accelDist расстояние ускорения в мм, eg: 100
    //  * @param decelDist расстояние замедления в мм, eg: 100
    //  */
    // //% blockId="RampDistMove"
    // //% block="distance moving $totalDist|mm acceleration $accelDist| deceleration $decelDist| at speed $speed|\\%"
    // //% block.loc.ru="движение на расстояние $totalDist|мм ускорения $accelDist| замедления $decelDist| со скоростью $speed|\\%"
    // //% inlineInputMode="inline"
    // //% speed.shadow="motorSpeedPicker"
    // //% weight="76"
    // //% group="Синхронизированное движение"
    // //% blockHidden="true"
    // export function RampDistMove(speedLeft: number, speedRight: number, totalDist: number, accelDist: number, decelDist: number) {
    //     if (speedLeft == 0 || speedRight == 0) {
    //         chassis.stop(true);
    //         music.playSoundEffect(sounds.systemGeneralAlert);
    //         pause(2000);
    //         return;
    //     }
    //     let mRotAccelCalc = Math.abs((accelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние ускорения
    //     let mRotDecelCalc = Math.abs((decelDist / (Math.PI * chassis.getWheelRadius())) * 360); // Расчитываем расстояние замедления
    //     let mRotTotalCalc = Math.abs((totalDist / (Math.PI * chassis.getWheelRadius())) * 360); // Рассчитываем общюю дистанцию
    // }

}