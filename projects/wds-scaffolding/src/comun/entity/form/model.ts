import { FormGroup } from '@angular/forms';
import { ResourceGraphql } from '../graphql/model';
import { ResourceFormPaths } from '../store.persist/fn.utils';

export interface FormConfigCpt {
    graphqlConfig: ResourceGraphql,
    storePaths: ResourceFormPaths,
    resourceConfig: ResourceConfig,
    resourceFormConfig: any,
    onFormCreated?(formGroup: FormGroup): void
}

export interface SearchConfigCpt {
    resourceSearchConfig: any,
    storePaths: {
        data: string,
        loadStatus: string,
        others: string,
        resource: string
    },
    resourceConfig: ResourceConfig,
}

export interface ActionsConfigCpt {
    entityModel: any,
    resourceConfig: ResourceConfig,
}






export function resourceIdToState(resourceId: string): string {
    const parts: string[] = resourceId.split('_');
    const module: string = parts[0];
    const middle = parts.slice(1, parts.length - 1).map(x => `${x}.info`);
    const last: string = parts[parts.length - 1];
    const state: string = [module, ...middle, last].join('.')
    return state
}

export interface ResourceConfig {
    id: string,
    base: string,
    paramIdName: string,
    form: string,
    formUrl: string,
    search: string,
    searchUrl: string,
    searchParams?: string[]
    info: string,
    infoUrl: string
}

export function getStateConfig(resourceId: string, search?: { paging: boolean, params: string[] }): ResourceConfig {
    const parts: string[] = resourceId.split('_');
    const module: string = parts[0];
    const middle = parts.slice(1, parts.length - 1).map(x => `${x}.info`);
    const last: string = parts[parts.length - 1];
    const stateBaseName: string = [module, ...middle, last].join('.')
    const paramIdName = `${last}Id`;
    let searchUrl = undefined;
    let searchParams: string[] = [];
    if (search) {
        if (search.paging)
            searchParams = [...search.params, 'page', 'size']

        // searchUrl = `${searchUrl}{page}&{size}&`;
        searchUrl = `/search?` + searchParams.map(p => `{${p}}`).join('&');
    }
    return {
        id: resourceId,
        base: stateBaseName,
        paramIdName,
        form: `${stateBaseName}.form`,
        formUrl: `/form_{${paramIdName}}`,
        search: `${stateBaseName}.search`,
        searchUrl,
        searchParams,
        info: `${stateBaseName}.info`,
        infoUrl: `/{${paramIdName}}`,
    }
}