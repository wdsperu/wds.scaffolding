import { Injectable } from '@angular/core';
import { StateContext } from '@ngxs/store';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { catchError, flatMap, map, delay } from 'rxjs/operators';
import { getResourceFormMode } from './fn.utils';
import { ResourceFormLoadActionCmd, ResourceFormLoadedAction, ResourceFormLoadedErrorAction, ResourceFormLoadingAction, loadingActionFactory } from './persist.actions';
import { PersistStateModel, WdsStoreFormModeType, WdsStoreLoadStatusType } from './persist.model';
import { StateLoadType } from '../../enums/enums';

@Injectable()
export class WdsGenericStoreService {

    loadEntity(cmd: ResourceFormLoadActionCmd, stateContext: StateContext<PersistStateModel>) {
        const state: PersistStateModel = stateContext.getState();
        const resource = state.entity[cmd.resourceConfig.id];
        const mode = getResourceFormMode(cmd.resourceConfig, cmd.params);
        const params = cmd.params;
        const storePath = cmd.storePathFn(mode);
        let entity$: Observable<any> = null;
        cmd.data.create = cmd.data.create || {};
        const defaultData = cmd.data.create.defaultFn ? cmd.data.create.defaultFn(params, stateContext) : {};
        if (mode === WdsStoreFormModeType.create) {
            // if (resource.form.create.status.loaded == WdsStoreLoadStatusType.OK)
            //     return;
            entity$ = cmd.data.create.entityFn$ ? cmd.data.create.entityFn$(params, stateContext) : of(defaultData);
        } else if (mode === WdsStoreFormModeType.update) {
            entity$ = cmd.data.update.entityFn$(defaultData, params, stateContext);
        };

        // cmd.data.others.rest.map(rest => rest.loadFn$(defaultData, params, stateContext)
        //     .pipe(
        //         map(resp => ({ resp, name: o.rest.name }))
        //     )

        let othersRest$: Observable<any> = of([]);
        if (cmd.data.others && cmd.data.others.rest && cmd.data.others.rest.filter(r => !r.type || r.type == StateLoadType.Synchronous).length > 0) {
            const othersRestList$: Array<Observable<any>> = cmd.data.others.rest
                .filter(r => !r.type || r.type == StateLoadType.Synchronous)
                .map(o => o.loadFn$(null, params, stateContext).pipe(
                    map(resp => ({ resp, name: o.name }))
                )
                );
            othersRest$ = forkJoin(othersRestList$);
        }
        if (cmd.data.others && cmd.data.others.rest && cmd.data.others.rest.filter(r => r.type == StateLoadType.Asynchronous).length > 0) {
            cmd.data.others.rest
                .filter(r => r.type == StateLoadType.Asynchronous)
                .forEach(
                    (r) => {
                    }
                )
        }

        let othersGrapqhQl$: Observable<any> = of([]);
        if (cmd.data.others && cmd.data.others.graphql && cmd.data.others.graphql.filter(r => !r.type || r.type == StateLoadType.Synchronous).length > 0) {
            const othersGraphQlList$: Array<Observable<any>> = cmd.data.others.graphql
                .filter(r => r.type == StateLoadType.Synchronous)
                .map(o => o.loadFn$(null, params, stateContext).pipe(
                    map(resp => ({ resp, name: o.name }))
                ));
            othersGrapqhQl$ = forkJoin(othersGraphQlList$);
        }
        if (cmd.data.others && cmd.data.others.graphql && cmd.data.others.graphql.filter(r => r.type == StateLoadType.Asynchronous).length > 0) {
            cmd.data.others.graphql
                .filter(r => r.type == StateLoadType.Asynchronous)
                .forEach(
                    (r) => {

                    }
                )
        }

        const loadingAction = loadingActionFactory(ResourceFormLoadingAction, { storePath: storePath.loadStatus })
        stateContext.dispatch(loadingAction);

        return zip(entity$, othersRest$, othersGrapqhQl$, (entity, dataOthersRest: any[], dataGql) => {
            if (!entity) {
                throw { error: 'Resource Not Found!' }
            }
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
                    return stateContext.dispatch(new ResourceFormLoadedAction({
                        storePath: storePath, dataLoaded
                    }));
                }),
            catchError((error) => {
                console.error(error);
                debugger;
                return stateContext.dispatch(new ResourceFormLoadedErrorAction({ storePath: storePath.loadStatus, error }))
            })
        )
    }


}