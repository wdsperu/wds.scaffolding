import { GenericSearchLoadAction, GenericSearchLoadActionCmd, GenericSearchLoadedAction, GenericSearchLoadedActionCmd, GenericSearchLoadedErrorAction, GenericSearchLoadedErrorActionCmd, GenericSearchLoadingAction, GenericSearchLoadingActionCmd, GenericSearchClearAction, GenericSearchClearActionCmd, GenericSearchAddAction, GenericSearchAddActionCmd } from './search.generic.actions';
import { getResourceSearchPaths } from '../store.persist/fn.utils';
import { StateContext } from '@ngxs/store';
import { PersistStateModel } from '../store.persist/persist.model';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceConfig } from '../form/model';

export enum ResourceSearchLoadType {
    search = 'search', info = 'info'
}
/****************************** LOAD **************************/
export interface ResourceSearchLoadActionCmd extends GenericSearchLoadActionCmd {
    type: ResourceSearchLoadType,
    resourceConfig: ResourceConfig,
    loadFn2$(paramsConverted: any, stateContext: StateContext<any>): Observable<any>,
    reloadFn?(): boolean
};
export class ResourceSearchLoadAction extends GenericSearchLoadAction {
    constructor(public readonly cmd: ResourceSearchLoadActionCmd) {
        super(cmd);
        cmd.data = {
            ... {
                loadFn$: (paramsConverted: any, stateContext: StateContext<any>) => {
                    const state: PersistStateModel = stateContext.getState();
                    const currentParams: any = cmd.params;
                    const lastParams: any = state.entity[cmd.resourceConfig.id].search.data.params.data;
                    const lastloadedData: any = state.entity[cmd.resourceConfig.id].search.data.result;
                    const searchParams: string[] = cmd.resourceConfig.searchParams;
                    const loaded: boolean = state.entity[cmd.resourceConfig.id].search.data.params.loaded;
                    const paramsEquals: boolean = searchParams.every(param => {
                        return lastParams[param] == currentParams[param]
                    });
                    const cache = cmd.cacheResults === undefined ? true : cmd.cacheResults;
                    // alert('cache:' + cache);
                    if (cache && paramsEquals) {
                        if (loaded) {
                            console.log('SearchData CACHE');
                        }
                    };
                    const tempo$ = cache && paramsEquals && loaded ? of(lastloadedData) : cmd.loadFn2$(paramsConverted, stateContext);

                    return tempo$.pipe(
                        map(
                            (data: any) => {
                                return {
                                    result: data,
                                    params: {
                                        data: cmd.params,
                                        loaded: true
                                    }
                                }
                            })
                    )
                },
                ...cmd.data,
            }
        }
        cmd.actions = {
            loading: ResourceSearchLoadingAction,
            loaded: ResourceSearchLoadedAction,
            loadedError: ResourceSearchLoadedErrorAction
        }
        cmd.storePathFn = () => {
            return getResourceSearchPaths(cmd.resourceId, cmd.type);
        }
    }
    static readonly type = '[ResourceSearch] Load';
};
/****************************** LOADING **************************/
export class ResourceSearchLoadingAction extends GenericSearchLoadingAction {
    constructor(public readonly cmd: GenericSearchLoadingActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceSearch] Loading';
};
/****************************** LOADED **************************/

export class ResourceSearchLoadedAction extends GenericSearchLoadedAction {
    static readonly type = '[ResourceSearch] Loaded';
    constructor(public readonly cmd: GenericSearchLoadedActionCmd) {
        super(cmd);
    }
};
/************************** LOADED  ERROR**************************/
export class ResourceSearchLoadedErrorAction extends GenericSearchLoadedErrorAction {
    constructor(public readonly cmd: GenericSearchLoadedErrorActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceSearch] Loaded Error';
};
/************************** CLEAR **************************/
export class ResourceSearchClearAction extends GenericSearchClearAction {
    constructor(public readonly cmd: GenericSearchClearActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceSearch] Clear';
};


export class ResourceSearchAddAction extends GenericSearchAddAction {
    constructor(public readonly cmd: GenericSearchAddActionCmd) {
        super(cmd);
    }
    static readonly type = '[ResourceSearch] Add';
};
