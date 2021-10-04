function MostrarNivelAgua () {
    if (NivelDeposito < AlarmaNivelAgua) {
        if (EstaEncendidoRiego() == 1) {
            ApagarRiego()
        }
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else if (NivelDeposito < 1.25 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.5 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.75 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    }
}
function EstaEncendidoRiego () {
    return pins.digitalReadPin(DigitalPin.P16)
}
function EncenderRiego () {
    if (NivelDeposito > AlarmaNivelAgua) {
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    }
}
function ApagarRiego () {
    pins.digitalWritePin(DigitalPin.P16, 0)
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
}
input.onButtonPressed(Button.A, function () {
    EncenderRiego()
})
function MedidaSensores () {
    NivelDeposito = pins.analogReadPin(AnalogPin.P2)
    serial.writeValue("NivelDeposito", NivelDeposito)
    ValorSensorLluvia = pins.analogReadPin(AnalogPin.P1)
    serial.writeValue("SensorLluvia", ValorSensorLluvia)
    HumedadSuelo = 1023 - pins.analogReadPin(AnalogPin.P0)
    serial.writeValue("HumedadSuelo", HumedadSuelo)
}
input.onButtonPressed(Button.B, function () {
    ApagarRiego()
})
function RevisarHumedadSuelo () {
    if (HumedadSuelo < HumedadParaRiego) {
        EncenderRiego()
        while (HumedadSuelo < HumedadParaRiego && ValorSensorLluvia > SensorLluviaMojado) {
            MedidaSensores()
        }
        ApagarRiego()
    }
}
let HumedadSuelo = 0
let ValorSensorLluvia = 0
let NivelDeposito = 0
let SensorLluviaMojado = 0
let HumedadParaRiego = 0
let AlarmaNivelAgua = 0
serial.redirectToUSB()
AlarmaNivelAgua = 400
HumedadParaRiego = 500
SensorLluviaMojado = 800
basic.forever(function () {
    MedidaSensores()
    MostrarNivelAgua()
    RevisarHumedadSuelo()
})
