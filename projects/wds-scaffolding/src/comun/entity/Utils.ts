import { HttpClient } from '@angular/common/http';
import { Transition } from '@uirouter/core';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

export function getStateFromResourceId(id: string) {
    let parts: string[] = id.split('_');
    const module: string = parts[0];
    parts = id.split('_').splice(1);
    const last: string = parts.pop();
    const view: string = parts.reduce((t, e) => {
        t += `.${e}.info`;
        return t;
    }, module);
    return { view: parts.length > 0 ? `content@${view}` : 'content@app', state: `${view}.${last}` }
}


export function entityModelFn(http: HttpClient, trans: Transition) {
    const params: any = trans.params();
    const actividadId: string = params.activityTemplateId;
    const parteId: string = params.activityPartTemplateCode;
    return http.get(`/assets/entityModel/actividades/${actividadId}/${parteId}.json`).toPromise()
}

export function resolve$Fn(http: HttpClient) {
    return http.get(`/assets/entityModel/{moduleName}/{entityName}.json`).toPromise()
}

export function loadResourceFormConfig(http: HttpClient, resourceId: string) {
    const module: string = resourceId.split('_')[0]
    const resource: string = resourceId.split(`${module}_`)[1];

    return zip(
        http.get(`/assets/entityModel/${module}/${resource}/form/schema.json`),
        http.get(`/assets/entityModel/${module}/${resource}/form/input.container.json`),
        http.get(`/assets/entityModel/${module}/${resource}/form/input.json`)
            .pipe(
                map((inputs: []) => {
                    return inputs.map(
                        (input: any) => {
                            if (input.config) {
                                const tempo = Object.keys(input.config)[0];
                                input.config = input.config[tempo];
                            }
                            return input;
                        })
                })
            ),
        (schema, inputContainers, inputs) => ({ schema, inputContainers, inputs })
    ).toPromise()
}



export function loadResourceSearchConfig(http: HttpClient, resourceId: string) {
    const module: string = resourceId.split('_')[0]
    const resource: string = resourceId.split(`${module}_`)[1];
    return http.get(`/assets/entityModel/${module}/${resource}/search/config.json`)
        .toPromise()
}


export function wdsLoadActividadParteModel() {
    return {
        token: 'entityModel',
        deps: [HttpClient, Transition],
        resolveFn: entityModelFn
    }
}

