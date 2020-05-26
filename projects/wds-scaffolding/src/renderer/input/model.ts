import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

/************** NumberInput **************/
export enum WdsRendererNumberInputType {
    standard = 'standard', spinner = 'spinner'
}
export interface WdsRendererNumberInputConfig {
    max: number,
    min: number,
    step: number,
    precision: number
}
export interface WdsRendererBooleanToggleButonConfig {
    onLabel: string,
    offLabel: number,
    onIcon: number,
    offIcon: number,
    iconPos: number
}
/************************************** */

export enum WdsRendererDropDownType {
    fixed = 'fixed', variable = 'variable'
}

export interface WdsRendererDropDownConfig {
    storePath: string,
    type: WdsRendererDropDownType,
    fixed: { label: string, value: string }[],
    variable: {
        storePath: string,
        load: {

        }
    }


}




/************** StringPassword **************/
export enum WdsRendererStringPasswordType {
    standar = 'standar', advanced = 'advanced'
}
export interface WdsRendererStringPasswordConfig {
    type: WdsRendererStringPasswordType,
    advanced: {
    }
}
/************** StringInput **************/
export enum WdsRendererStringInputType {
    standar = 'standar', filter = 'filter', mask = 'mask'
}
export enum WdsRendererStringInputStandarType {
    text = 'text', password = 'password'
}
export interface WdsRendererStringInputConfig {
    type: WdsRendererStringInputType,
    placeholder?: string,
    filter: {
        type: string,
    },
    mask: {
        value: string
    }
}
/************** DateCalendar **************/
export enum WdsRendererDateCalendarType {
    ymdt = 'ymdt', ymd = 'ymd', ym = 'ym', t = 't'
}
export enum WdsRendererDateCalendarMinMaxType {
    fixed = 'fixed', variable = 'variable='
}
export interface WdsRendererDateCalendarConfig {
    type: WdsRendererDateCalendarType,
    dateFormat: string,
    disabledDays: number[],
    disabledDates: Date[],
    monthNavigator: boolean,
    yearNavigator: boolean,
    showWeek: boolean,
    minMax: {
        min: {
            type: WdsRendererDateCalendarMinMaxType;
            fixed: Date,
            variable: {
                years: number,
                months: number,
                days: number,
                hours: number,
                minutes: number,
            }
        },
        max: {
            type: WdsRendererDateCalendarMinMaxType;
            fixed: Date,
            variable: {
                years: number,
                months: number,
                days: number,
                hours: number,
                minutes: number,
            }
        }
    }
}
export interface WdsRendererInputConfig<T> {
    errors$: Observable<any>,
    formControl: FormControl,
    formPath: string,
    id: string,
    dataType: string,
    inputType: string,
    config: T,
    validators: {
        type: string,
        message: string,
        args: string
    }[],
    defaultValue: string | number | boolean | Date
}