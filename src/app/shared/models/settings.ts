export interface Settings {
    language?: string,
    currency?: string,
    unitsOfMeasure?: string
    assessmentId?: number,
    directoryId?: number,
    createdDate?: Date,
    modifiedDate?: Date
    flowMeasurement?: string,
    powerMeasurement?: string,
    distanceMeasurement?: string,
    pressureMeasurement?: string,
    currentMeasurement?: string,
    viscosityMeasurement?: string,
    voltageMeasurement?: string,
    temperatureMeasurement?: string,
    id?: number,
    energySourceType?: string,
    furnaceType?: string,
    energyResultUnit?: string,
    customFurnaceName?: string,
    appVersion?: string,
    phastRollupUnit?: string,
    facilityInfo?: FacilityInfo
}


export interface FacilityInfo {
    name?: string,
    address?: StreetAddress,
    contact?: Contact
}

export interface StreetAddress {
    street?: string,
    city?: string,
    state?: string,
    country?: string,
    zip?: string
}

export interface Contact {
    contactName?: string,
    phoneNumber?: number
}