import { Injectable } from '@angular/core';
import { Action, State, StateContext } from "@ngxs/store";
import { functionLoaded, functionLoadedError, functionLoading, ResourceFormClearAction, ResourceFormLoadAction, ResourceFormLoadedAction, ResourceFormLoadedErrorAction, ResourceFormLoadingAction, functionSaving, functionSaved, functionSavedError, ResourceFormSetErrors, functionFormSetErrors, ResourceFormSubmit, functionFormSubmit, ResourceFormResetLoadAction, functionFormReset, functionSearchClear, functionSearchAdd } from './persist.actions';
import { PersistStateModel, WdsStorePersistData, WdsStorePersistSearchData } from "./persist.model";
import { ResourceFormSaveAction, ResourceFormSavedAction, ResourceFormSavedErrorAction, ResourceFormSavingAction } from './persist.save.actions';
import { WdsGenericStoreService } from './service';
import { CreateResource, SelectResource, UnSelectResource } from './tabs';
import { GenericFormSaveService } from '../store/generic.save.service';
import { ResourceSearchLoadAction, ResourceSearchLoadingAction, ResourceSearchLoadedAction, ResourceSearchLoadedErrorAction, ResourceSearchClearAction, ResourceSearchAddAction } from '../store/actions';
import { searchLoadFn } from '../store/store';
import { ResourceAdvencedSearchToogleAction } from './advanced.search.actions';

@State<PersistStateModel>({
    name: 'persist',
    defaults: {
        tabs: [],
        entity: {}
    }
})
@Injectable()
export class PersistState {

    constructor(
        private genericStoreService: WdsGenericStoreService,
        private genericFormSaveService: GenericFormSaveService
    ) { }

    formDefault: WdsStorePersistData = {
        data: {
            form: {
                model: {

                }
            },
            status: {
                saved: null,
                saving: false
            }
        },
        status: {
            loaded: null,
            loading: false
        },
        others: {}
    };
    searchDefault: WdsStorePersistSearchData = {
        filter: {
            advancedSearchIsOpen: false,
            model: {}
        },
        data: {
            params: {
                loaded: false,
                data: {}
            },
            result: null
        },
        others: {},
        status: {
            loaded: null,
            error: null,
            loading: false
        }
    }


    @Action(ResourceAdvencedSearchToogleAction)
    toogle({ patchState, getState, dispatch }: StateContext<PersistStateModel>, { cmd }: ResourceAdvencedSearchToogleAction) {
        const state: PersistStateModel = { ...getState() };
        state.entity[cmd.resourceId].search.filter.advancedSearchIsOpen = !state.entity[cmd.resourceId].search.filter.advancedSearchIsOpen;
        patchState(state);
    }



    @Action(SelectResource)
    select({ patchState, getState, dispatch }: StateContext<PersistStateModel>, { cmd }: SelectResource) {
        const state: PersistStateModel = { ...getState() };
        const found: string = state.tabs.find(btn => btn == cmd.resourceId);
        if (!found) {
            state.tabs = [cmd.resourceId, ...state.tabs]
            patchState(state);
        }
    }
    @Action(UnSelectResource)
    unSelect({ patchState, getState, dispatch }: StateContext<PersistStateModel>, { cmd }: UnSelectResource) {
        const state: PersistStateModel = { ...getState() };
        state.tabs = state.tabs.filter(tab => tab != cmd.resourceId);
        patchState(state);
    }

    @Action(CreateResource)
    create({ patchState, getState, dispatch }: StateContext<PersistStateModel>, { cmd }: CreateResource) {
        const state: PersistStateModel = { ...getState() };
        let entityState: any = state.entity[cmd.resourceId];
        if (!entityState) {
            entityState = {
                actions: { ...this.formDefault },
                search: { ...this.searchDefault }
            }
            if (cmd.action == 'ESCRIBIR') {
                entityState.form = { create: { ...this.formDefault }, update: { ...this.formDefault } };
            }
            state.entity[cmd.resourceId] = entityState;
            patchState(state);
        }
    }
    /******************* LOAD ENTITY ***********************/
    @Action(ResourceFormLoadAction)
    load(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormLoadAction) {
        return this.genericStoreService.loadEntity(cmd, stateContext);
    }
    @Action(ResourceFormLoadingAction)
    loading(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormLoadingAction) {
        functionLoading(cmd, stateContext)
    }
    @Action(ResourceFormLoadedAction)
    loaded(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormLoadedAction) {
        functionLoaded(cmd, stateContext)
    }
    @Action(ResourceFormLoadedErrorAction)
    loadedError(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormLoadedErrorAction) {
        functionLoadedError(cmd, stateContext)
    }

    @Action(ResourceFormClearAction)
    clear({ patchState, getState, dispatch }: StateContext<PersistStateModel>, { cmd }: ResourceFormClearAction) {
        alert('ResourceFormClearAction');
        debugger;
    }
    /******************* SAVE ENTITY ***********************/
    @Action(ResourceFormSaveAction)
    save(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSaveAction) {
        return this.genericFormSaveService.saveGeneric(cmd, stateContext);
    }
    @Action(ResourceFormSavingAction)
    saving(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSavingAction) {
        functionSaving(cmd, stateContext)
    }
    @Action(ResourceFormSavedAction)
    saved(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSavedAction) {
        functionSaved(cmd, stateContext)
    }
    @Action(ResourceFormSavedErrorAction)
    savedError(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSavedErrorAction) {
        functionSavedError(cmd, stateContext)
    }


    @Action(ResourceFormSetErrors)
    setError(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSetErrors) {
        functionFormSetErrors(cmd, stateContext)
    }

    @Action(ResourceFormSubmit)
    submit(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormSubmit) {
        functionFormSubmit(cmd, stateContext)
    }

    @Action(ResourceFormResetLoadAction)
    resetLoad(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceFormResetLoadAction) {
        functionFormReset(cmd, stateContext)
    }




    /******************** SEARCH RESOURCE *************************/
    @Action(ResourceSearchLoadAction)
    searchLoad(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchLoadAction) {
        return searchLoadFn(cmd, stateContext);
    }
    @Action(ResourceSearchLoadingAction)
    searchLoading(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchLoadingAction) {
        functionLoading(cmd, stateContext)
    }
    @Action(ResourceSearchLoadedAction)
    searchLoaded(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchLoadedAction) {
        functionLoaded(cmd, stateContext)
    }
    @Action(ResourceSearchLoadedErrorAction)
    searchLoadedError(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchLoadedErrorAction) {
        functionLoadedError(cmd, stateContext)
    }
    @Action(ResourceSearchClearAction)
    searchClear(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchClearAction) {
        functionSearchClear(cmd, stateContext)
    }

    @Action(ResourceSearchAddAction)
    add(stateContext: StateContext<PersistStateModel>, { cmd }: ResourceSearchAddAction) {
        functionSearchAdd(cmd, stateContext)
    }





}