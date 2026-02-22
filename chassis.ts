namespace chassis {

    /**
     * Команда руления моторами шасси от регулятора.
     * @param u управляющее воздействие, eg: 0
     * @param v скорость (мощность) движения, eg: 50
     */
    //% blockId="RegulatorSteering"
    //% block="regulator steering on u = $u at $v\\%"
    //% block.loc.ru="руление регулятором на u = $u на $v\\%"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% weight="89"
    //% group="Move"
    export function regulatorSteering(u: number, v: number) {
        const pLeft = v + u, pRight = v - u;
        setSpeedsCommand(pLeft, pRight);
    }

    /**
     * Команда нормализованного руления моторами шасси от регулятора.
     * @param u управляющее воздействие, eg: 0
     * @param v скорость (мощность) движения, eg: 50
     */
    //% blockId="NormalizedRegulatorSteering"
    //% block="normalized regulator steering on u = $u at $v\\%"
    //% block.loc.ru="нормализованное руление регулятором по u = $u на $v\\%"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% weight="88"
    //% group="Move"
    export function normalizedRegulatorSteering(u: number, v: number) {
        let pLeft = v + u, pRight = v - u;
        const z = v / Math.max(Math.abs(pLeft), Math.abs(pRight));
        pLeft *= z, pRight *= z;
        setSpeedsCommand(pLeft, pRight);
    }

    /**
     * Линейное движение на расстояние в мм с постоянной скоростью (мощностью).
     * Для движения вперёд устанавливается положительная дистанция, а назад - отрицательная.
     * Скорость v всегда должна быть положительной (отрицательное значение будет взято по модулю).
     * @param dist дистанция движения в мм, eg: 100
     * @param v скорость (мощность) движения, eg: 60
     * @param braking тип торможения, eg: MotionBraking.Hold
     */
    //% blockId="LinearDistMove"
    //% block="linear distance moving $dist mm at $v\\% braking $braking"
    //% block.loc.ru="линейное движение на расстояние $dist мм с $v\\% торможение $braking"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% weight="79" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение в мм"
    export function linearDistMove(dist: number, v: number, braking: MotionBraking = MotionBraking.Hold) {
        if (v == 0 || dist == 0) {
            stop(Braking.Hold);
            return;
        }
        if (v < 0) console.log(`Warning: v is negative (${v}). Using absolute value.`);

        v = Math.abs(v); // Берём модуль скорости (мощности)
        const dirSign = Math.sign(dist); // Определяем направление по знаку dist

        const mRotCalc = Math.calculateDistanceToEncRotate(Math.abs(dist)); // Расчёт угла поворота на дистанцию
        syncMovement(v * dirSign, v * dirSign, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Движение на расстояние в мм с независимыми скоростями (мощностями) на моторы.
     * Для движения вперёд устанавливается положительная дистанция, а назад - отрицательная.
     * Скорости vLeft и vRight всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * Разные скорости позволяют роботу ехать по дуге. Обе скорости должны быть больше нуля!
     * @param dist дистанция движения в мм, eg: 100
     * @param vLeft скорость (мощность) левого мотора, eg: 50
     * @param vRight скорость (мощность) правого мотора, eg: 50
     * @param braking тип торможения, eg: MotionBraking.Hold
     */
    //% blockId="DistMove"
    //% block="distance moving $dist mm at $vLeft\\% $vRight\\% braking $braking"
    //% block.loc.ru="движение на расстояние $dist мм с $vLeft\\% $vRight\\% торможение $braking"
    //% inlineInputMode="inline"
    //% vLeft.shadow="motorSpeedPicker"
    //% vRight.shadow="motorSpeedPicker"
    //% weight="78"
    //% subcategory="Движение"
    //% group="Синхронизированное движение в мм"
    export function distMove(dist: number, vLeft: number, vRight: number, braking: MotionBraking = MotionBraking.Hold) {
        if (dist == 0 || vLeft == 0 || vRight == 0) {
            stop(Braking.Hold);
            return;
        }
        if (vLeft < 0) console.log(`Warning: vLeft is negative (${vLeft}). Using absolute value.`);
        if (vRight < 0) console.log(`Warning: vRight is negative (${vRight}). Using absolute value.`);

        vLeft = Math.abs(vLeft), vRight = Math.abs(vRight); // Берём модуль скорости
        const dirSign = Math.sign(dist); // Определяем направление по знаку dist

        const mRotCalc = Math.calculateDistanceToEncRotate(Math.abs(dist)); // Расчёт угла поворота на дистанцию
        
        syncMovement(vLeft * dirSign, vRight * dirSign, mRotCalc, MoveUnit.Degrees, braking);
    }

    /**
     * Линейное движение на заданное расстояние с ускорением и замедлением в мм.
     * Для движения вперёд устанавливается положительная totalDist дистанция, а назад - отрицательная.
     * Скорости всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * Расстояния ускорения и замедления всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * @param totalDist общее расстояние в мм, eg: 300
     * @param accelDist расстояние ускорения в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 150
     * @param vStart начальная скорость (мощность) движения, eg: 30
     * @param vMax максимальная скорость (мощность) движения, eg: 70
     * @param vFinish финишная скорость (мощность) движения, eg: 20
     */
    //% blockId="RampLinearDistMove"
    //% block="linear distance moving $totalDist mm|at acceleration $accelDist deceleration $decelDist|from start $vStart\\% max $vMax\\% finish $vFinish\\%"
    //% block.loc.ru="линейное движение на расстояние $totalDist мм|при ускорении $accelDist замедлении $decelDist|c стартовой $vStart\\% макс $vMax\\% финишной $vFinish\\%"
    //% inlineInputMode="inline"
    //% vStart.shadow="motorSpeedPicker"
    //% vMax.shadow="motorSpeedPicker"
    //% vFinish.shadow="motorSpeedPicker"
    //% weight="89"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function rampLinearDistMove(vStart: number, vMax: number, vFinish: number, totalDist: number, accelDist: number, decelDist: number) {
        if (vMax == 0 || totalDist == 0) {
            stop(Braking.Hold);
            return;
        }
        if (vStart < 0) console.log(`Warning: vStart is negative (${vStart}). Using absolute value.`);
        if (vMax < 0) console.log(`Warning: vMax is negative (${vMax}). Using absolute value.`);
        if (vFinish < 0) console.log(`Warning: vFinish is negative (${vFinish}). Using absolute value.`);
        if (accelDist < 0) console.log(`Warning: accelDist is negative (${accelDist}). Using absolute value.`);
        if (decelDist < 0) console.log(`Warning: decelDist is negative (${decelDist}). Using absolute value.`);

        vStart = Math.abs(vStart);
        vMax = Math.abs(vMax);
        vFinish = Math.abs(vFinish);
        accelDist = Math.abs(accelDist);
        decelDist = Math.abs(decelDist);
        const absTotalDist = Math.abs(totalDist);

        if (vStart > vMax || vFinish > vMax || absTotalDist < accelDist + decelDist) {
            stop(Braking.Hold);
            console.log("Error: parameters passed incorrectly in rampLinearDistMove!");
            return;
        }

        const dirSign = Math.sign(totalDist); // Определяем направление по знаку totalDist
        
        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(absTotalDist); // Рассчитываем общую дистанцию

        syncRampMovement(vStart * dirSign, vMax * dirSign, vFinish * dirSign, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
    }

    /**
     * Синхронизация движения с плавным стартом в мм.
     * Для движения вперёд устанавливается положительная totalDist дистанция, а назад - отрицательная.
     * Скорости всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * Расстояние ускорений всегда должны быть положительными (отрицательное значение будет взято по модулю).
     * Если accelDist больше totalDist, то accelDist будет обрезан до значения totalDist.
     * @param vStart начальная скорость (мощность) движени, eg: 30
     * @param vMax максимальная скорость (мощность) движения, eg: 70
     * @param totalDist общее расстояние, eg: 100
     * @param accelDist расстояние ускорения в мм, eg: 80
     */
    //% blockId="AccelStartLinearDistMove"
    //% block="acceleration in linear motion from $vStart\\% to $vMax\\% per $accelDist mm|at total distance $totalDist"
    //% block.loc.ru="ускорение при линейном движении c $vStart\\% до $vMax\\% за $accelDist мм|при общей дистанции $totalDist"
    //% inlineInputMode="inline"
    //% vStart.shadow="motorSpeedPicker"
    //% vMax.shadow="motorSpeedPicker"
    //% weight="88" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function accelStartLinearDistMove(vStart: number, vMax: number, totalDist: number, accelDist: number) {
        if (vMax == 0 || totalDist == 0 || accelDist == 0) {
            stop(Braking.Hold);
            return;
        }
        if (vStart < 0) console.log(`Warning: vStart is negative (${vStart}). Using absolute value.`);
        if (vMax < 0) console.log(`Warning: vMax is negative (${vMax}). Using absolute value.`);
        if (accelDist < 0) console.log(`Warning: accelDist is negative (${accelDist}). Using absolute value.`);
        if (accelDist < 0) console.log(`Warning: accelDist is negative (${accelDist}). Using absolute value.`);

        vStart = Math.abs(vStart);
        vMax = Math.abs(vMax);
        accelDist = Math.abs(accelDist);
        const absTotalDist = Math.abs(totalDist);

        if (vStart > vMax) {
            const tempV = vStart;
            vStart = vMax;
            vMax = tempV;
            console.log(`Warning: vStart was greater than vMax. Swapped: vStart=${vStart}, vMax=${vMax}`);
        }
        if (absTotalDist < accelDist) {
            accelDist = absTotalDist;
            console.log(`Warning: totalDist (${absTotalDist}) is less than accelDist (${accelDist}). Using totalDist as accelDist.`);
        }

        const dirSign = Math.sign(totalDist); // Определяем направление по знаку totalDist

        const mRotTotalCalc = Math.calculateDistanceToEncRotate(absTotalDist); // Рассчитываем общую дистанцию
        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения

        executeRampMovement(vStart * dirSign, vMax * dirSign, 0, mRotTotalCalc, mRotAccelCalc, 0); // Выполнение синхронизированного движения с фазами
        steeringCommand(0, vMax * dirSign); // Без команды торможения, а просто ехать дальше вперёд
    }

    /**
     * Синхронизация движения с плавным сбросом скорости (мощности) в мм.
     * Для движения вперёд устанавливается положительная totalDist дистанция, а назад - отрицательная.
     * Скорости всегда должны быть положительными (отрицательные значения будут взяты по модулю).
     * Расстояние замедления всегда должно быть положительным (отрицательное значение будет взято по модулю).
     * Если decelDist больше totalDist, то decelDist будет обрезан до значения totalDist.
     * @param v начальная скорость (мощность) движения, eg: 50
     * @param vFinish финишная скорость (мощность) движения, eg: 20
     * @param totalDist общее расстояние в мм, eg: 100
     * @param decelDist расстояние замедления в мм, eg: 90
     * @param actionAfterMotion действие после, eg: AfterMotion.HoldStop
     */
    //% blockId="DecelFinishLinearDistMove"
    //% block="deceleration in linear motion from $v\\% to $vFinish\\%|per $decelDist mm|at total distance of $totalDist|after motion $actionAfterMotion"
    //% block.loc.ru="замеделение при линейном движении c $v\\% до $vFinish\\%|за $decelDist мм|при общей дистанции $totalDist|действие после $actionAfterMotion"
    //% inlineInputMode="inline"
    //% v.shadow="motorSpeedPicker"
    //% vFinish.shadow="motorSpeedPicker"
    //% weight="87" blockGap="8"
    //% subcategory="Движение"
    //% group="Синхронизированное движение с ускорениями в мм"
    export function decelFinishLinearDistMove(v: number, vFinish: number, totalDist: number, decelDist: number, actionAfterMotion: AfterMotion) {
        if (v == 0 || totalDist == 0 || decelDist == 0) {
            stop(Braking.Hold);
            return;
        }
        if (v < 0) console.log(`Warning: v is negative (${v}). Using absolute value.`);
        if (vFinish < 0) console.log(`Warning: vFinish is negative (${vFinish}). Using absolute value.`);
        if (decelDist < 0) console.log(`Warning: decelDist is negative (${decelDist}). Using absolute value.`);

        v = Math.abs(v);
        vFinish = Math.abs(vFinish);
        decelDist = Math.abs(decelDist);
        const absTotalDist = Math.abs(totalDist);

        if (vFinish > v) {
            const tempV = v;
            v = vFinish;
            vFinish = tempV;
            console.log(`Warning: vFinish was greater than v. Swapped: vStart=${v}, vFinish=${vFinish}`);
        }
        if (absTotalDist < decelDist) {
            decelDist = absTotalDist;
            console.log(`Warning: totalDist (${absTotalDist}) is less than decelDist (${decelDist}). Using totalDist as decelDist.`);
        }

        const dirSign = Math.sign(totalDist); // Определяем направление по знаку totalDist

        const mRotTotalCalc = Math.calculateDistanceToEncRotate(absTotalDist); // Рассчитываем общую дистанцию
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления

        executeRampMovement(0, v * dirSign, vFinish * dirSign, mRotTotalCalc, 0, mRotDecelCalc); // Выполнение синхронизированного движения с фазами
        motions.actionAfterMotion(actionAfterMotion, vFinish * dirSign); // stop(Braking.Hold); // Тормоз с удержанием
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
        // ToDo
        const mRotAccelCalc = Math.calculateDistanceToEncRotate(accelDist); // Расчитываем расстояние фазы ускорения
        const mRotDecelCalc = Math.calculateDistanceToEncRotate(decelDist); // Расчитываем расстояние фазы замедления
        const mRotTotalCalc = Math.calculateDistanceToEncRotate(totalDist); // Рассчитываем общую дистанцию

        advmotctrls.accTwoEncLinearMotionConfig(minSpeed, maxSpeedRight, minSpeed, mRotTotalCalc, mRotAccelCalc, mRotDecelCalc);
        pidChassisSync.setGains(getSyncRegulatorKp(), getSyncRegulatorKi(), getSyncRegulatorKd()); // Установка коэффицентов регулирования
        pidChassisSync.setDerivativeFilter(getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        pidChassisSync.setControlSaturation(-100, 100); // Установка интервала ПИД регулятора
        pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        pidChassisSync.reset(); // Сбросить ПИД регулятор
        
        const emlPrev = leftMotor.angle(), emrPrev = rightMotor.angle(); // Перед запуском мы считываем значение с энкодера на левом и правом двигателе

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) {
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = leftMotor.angle() - emlPrev, emr = rightMotor.angle() - emrPrev; // Значения с энкодеров моторов
            const out = advmotctrls.accTwoEncLinearMotionCompute(eml, emr);
            if (out.isDone) break; // Проверка условия окончания
            const error = advmotctrls.getErrorSyncMotors(eml, emr, out.pwr, out.pwr);
            const u = pidChassisSync.compute(dt == 0 ? 1 : dt, -error); // Find out and record the control action of the regulator
            const powers = advmotctrls.getPwrSyncMotors(u, out.pwr, out.pwr);
            setSpeedsCommand(powers.pwrLeft, powers.pwrRight);
            control.pauseUntilTime(currTime, 1);
        }
        stop(Braking.Hold);
    }

}