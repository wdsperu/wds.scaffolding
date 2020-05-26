import { Injectable } from '@angular/core';
import { StateContext } from '@ngxs/store';
import { catchError, flatMap } from 'rxjs/operators';
import { savedActionFactory, savedErrorActionFactory, savingActionFactory } from '../store.persist/persist.actions';
import { WdsStoreFormModeType } from '../store.persist/persist.model';
import { GenericFormSaveActionCmd, GenericFormSavedActionCmd, GenericFormSavedErrorActionCmd } from './generic.save.actions';
import * as _ from 'lodash';
@Injectable()
export class GenericFormSaveService {

    saveGeneric(saveCmd: GenericFormSaveActionCmd, stateContext: StateContext<any>) {
        const state: any = stateContext.getState();
        const mode = saveCmd.params[saveCmd.paramNameId] ? WdsStoreFormModeType.update : WdsStoreFormModeType.create;
        const params = saveCmd.params;
        const paths = saveCmd.storePathFn(mode);
        const data = { ...utilsGetJsonByPath(state, paths.data) };

        const dataConverted = saveCmd.data.convertDataFn ? saveCmd.data.convertDataFn(_.cloneDeep(data), params, stateContext) : data;
        const entityFn$ = saveCmd.data[mode].entityFn$(dataConverted, stateContext);
        const savingAction = savingActionFactory(saveCmd.actions.saving, { storePath: paths.saveStatus })
        stateContext.dispatch(savingAction);
        return entityFn$.pipe(
            flatMap((savedResponse: any) => {
                if (saveCmd.data.dispatchSavedActionFn$)
                    return saveCmd.data.dispatchSavedActionFn$(paths, savedResponse, stateContext)
                else {
                    const savedActionCmd: GenericFormSavedActionCmd = {
                        savedResponse,
                        storePath: {
                            data: savedResponse,
                            saveStatus: paths.saveStatus
                        }
                    };
                    const savedAction = savedActionFactory(saveCmd.actions.saved, savedActionCmd);
                    return stateContext.dispatch(savedAction);
                }
            }),
            catchError((error) => {
                console.error(error);
                const savedActionErrorCmd: GenericFormSavedErrorActionCmd = {
                    error,
                    storePath: paths.saveStatus
                };
                const savedErrorAction = savedErrorActionFactory(saveCmd.actions.savedError, savedActionErrorCmd);
                return stateContext.dispatch(savedErrorAction)
            })
        )
    }
}



export function utilsGetJsonByPath(data: any, path: string) {
    return path.split('.').reduce((t, e) => {
        t = t[e];
        return t;
    }, data)
}