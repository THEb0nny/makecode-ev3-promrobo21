namespace chassis {

    /**
     * Команда руления моторами шасси от регулятора.
     * @param u управляющее воздействие, eg: 0
     * @param speed скорость (мощность) движения, eg: 50
     */
    //% blockId="RegulatorSteering"
    //% block="regulator steering on u = $u at $speed\\%"
    //% block.loc.ru="руление регулятором на u = $u на $speed\\%"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function regulatorSteering(u: number, speed: number) {
        let mLeft = speed + u, mRight = speed - u;
        setSpeedsCommand(mLeft, mRight);
    }

    /**
     * Команда нормализованного руления моторами шасси от регулятора.
     * @param u управляющее воздействие, eg: 0
     * @param speed скорость (мощность) движения, eg: 50
     */
    //% blockId="NormalizedRegulatorSteering"
    //% block="normalized regulator steering on u = $u at $speed\\%"
    //% block.loc.ru="нормализованное руление регулятором по u = $u на $speed\\%"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="88"
    //% group="Move"
    export function normalizedRegulatorSteering(u: number, speed: number) {
        let mLeft = speed + u, mRight = speed - u;
        const z = speed / Math.max(Math.abs(mLeft), Math.abs(mRight));
        mLeft *= z; mRight *= z;
        setSpeedsCommand(mLeft, mRight);
    }

    /**
     * Линейное движение на расстояние в мм с постоянной скоростью (мощностью).
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость (мощность) движения, eg: 60
     * @param braking тип торможения, eg: MotionBraking.Hold
     */
    //% blockId="LinearDistMove"
    //% block="linear distance moving $dist mm at $speed\\% braking $braking"
    //% block.loc.ru="линейное движение на расстояние $dist мм с $speed\\% торможение $braking"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% weight="79" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение в мм"
    export function linearDistMove(dist: number, speed: number, braking: MotionBraking = MotionBraking.Hold) {
        if (speed == 0 || dist == 0) {
            stop(Braking.Hold);
            return;
        } else if (dist < 0) {
            stop(Braking.Hold);
            console.log("Error: the driving distance is negative!");
            music.playSoundEffect(sounds.systemGeneralAlert);
            return;
        }
        const mRotCalc = Math.calculateDistanceToEncRotate(dist); // Расчёт угла поворота на дистанцию
        syncMovement(speed, speed, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Движение на расстояние в мм с независимыми скоростями (мощностями) на моторы.
     * Значение дистанции должно быть положительным! Если значение скорости (мощностей) положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * @param dist дистанция движения в мм, eg: 100
     * @param speedLeft скорость (мощность) левого мотора, eg: 50
     * @param speedRight скорость (мощность) правого мотора, eg: 50
     * @param braking тип торможения, eg: Braking.Hold
     */
    //% blockId="DistMove"
    //% block="distance moving $dist mm at $speedLeft\\% $speedRight\\% braking $braking"
    //% block.loc.ru="движение на расстояние $dist мм с $speedLeft\\% $speedRight\\% торможение $braking"
    //% inlineInputMode="inline"
    //% speedLeft.shadow="motorSpeedPicker"
    //% speedRight.shadow="motorSpeedPicker"
    //% weight="78"
    //% subcategory="Движение"
    //% group="Синхронизированное движение в мм"
    export function distMove(dist: number, speedLeft: number, speedRight: number, braking: MotionBraking = MotionBraking.Hold) {
        if (dist == 0 || speedLeft == 0 && speedRight == 0) {
            stop(Braking.Hold);
            return;
        } else if (dist < 0) {
            stop(Braking.Hold);
            console.log("Error: the driving distance is negative!");
            music.playSoundEffect(sounds.systemGeneralAlert);
            return;
        }

        const mRotCalc = Math.calculateDistanceToEncRotate(dist); // Расчёт угла поворота на дистанцию
        
        syncMovement(speedLeft, speedRight, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Линейное движение на заданное расстояние с ускорением и замедлением в мм.
     * Не рекомендуется использоваться стартовую скорость (мощность) меньше 20.
     * Значение дистанции должно быть положительным! Если значение скорости (мощности) положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Значения скоростей (мощностей) должны иметь одинаковый знак!
     * @param totalDist общее расстояние в мм, eg: 300
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param startSpeed начальная скорость (мощность) движения, eg: 20
     * @param maxSpeed максимальная скорость (мощность) движения, eg: 70
     * @param finishSpeed финишная скорость (мощность) движения, eg: 10
     */
    //% blockId="RampLinearDistMove"
    //% block="linear distance moving $totalDist mm|at acceleration $accelDist deceleration $decelDist|from start $startSpeed\\% max $maxSpeed\\% finish $finishSpeed\\%"
    //% block.loc.ru="линейное движение на расстояние $totalDist мм|при ускорении $accelDist замедлении $decelDist|c стартовой $startSpeed\\% макс $maxSpeed\\% финишной $finishSpeed\\%"
    //% inlineInputMode="inline"
    //% startSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% finishSpeed.shadow="motorSpeedPicker"
    //% weight="89"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function rampLinearDistMove(startSpeed: number, maxSpeed: number, finishSpeed: number, totalDist: number, accelDist: number, decelDist: number) {
        if (maxSpeed == 0 || totalDist == 0) {
            stop(Braking.Hold);
            return;
        } else if (Math.abs(startSpeed) > Math.abs(maxSpeed) || Math.abs(finishSpeed) > Math.abs(maxSpeed) || 
            totalDist < 0 || accelDist < 0 || decelDist < 0 || totalDist < accelDist + decelDist) {
            stop(Braking.Hold);
            console.log("Error: parameters passed incorrectly in rampLinearDistMove!");
            music.playSoundEffect(sounds.systemGeneralAlert);
            return;
        }
        
        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(totalDist); // Рассчитываем общую дистанцию

        syncRampMovement(startSpeed, maxSpeed, finishSpeed, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
    }

    /**
     * Синхронизация движения с плавным стартом в мм.
     * Не рекомендуется устанавливать минимальную скорость меньше 20.
     * Значение дистанции должно быть положительным! Если значение скорости (мощности) положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Значения скоростей (мощностей) должны иметь одинаковый знак!
     * @param accelDist расстояние ускорения в мм, eg: 50
     * @param totalDist общее расстояние в мм, если его не указать значение будет равно accelDist, тогда, eg: 100
     * @param startSpeed начальная скорость (мощность) движени, eg: 20
     * @param maxSpeed максимальная скорость (мощность) движения, eg: 50
     */
    //% blockId="AccelStartLinearDistMove"
    //% block="acceleration in linear motion from $startSpeed\\% to $maxSpeed\\% per  $accelDist mm||at total distance $totalDist"
    //% block.loc.ru="ускорение при линейном движении c $startSpeed\\% до $maxSpeed\\% за $accelDist мм||при общей дистанции $totalDist"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% startSpeed.shadow="motorSpeedPicker"
    //% maxSpeed.shadow="motorSpeedPicker"
    //% weight="88" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function accelStartLinearDistMove(startSpeed: number, maxSpeed: number, accelDist: number, totalDist?: number) {
        if (maxSpeed == 0 || accelDist == 0) {
            stop(Braking.Hold);
            return;
        } else if (Math.abs(startSpeed) > Math.abs(maxSpeed) || 
            accelDist < 0 || totalDist < 0 || totalDist < accelDist) {
            stop(Braking.Hold);
            console.log("Error: parameters passed incorrectly in accelStartLinearDistMove!");
            music.playSoundEffect(sounds.systemGeneralAlert);
            return;
        }

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения
        const mRotTotalCalc = totalDist ? Math.calculateDistanceToEncRotate(totalDist) : mRotAccelCalc; // Рассчитываем общую дистанцию

        executeRampMovement(startSpeed, maxSpeed, 0, mRotAccelCalc, 0, mRotTotalCalc); // Выполнение синхронизированного движения с фазами
        steeringCommand(0, maxSpeed); // Без команды торможения, а просто ехать дальше вперёд
    }

    /**
     * Синхронизация движения с плавным сбросом скорости (мощности) мм.
     * Значение дистанции должно быть положительным! Если значение скорости положительное, тогда моторы крутятся вперёд, а если отрицательно, тогда назад.
     * Значения скоростей (мощности) должны иметь одинаковый знак!
     * @param decelDist расстояние замедления в мм, eg: 50
     * @param totalDist общее расстояние в мм, если его не указать значение будет равно decelDist, eg: 100
     * @param speed изначальная скорость (мощность) движения, eg: 50
     * @param finishSpeed финишная скорость (мощность) движения, eg: 10
     */
    //% blockId="DecelFinishLinearDistMove"
    //% block="deceleration in linear motion from $speed\\% to $finishSpeed\\% per $decelDist mm||at total distance of $totalDist"
    //% block.loc.ru="замеделение при линейном движении c $speed\\% до $finishSpeed\\% за $decelDist мм||при общей дистанции $totalDist"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% speed.shadow="motorSpeedPicker"
    //% finishSpeed.shadow="motorSpeedPicker"
    //% weight="87" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function decelFinishLinearDistMove(speed: number, finishSpeed: number, decelDist: number, totalDist?: number) {
        if (speed == 0) {
            stop(Braking.Hold);
            return;
        } else if (Math.abs(finishSpeed) > Math.abs(speed) || 
            decelDist < 0 || totalDist < 0 || totalDist < decelDist) {
            stop(Braking.Hold);
            console.log("Error: parameters passed incorrectly in decelFinishLinearDistMove!");
            music.playSoundEffect(sounds.systemGeneralAlert);
            return;
        }

        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления
        const mRotTotalCalc = totalDist ? Math.calculateDistanceToEncRotate(totalDist) : mRotDecelCalc; // Рассчитываем общую дистанцию

        executeRampMovement(0, speed, finishSpeed, 0, mRotDecelCalc, mRotTotalCalc); // Выполнение синхронизированного движения с фазами
        stop(Braking.Hold); // Тормоз с удержанием
    }

    //% blockId="RampDistMove"
    //% block="distance moving $totalDist|mm acceleration $accelDist|deceleration $decelDist|at $speed|\\%"
    //% block.loc.ru="движение на расстояние $totalDist|мм ускорения $accelDist|замедления $decelDist|с $speed|\\%"
    //% inlineInputMode="inline"
    //% minSpeed.shadow="motorSpeedPicker"
    //% maxSpeedLeft.shadow="motorSpeedPicker"
    //% maxSpeedRight.shadow="motorSpeedPicker"
    //% weight="88"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями"
    //% blockHidden="true"
    export function rampDistMove(minSpeed: number, maxSpeedLeft: number, maxSpeedRight: number, totalDist: number, accelDist: number, decelDist: number) {
        //if (!motorsPair) return;

        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(totalDist); // Рассчитываем общую дистанцию

        // advmotctrls.syncMotorsConfig(maxSpeedLeft, maxSpeedRight);
        advmotctrls.accTwoEncConfig(minSpeed, maxSpeedRight, minSpeed, mRotAccelCalc, mRotDecelCalc, mRotTotalCalc);
        pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов регулирования
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.reset(); // Сбросить ПИД регулятор
        
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Перед запуском мы считываем значение с энкодера на левом и правом двигателе

        let prevTime = 0; // Переменная времени за предыдущую итерацию цикла
        while (true) {
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            let out = advmotctrls.accTwoEnc(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            // let error = advmotctrls.getErrorSyncMotors(eml, emr); // Find out the error in motor speed control
            let error = advmotctrls.getErrorSyncMotorsAtPwr(eml, emr, out.pwr, out.pwr);
            pidChassisSync.setPoint(error); // Transfer control error to controller
            let U = pidChassisSync.compute(dt, 0); // Find out and record the control action of the regulator
            // let powers = advmotctrls.getPwrSyncMotors(U);
            let powers = advmotctrls.getPwrSyncMotorsAtPwr(U, out.pwr, out.pwr);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold);
    }

}