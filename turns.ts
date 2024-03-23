namespace turns {

    /**
     * Поворот относительно центра колёс на угол в градусах.
     * @param deg угол градуса поворота, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param speed скорость движения, eg: 50
     */
    //% blockId="SpinTurn"
    //% block="поворот на $deg|° с $speed|\\% относительно центра колёс"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% weight="2"
    //% group="Повороты"
    export function SpinTurn(deg: number, speed: number) {
        if (deg == 0 || speed == 0) {
            CHASSIS_MOTORS.stop();
            return;
        }
        CHASSIS_MOTORS.setBrake(true); // Удерживать при тормозе
        let calcMotRot = (deg * WHEELS_W) / WHEELS_D; // Расчёт значения угла для поворота
        CHASSIS_MOTORS.tank(speed, -speed, calcMotRot, MoveUnit.Degrees);
    }

    /**
     * Повороты относительно левого или правого колеса на угол в градусах.
     * @param deg угол в градусах для поворота, где положительное число - вправо, а отрицательное влево, eg: 90
     * @param speed скорость движения, eg: 80
     * @param wheelPivot относительно колеса, eg: WheelPivot.LeftWheel
     */
    //% blockId="PivotTurn"
    //% block="поворот на $deg|° с $speed|\\% относительно $wheelPivot|колеса"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="toggle"
    //% speed.shadow="motorSpeedPicker"
    //% weight="3"
    //% group="Повороты"
    export function PivotTurn(deg: number, speed: number, wheelPivot: WheelPivot) {
        if (deg == 0 || speed == 0) {
            CHASSIS_MOTORS.stop();
            return;
        }
        CHASSIS_MOTORS.setBrake(true); // Удерживать при тормозе
        let calcMotRot = ((deg * WHEELS_W) / WHEELS_D) * 2; // Расчёт значения угла для поворота
        if (wheelPivot == WheelPivot.LeftWheel) {
            CHASSIS_L_MOTOR.stop(); // Остановить левый мотор
            CHASSIS_R_MOTOR.run(speed, calcMotRot, MoveUnit.Degrees);
        } else if (wheelPivot == WheelPivot.RightWheel) {
            CHASSIS_R_MOTOR.stop(); // Остановить правый мотор
            CHASSIS_L_MOTOR.run(speed, calcMotRot, MoveUnit.Degrees);
        }
    }
    
}