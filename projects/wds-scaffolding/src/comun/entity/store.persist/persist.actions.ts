import { Observable } from 'rxjs';
import { StateLoadType } from '../../enums/enums';
import { getResourceFormPaths } from './fn.utils';
import { GenericSearchLoadedActionCmd, GenericSearchLoadingAction, GenericSearchLoadingActionCmd, GenericSearchLoadedAction, GenericSearchLoadedErrorAction, GenericSearchLoadedErrorActionCmd, GenericSearchClearAction, GenericSearchClearActionCmd, GenericSearchAddAction, GenericSearchAddActionCmd } from '../store/search.generic.actions';
import { WdsStoreFormModeType, WdsStoreLoadStatus, WdsStoreLoadStatusType, WdsStoreSaveStatus, WdsStoreSaveStatusType } from './persist.model';
import { StateContext } from '@ngxs/store';
import { GenericFormSavingActionCmd, GenericFormSavedActionCmd, GenericFormSavedErrorActionCmd } from '../store/generic.save.actions';
import { utilsGetJsonByPath } from '../store/generic.save.service';
import { ResourceConfig } from '../form/model';


export interface ResourceFormLoadActionCmd {
    resourceConfig?: ResourceConfig;
    params?: any;
    storePathFn?(mode: WdsStoreFormModeType): {
        resource: string,
        loadStatus: string,
        data: string,
        others: string
    };
    data: {
        create?: {
            defaultFn?(params: any, stateContext?: StateContext<any>): any,
            entityFn$?(params: any, stateContext: StateContext<any>): Observable<any>;
        };
        update?: {
            entityFn$?(defaultData: any, params: any, stateContext: StateContext<any>): Observable<any>;
        };
        others?: {
            rest?: {
                name: string;
                type?: StateLoadType;
                loadFn$(defaultData: any, params: any, stateContext: StateContext<any>): Observable<any>
            }[],
            graphql?: {
                name: string;
                type: StateLoadType;
                loadFn$(defaultData: any, params: any, stateContext: StateContext<any>): Observable<any>
            }[]
        };
        loadedPageOkFn?(dataLoaded: { data: any, others: any }): any
    };
};



/******************* SET ERRORS ********************/
export interface GenericFormSetErrorsCmd {
    errors: any,
    storePath: string
}

