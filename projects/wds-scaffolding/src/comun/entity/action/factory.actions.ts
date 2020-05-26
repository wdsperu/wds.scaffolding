import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Ng2StateDeclaration } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { of } from 'rxjs';
import { ResourceConfig, getStateConfig } from '../form/model';
import { ResourceGraphql } from '../graphql/model';
import { SelectResource } from '../store.persist/tabs';

export class ActionsFactory {
    private resourceConfig: ResourceConfig;
    constructor(
        private config: {
            id: string,
            component: any,
            graphqlConfig: ResourceGraphql,
            url?: string
        }
    ) {
        this.resourceConfig = getStateConfig(config.id)
    }

    build(): Ng2StateDeclaration {
        const actionsState: Ng2StateDeclaration = {
            name: `${this.resourceConfig.base}`,
            url: this.config.url,
            resolve: [
                {
                    token: 'entityModel',
                    deps: [Transition, HttpClient],
                    resolveFn: (transition: Transition, http: HttpClient) => {
                        const injector = transition.injector();
                        const store = injector.get(Store);
                        store.dispatch(new SelectResource({ resourceId: this.resourceConfig.id }));
                        return of({}).toPromise()//wdsLoadModel(http, `${resourceId}.actions`)
                    }
                },
                {
                    token: 'resourceConfig',
                    resolveFn: () => {
                        return this.resourceConfig;
                    }
                },
                {
                    token: 'graphqlConfig',
                    resolveFn: () => {
                        return this.config.graphqlConfig;
                    }
                },
                {
                    token: 'actionsConfig',
                    deps: ['resourceConfig'],
                    resolveFn: (resourceConfig: any) => {
                        return {
                            entityModel: {},
                            resourceConfig,
                        }
                    }
                }
            ],
            views: {
                'actions@app': {
                    component: this.config.component
                }
            }
        };
        return actionsState;
    }
}