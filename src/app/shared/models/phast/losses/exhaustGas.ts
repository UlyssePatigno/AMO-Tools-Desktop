export interface ExhaustGas {
    cycleTime?: number,
    offGasTemp?: number,
    CO?: number,
    O2?: number,
    H2?: number,
    CO2?: number,
    combustibleGases?: number,
    vfr?: number,
    dustLoading?: number,
    //otherLossObjects?: number[]
    otherLosses?: number
}