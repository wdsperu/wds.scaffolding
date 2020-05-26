import { State, Action, StateContext } from "@ngxs/store";
import { WdsStoreLoadStatus } from '../store.persist/persist.model';
import { CreateResource } from '../store.persist/tabs';
import { ResourceSearchLoadAction, ResourceSearchLoadingAction, ResourceSearchLoadedAction, ResourceSearchLoadedErrorAction, ResourceSearchLoadActionCmd } from './actions';
import { Observable, of, forkJoin, zip } from 'rxjs';
import { StateLoadType } from '../../enums/enums';
import { map, flatMap, catchError } from 'rxjs/operators';
import { GenericSearchLoadActionCmd, GenericSearchLoadedActionCmd, GenericSearchLoadedErrorActionCmd } from './search.generic.actions';
import * as _ from "lodash";
import { functionLoading, functionLoaded, functionLoadedError, loadingActionFactory, loadedActionFactory, loadedErrorActionFactory } from '../store.persist/persist.actions';
import { Injectable } from '@angular/core';

export interface WdsStoreReadModel {
    data: {},
    others: {}
    status: WdsStoreLoadStatus
}

export interface ResourceStateModel {
    [key: string]: {
        "info": WdsStoreReadModel,
        "search": WdsStoreReadModel
    }
}
@State<ResourceStateModel>({
    name: 'resource',
    defaults: {
    }
})
@Injectable()
export class ResourceState {

    @Action(CreateResource)
    create({ patchState, getState, dispatch }: StateContext<ResourceStateModel>, { cmd }: CreateResource) {
        const state: ResourceStateModel = { ...getState() };
        if (!state[cmd.resourceId]) {
            state[cmd.resourceId] = {
                info: {
                    data: {},
                    others: {},
                    status: {
                        loading: false,
                        loaded: null
                    }
                },
                search: {
                    data: {},
                    others: {},
                    status: {
                        loading: false,
                        loaded: null
                    }
                }
            }
            patchState(state);
        }
    }
}
export function searchLoadFn(cmd: GenericSearchLoadActionCmd, stateContext: StateContext<any>) {
    const params = { ...cmd.params };
    const storePath = cmd.storePathFn();
    let paramsConverted: any = {};
    if (cmd.data.enablePaging) {
        // alert('enablePaging');
        // debugger;
        const page: number = cmd.params.page ? cmd.params.page - 1 : 0;
        const limit: number = cmd.params.size || 10;
        const offset: number = limit * (page);
        paramsConverted = _.pickBy({ ...cmd.params }, _.identity);
        paramsConverted.offset = offset;
        paramsConverted.limit = limit;
    }
    let entity$: Observable<any> = cmd.data.loadFn$(paramsConverted, stateContext);
    let othersRest$: Observable<any> = of([]);
    if (cmd.data.others && cmd.data.others.rest && cmd.data.others.rest.filter(r => !r.loadType || r.loadType == StateLoadType.Synchronous).length > 0) {
        const othersRestList$: Array<Observable<any>> = cmd.data.others.rest
            .filter(r => !r.loadType || r.loadType == StateLoadType.Synchronous)
            .map(o => o.loadFn$(null, params, stateContext).pipe(
                map(resp => ({ resp, name: o.name })))
            );
        othersRest$ = forkJoin(othersRestList$);
    }
    if (cmd.data.others && cmd.data.others.rest && cmd.data.others.rest.filter(r => r.loadType == StateLoadType.Asynchronous).length > 0) {
        cmd.data.others.rest
            .filter(r => r.loadType == StateLoadType.Asynchronous)
            .forEach(
                (r) => {
                }
            )
    }

    let othersGrapqhQl$: Observable<any> = of([]);
    if (cmd.data.others && cmd.data.others.graphql && cmd.data.others.graphql.filter(r => !r.loadType || r.loadType == StateLoadType.Synchronous).length > 0) {
        const othersGraphQlList$: Array<Observable<any>> = cmd.data.others.graphql
            .filter(r => r.loadType == StateLoadType.Synchronous)
            .map(o => o.loadFn$(null, params, stateContext).pipe(
                map(resp => ({ resp, name: o.name }))
            ));
        othersGrapqhQl$ = forkJoin(othersGraphQlList$);
    }
    if (cmd.data.others && cmd.data.others.graphql && cmd.data.others.graphql.filter(r => r.loadType == StateLoadType.Asynchronous).length > 0) {
        cmd.data.others.graphql
            .filter(r => r.loadType == StateLoadType.Asynchronous)
            .forEach(
                (r) => {

                }
            )
    }
    const loadingAction = loadingActionFactory(cmd.actions.loading, { storePath: storePath.loadStatus });
    stateContext.dispatch(loadingAction);

    return zip(entity$, othersRest$, othersGrapqhQl$, (entity, dataOthersRest: any[], dataGql) => {
        const othersRest: any = dataOthersRest.reduce((t, e) => {
            t[e.name] = e.resp
            return t;
        }, {});

        const others: any = othersRest;
        const tempo: any = { ...dataGql.data, ...othersRest };
        let data2: { data: any, others: any } = { data: entity, others }
        if (cmd.data.loadedPageOkFn)
            data2 = cmd.data.loadedPageOkFn(data2);
        return data2;
    }).pipe(
        flatMap(
            (dataLoaded: { data: any, others: any }) => {
                if (cmd.data.dispatchLoadedActionFn$)
                    return cmd.data.dispatchLoadedActionFn$(storePath, dataLoaded, stateContext)
                else {
                    const loadedActionCmd: GenericSearchLoadedActionCmd = {
                        storePath, dataLoaded
                    }
                    const loadedAction = loadedActionFactory(cmd.actions.loaded, loadedActionCmd);
                    return stateContext.dispatch(loadedAction);
                }
            }),
        catchError((error) => {
            console.error(error);
            const loadedErrorActionCmd: GenericSearchLoadedErrorActionCmd = {
                storePath: storePath.loadStatus,
                error
            }
            const loadedAErrorAction = loadedErrorActionFactory(cmd.actions.loadedError, loadedErrorActionCmd);
            return stateContext.dispatch(loadedAErrorAction);

        })
    )
}
