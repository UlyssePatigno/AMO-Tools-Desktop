/*
  When using ConvertUnitsService you need to chain these commands
  1. Set value you are converting
  2. Declare unit you are converting from
  3. Declare unit you are converting to
  4. converted unit will return
  convertUnitsService.unit(1).from('in').to('ft');
*/



import { Injectable } from '@angular/core';
import { length } from './definitions/length';
import { area } from './definitions/area';
import { mass } from './definitions/mass';
import { volume } from './definitions/volume';
import { _each } from './definitions/each';
import { temperature } from './definitions/temperature';
import { time } from './definitions/time';
import { digital } from './definitions/digital';
import { partsPer } from './definitions/partsPer';
import { pressure } from './definitions/pressure';
import { speed } from './definitions/speed';
import * as _ from 'lodash';
import * as keys from 'lodash.keys';
import * as each from 'lodash.foreach';

@Injectable()
export class ConvertUnitsService {
  _measures = {
    length: length,
    area: area,
    mass: mass,
    volume: volume,
    each: each,
    temperature: temperature,
    time: time,
    digital: digital,
    partsPer: partsPer,
    speed: speed,
    pressure: pressure
  }
  origin: any;
  destination: any;
  val: any;

  constructor() { }

  value(val: any) {
    this.origin = null;
    this.destination = null;
    this.val = val;
    return this;
  }

  describe(resp) {
    return {
      abbr: resp.abbr
      , measure: resp.measure
      , system: resp.system
      , singular: resp.unit.name.singular
      , plural: resp.unit.name.plural
    };
  }

  from(from: any) {
    if(!this.val)
      throw new Error('need to set value before call to .from');
    if (this.destination)
      throw new Error('.from must be called before .to');
    this.origin = this.getUnit(from);
    if (!this.origin) {
      this.throwUnsupportedUnitError(from);
    }
    return this;
  }

  to(to: any) {
    if (!this.origin)
      throw new Error('.to must be called after .from');

    this.destination = this.getUnit(to);

    var result
      , transform;

    if (!this.destination) {
      this.throwUnsupportedUnitError(to);
    }

    // Don't change the value if origin and destination are the same
    if (this.origin.abbr === this.destination.abbr) {
      return this.val;
    }

    // You can't go from liquid to mass, for example
    if (this.destination.measure != this.origin.measure) {
      throw new Error('Cannot convert incompatible measures of '
        + this.destination.measure + ' and ' + this.origin.measure);
    }

    /**
    * Convert from the source value to its anchor inside the system
    */
    result = this.val * this.origin.unit.to_anchor;

    /**
    * For some changes it's a simple shift (C to K)
    * So we'll add it when convering into the unit
    * and substract it when converting from the unit
    */
    if (this.destination.unit.anchor_shift) {
      result += this.destination.unit.anchor_shift;
    }

    if (this.origin.unit.anchor_shift) {
      result -= this.origin.unit.anchor_shift
    }


    /**
    * Convert from one system to another through the anchor ratio. Some conversions
    * aren't ratio based or require more than a simple shift. We can provide a custom
    * transform here to provide the direct result
    */
    if (this.origin.system != this.destination.system) {
      transform = this._measures[this.origin.measure]._anchors[this.origin.system].transform;
      if (typeof transform === 'function') {
        return result = transform(result)
      }
      result *= this.measures[this.origin.measure]._anchors[this.origin.system].ratio;
    }

    /**
    * Convert to another unit inside the destination system
    */
    return result / this.destination.unit.to_anchor;
  }

  getUnit(abbr: string) {
    var found;

    each(this._measures, function (systems, measure) {
      each(systems, function (units, system) {
        if (system == '_anchors')
          return false;

        each(units, function (unit, testAbbr) {
          if (testAbbr == abbr) {
            found = {
              abbr: abbr
              , measure: measure
              , system: system
              , unit: unit
            };
            return false;
          }
        });

        if (found)
          return false;
      });

      if (found)
        return false;
    });

    return found;
  }

  throwUnsupportedUnitError(what: any) {
    var validUnits = [];
    each(this._measures, function (systems, measure) {
      each(systems, function (units, system) {
        if (system == '_anchors')
          return false;

        validUnits = validUnits.concat(keys(units));
      });
    });

    throw new Error('Unsupported unit ' + what + ', use one of: ' + validUnits.join(', '));
  }

  measures() {
    return keys(this._measures);
  }
}