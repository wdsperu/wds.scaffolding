import { WdsStoreFormModeType } from './persist.model';
import { ResourceSearchLoadType } from '../store/actions';
import { ResourceConfig } from '../form/model';

export interface ResourceFormPaths {
    context: string,
    base: string,
    resource: string,
    loadStatus: string,
    saveStatus: string,
    ngxsForm: string,
    data: string,
    others: string,
}

export function getResourceFormMode(resourceConfig: ResourceConfig, params: any): WdsStoreFormModeType {
    return params[resourceConfig.paramIdName] ? WdsStoreFormModeType.update : WdsStoreFormModeType.create;
}
export function getResourceFormPaths(resourceConfig: ResourceConfig, params: any): ResourceFormPaths {
    const mode = getResourceFormMode(resourceConfig, params);
    const base: string = `entity.${resourceConfig.id}.form.${mode}`;

    const ngxsForm: string = `entity.${resourceConfig.id}.form.${mode}.data.form`;
    return {
        context: 'persist',
        base,
        resource: `entity.${resourceConfig.id}`,
        loadStatus: `${base}.status`,
        saveStatus: `${base}.data.status`,
        ngxsForm,
        data: `${ngxsForm}.model`,
        others: `${base}.others`
    }
}
export function getResourceSearchPaths(resourceId: string, type: ResourceSearchLoadType) {

    const data: string = `entity.${resourceId}.search.data`;
    const loadStatus: string = `entity.${resourceId}.search.status`;
    const others: string = `entity.${resourceId}.search.others`;

    return {
        data,
        loadStatus,
        others,
        data2: `persist.${data}`,
        loadStatus2: `persist.${loadStatus}`,
        others2: `persist.${others}`,
        resource: ''
    };
}






