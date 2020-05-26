import { StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StateLoadType } from '../../enums/enums';
import { HttpClient } from '@angular/common/http';

export class GenericSearchLoadActionCmd {
    cacheResults?:boolean;
    providers?: {
        httpClient: HttpClient
    }
    resourceId?: string;
    params?: any;
    storePathFn?(): {
        resource: string,
        loadStatus: string,
        data: string,
        others: string
    };
    actions?: {
        loading: any,
        loaded: any,
        loadedError: any
    }
    data?: {
        enablePaging?: boolean,
        loadFn$?(params: any, stateContext: StateContext<any>): Observable<any>;
        others?: {
            rest?: {
                name: string;
                loadType?: StateLoadType;
                loadFn$(defaultData: any, params: any, stateContext: StateContext<any>): Observable<any>
            }[],
            graphql?: {
                name: string;
                loadType: StateLoadType;
                loadFn$(defaultData: any, params: any, stateContext: StateContext<any>): Observable<any>
            }[]
        };
        loadedPageOkFn?(dataLoaded: { data: any, others: any }): any
        dispatchLoadedActionFn$?(storePath: any, dataLoaded: { data: any, others: any }, stateContext: StateContext<any>): Observable<any>
    };
};
export class GenericSearchLoadAction {
    constructor(public readonly cmd: GenericSearchLoadActionCmd) {
    }
};
/****************************************************************************/
export interface GenericSearchLoadedActionCmd {
    storePath: {
        loadStatus: string,
        data: string,
        others: string
    };
    dataLoaded: {
        data: any,
        others: any
    }
}
export class GenericSearchLoadedAction {
    constructor(public readonly cmd: GenericSearchLoadedActionCmd) {
    }
};
/************************ LOADING ********************** */
export interface GenericSearchLoadingActionCmd {
    storePath: string
}
export class GenericSearchLoadingAction {
    constructor(public readonly cmd: GenericSearchLoadingActionCmd) { }
};

/************************ LOADED ERRO ********************** */
export interface GenericSearchLoadedErrorActionCmd {
    storePath: string,
    error: any
}
export class GenericSearchLoadedErrorAction {
    constructor(public readonly cmd: GenericSearchLoadedErrorActionCmd) { }
};



/************************ CLEAR ********************** */
export interface GenericSearchClearActionCmd {
    storePath: string
}
export class GenericSearchClearAction {
    constructor(public readonly cmd: GenericSearchClearActionCmd) { }
};



/************************ ADD TO LIST ********************** */
export interface GenericSearchAddActionCmd {
    storePath: string,
    data: any
}
export class GenericSearchAddAction {
    constructor(public readonly cmd: GenericSearchAddActionCmd) { }
};