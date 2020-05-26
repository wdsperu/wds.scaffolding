import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { HttpClient } from '@angular/common/http';
import { loadResourceFormConfig } from '../Utils';
import { getResourceFormPaths } from '../store.persist/fn.utils';
import { ResourceConfig, getStateConfig } from './model';
import { ResourceGraphql } from '../graphql/model';


export class FormStateFactory {

    resourceConfig: ResourceConfig;

    constructor(private config: {
        id: string,
        component: any,
        dataFn$(trans: Transition, graphqlConfig: ResourceGraphql, resourceConfig: ResourceConfig): void
    }) {
        this.resourceConfig = getStateConfig(config.id);
    }

    build(): Ng2StateDeclaration {
        return {
            name: `${this.resourceConfig.form}`,
            url: `${this.resourceConfig.formUrl}`,
            data: {
                authType: 'recurso',
                config: {
                    id: this.config.id,
                    acciones: ['ESCRIBIR']
                }
            },
            resolve: [
                {
                    token: 'resourceFormConfig',
                    deps: [HttpClient],
                    resolveFn: (http: HttpClient) => {
                        return loadResourceFormConfig(http, this.resourceConfig.id)
                    }
                },
                {
                    token: 'storePaths',
                    deps: [Transition],
                    resolveFn: (trans: Transition) => {
                        return getResourceFormPaths(this.resourceConfig, trans.params());
                    }
                },
                {
                    token: 'data$',
                    deps: [Transition, 'graphqlConfig'],
                    resolveFn: (trans: Transition, graphqlConfig: ResourceGraphql) => {
                        this.config.dataFn$(trans, graphqlConfig, this.resourceConfig)
                    }
                },
                {
                    token: 'formConfig',
                    deps: ['resourceFormConfig', 'storePaths', 'graphqlConfig', 'resourceConfig'],
                    resolveFn: (resourceFormConfig: any, storePaths: any, graphqlConfig, resourceConfig) => {
                        return { resourceFormConfig, storePaths, graphqlConfig, resourceConfig }
                    }
                }
            ],
            views: {
                'content@app': {
                    component: this.config.component
                }
            }

        }








    }



}