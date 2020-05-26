import { HttpClient } from '@angular/common/http';
import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { getResourceSearchPaths } from '../store.persist/fn.utils';
import { ResourceSearchLoadType } from '../store/actions';
import { loadResourceSearchConfig } from '../Utils';
import { ResourceConfig, getStateConfig } from '../form/model';
import { ResourceGraphql } from '../graphql/model';

export class SearchState {
    resourceConfig: ResourceConfig;
    constructor(private config: {
        id: string,
        type: ResourceSearchLoadType,
        component: any,
        params: string[],
        paging: boolean,
        dataFn$(
            trans: Transition,
            graphqlConfig: ResourceGraphql,
            resourceConfig: ResourceConfig,
            type: ResourceSearchLoadType
        ): void
    }) {
        this.resourceConfig = getStateConfig(config.id, {
            params: config.params,
            paging: config.paging
        });
    }

    build(): Ng2StateDeclaration {
        return {
            name: this.resourceConfig.search,
            url: this.resourceConfig.searchUrl,
            data: {
                authType: 'recurso',
                config: {
                    id: this.config.id,
                    acciones: ['ESCRIBIR', 'LEER']
                }
            },
            resolve: [{
                token: 'resourceSearchConfig',
                deps: [HttpClient],
                resolveFn: (http: HttpClient) => {
                    return loadResourceSearchConfig(http, this.config.id)
                }
            },
            {
                token: 'data$',
                deps: [Transition, 'graphqlConfig'],
                resolveFn: (trans: Transition, graphqlConfig: ResourceGraphql) => {
                    this.config.dataFn$(trans, graphqlConfig, this.resourceConfig, this.config.type);
                }
            },
            {
                token: 'storePaths',
                deps: [Transition],
                resolveFn: (trans: Transition) => {
                    return getResourceSearchPaths(this.config.id, this.config.type);
                }
            },
            {
                token: 'searchConfig',
                deps: ['storePaths', 'resourceSearchConfig', 'resourceConfig'],
                resolveFn: (storePaths: any, resourceSearchConfig: any, resourceConfig: any) => {
                    return {
                        resourceSearchConfig,
                        storePaths,
                        resourceConfig,
                    }
                }
            }],
            views: {
                'content@app': {
                    component: this.config.component
                }
            }
        }
    }
}