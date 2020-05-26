import { StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WdsStoreFormModeType } from '../store.persist/persist.model';

/************************** SAVE *******************************/
export interface GenericFormSaveActionCmd {
    params?: any;
    paramNameId?: string,
    actions?: {
        saving: any,
        saved: any,
        savedError: any
    };
    storePathFn?(mode: WdsStoreFormModeType): {
        resource: string,
        saveStatus: string,
        data: string,
    };
    data: {
        convertDataFn?(data: any, params: any, stateContext: StateContext<any>): any,
        create?: {
            entityFn$?(convertedData: any, stateContext: StateContext<any>): Observable<any>;
        };
        update?: {
            entityFn$?(convertedData: any, stateContext: StateContext<any>): Observable<any>;
        };
        savedOkFn?(dataLoaded: { data: any, others: any }): any;
        dispatchSavedActionFn$?(storePath: any, dataLoaded: { data: any, others: any }, stateContext: StateContext<any>): Observable<any>
    };
};

export class GenericFormSaveAction {
    constructor(public readonly cmd: GenericFormSaveActionCmd) {
    }
};
/************************** SAVED *******************************/
export interface GenericFormSavedActionCmd {
    storePath: {
        saveStatus: string,
        data: string
    };
    savedResponse: {
        data: any
    }
}
export class GenericFormSavedAction {
    constructor(public readonly cmd: GenericFormSavedActionCmd) {
    }
};

/************************ SAVING ********************** */
export interface GenericFormSavingActionCmd {
    storePath: string
}
export class GenericFormSavingAction {
    constructor(public readonly cmd: GenericFormSavingActionCmd) { }
};

/************************ LOADING ********************** */
export interface GenericFormSavedErrorActionCmd {
    storePath: string,
    error: any
}
export class GenericFormSavedErrorAction {
    constructor(public readonly cmd: GenericFormSavedErrorActionCmd) { }
};