export class GenericFormSetErrors {
    constructor(public readonly cmd: GenericFormSetErrorsCmd) {
    }
};
export interface ResourceFormSetErrorsCmd extends GenericFormSetErrorsCmd {

}
export class ResourceFormSetErrors extends GenericFormSetErrors {
    constructor(public readonly cmd: ResourceFormSetErrorsCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Set Errors';
};
/******************* SUBMIT ********************/
export interface GenericFormSubmitCmd {
    value: Boolean,
    storePath: string
}
export class GenericFormSubmit {
    constructor(public readonly cmd: GenericFormSubmitCmd) {
    }
};
export interface ResourceFormSubmitCmd extends GenericFormSubmitCmd {

}
export class ResourceFormSubmit extends GenericFormSubmit {
    constructor(public readonly cmd: ResourceFormSubmitCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Submit';
};





/******************* FORM RESET LOAD STATUS ********************/
export interface GenericFormResetLoadActionCmd {
    storePath: string
}
export class GenericFormResetLoadAction {
    constructor(public readonly cmd: GenericFormResetLoadActionCmd) {
    }
};
export interface ResourceFormResetLoadActionCmd extends GenericFormResetLoadActionCmd {

}
export class ResourceFormResetLoadAction extends GenericFormResetLoadAction {
    constructor(public readonly cmd: ResourceFormResetLoadActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Reset Load';
};


/****************************************************/
export class ResourceFormLoadAction {
    constructor(public readonly cmd: ResourceFormLoadActionCmd) {
        cmd.storePathFn = () => {
            return getResourceFormPaths(cmd.resourceConfig, cmd.params);
        }
    }
    static readonly type = '[ResourceForm] Load';

};
/**********************  LOADING  ******************** */
export class ResourceFormLoadingAction extends GenericSearchLoadingAction {
    constructor(public readonly cmd: GenericSearchLoadingActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Loading';
};
/**********************  LOADED ******************** */
export class ResourceFormLoadedAction extends GenericSearchLoadedAction {
    constructor(public readonly cmd: GenericSearchLoadedActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Loaded';
};
/******************  LOADED ERROR ******************** */
export class ResourceFormLoadedErrorAction extends GenericSearchLoadedErrorAction {
    constructor(public readonly cmd: GenericSearchLoadedErrorActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceForm] Loaded Error';
};
export class ResourceFormClearAction {
    constructor(public readonly cmd: { storePath: string, error: any }) { }
    static readonly type = '[ResourceForm] Clear';
};







export function savingActionFactory<GenericFormSavingAction>(type: { new(cmd: GenericFormSavingActionCmd): GenericFormSavingAction }, cmd: GenericFormSavingActionCmd): GenericFormSavingAction {
    return new type(cmd);
}
export function savedActionFactory<GenericFormSavedAction>(type: { new(cmd: GenericFormSavedActionCmd): GenericFormSavedAction }, cmd: GenericFormSavedActionCmd): GenericFormSavedAction {
    return new type(cmd);
}
export function savedErrorActionFactory<GenericFormSavedErrorAction>(type: { new(cmd: GenericFormSavedErrorActionCmd): GenericFormSavedErrorAction }, cmd: GenericFormSavedErrorActionCmd): GenericFormSavedErrorAction {
    return new type(cmd);
}



export function loadingActionFactory<GenericSearchLoadingAction>(type: { new(cmd: GenericSearchLoadingActionCmd): GenericSearchLoadingAction }, cmd: GenericSearchLoadingActionCmd): GenericSearchLoadingAction {
    return new type(cmd);
}
export function loadedActionFactory<GenericSearchLoadedAction>(type: { new(cmd: GenericSearchLoadedActionCmd): GenericSearchLoadedAction }, cmd: GenericSearchLoadedActionCmd): GenericSearchLoadedAction {
    return new type(cmd);
}
export function loadedErrorActionFactory<GenericSearchLoadedErrorAction>(type: { new(cmd: GenericSearchLoadedErrorActionCmd): GenericSearchLoadedErrorAction }, cmd: GenericSearchLoadedErrorActionCmd): GenericSearchLoadedErrorAction {
    return new type(cmd);
}


export function modifyObject(object, jsonPath, value) {
    const keys = jsonPath.split(".");
    const key = keys.splice(0, 1);
    if (keys.length > 0) {
        modifyObject(object[key], keys.join('.'), value)
    } else {
        object[key] = value;
    }
}
export function functionSaving(cmd: GenericFormSavingActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreSaveStatus = {
        saving: true,
        saved: null,
        error: null
    };
    modifyObject(state, cmd.storePath, loadStatus);
    stateContext.patchState(state);
}
export function functionLoading(cmd: GenericSearchLoadingActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreLoadStatus = {
        loading: true,
        loaded: null,
        error: null
    };
    modifyObject(state, cmd.storePath, loadStatus);
    stateContext.patchState(state);
}
export function functionSaved(cmd: GenericFormSavedActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreSaveStatus = {
        saving: false,
        saved: WdsStoreSaveStatusType.OK,
        error: null
    };
    const dataPath: string = cmd.storePath.saveStatus.substring(0, cmd.storePath.saveStatus.length - '.status'.length);
    modifyObject(state, `${dataPath}.form.saved`, cmd.savedResponse);
    modifyObject(state, cmd.storePath.saveStatus, loadStatus);
    stateContext.patchState(state);
}


export function functionLoaded(cmd: GenericSearchLoadedActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreLoadStatus = {
        loading: false,
        loaded: WdsStoreLoadStatusType.OK,
        error: null
    };
    modifyObject(state, cmd.storePath.loadStatus, loadStatus);
    modifyObject(state, cmd.storePath.data, cmd.dataLoaded.data);
    modifyObject(state, cmd.storePath.others, cmd.dataLoaded.others);
    stateContext.patchState(state);
}

export function functionFormSetErrors(cmd: GenericFormSetErrorsCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() };
    console.log('cmd.storePathSetModel: ' + cmd.storePath);

    modifyObject(state, `${cmd.storePath}.model`, cmd.errors);
    stateContext.patchState(state);
}
export function functionFormSubmit(cmd: GenericFormSubmitCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    modifyObject(state, `${cmd.storePath}.w_submitCCCCC`, cmd.value);
    stateContext.patchState(state);
}
export function functionFormReset(cmd: GenericFormResetLoadActionCmd, stateContext: StateContext<any>) {

    const state: any = { ...stateContext.getState() };
    modifyObject(state, `${cmd.storePath}.status.loaded`, null);
    modifyObject(state, `${cmd.storePath}.data.form.w_submit`, null);
    stateContext.patchState(state);
}





export function functionSavedError(cmd: GenericFormSavedErrorActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreSaveStatus = {
        saving: false,
        saved: WdsStoreSaveStatusType.ERROR,
        error: cmd.error
    };
    modifyObject(state, cmd.storePath, loadStatus);
    stateContext.patchState(state);
}


export function functionLoadedError(cmd: GenericSearchLoadedErrorActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    const loadStatus: WdsStoreLoadStatus = {
        loading: false,
        loaded: WdsStoreLoadStatusType.ERROR,
        error: cmd.error
    };

    modifyObject(state, cmd.storePath, loadStatus);
    stateContext.patchState(state);
}

export function functionSearchClear(cmd: GenericSearchClearActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() }
    modifyObject(state, `${cmd.storePath}.loaded`, false);
    stateContext.patchState(state);
}


export function functionSearchAdd(cmd: GenericSearchAddActionCmd, stateContext: StateContext<any>) {
    const state: any = { ...stateContext.getState() };
    const result: any = utilsGetJsonByPath(state, `${cmd.storePath}.data.result`);
    const keyArray = Object.keys(result).find(key => Array.isArray(result[key]));

    let originalList: any[] = result[keyArray];

    const index: number = originalList.findIndex(item => item.id == cmd.data.id)
    if (index >= 0)
        originalList.splice(index, 1)
    const list: any = [cmd.data, ...originalList];
    modifyObject(state, `${cmd.storePath}.data.result.${keyArray}`, list);
    stateContext.patchState(state);
}





