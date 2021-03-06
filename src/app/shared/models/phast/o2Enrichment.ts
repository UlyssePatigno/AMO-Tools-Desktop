export interface O2Enrichment {
    o2CombAir: number,
    o2CombAirEnriched: number,
    flueGasTemp: number,
    flueGasTempEnriched: number,
    o2FlueGas: number,
    o2FlueGasEnriched: number,
    combAirTemp: number,
    combAirTempEnriched: number,
    fuelConsumption: number
}

export interface O2EnrichmentOutput {
    availableHeatEnriched: number,
    availableHeatInput: number,
    fuelConsumptionEnriched: number,
    fuelSavingsEnriched: number
}