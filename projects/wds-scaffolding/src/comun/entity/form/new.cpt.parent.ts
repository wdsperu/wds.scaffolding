import { Component, Input, OnInit, Directive, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { FormConfigCpt } from './model';
import { Store, StateContext } from '@ngxs/store';
import { StateService } from '@uirouter/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { map, flatMap, filter, take, delay, debounceTime } from 'rxjs/operators';
import { of, zip, Observable } from 'rxjs';
import { ResourceFormResetLoadAction, ResourceFormSubmit, ResourceFormSetErrors } from '../store.persist/persist.actions';
import gql from 'graphql-tag';
import { ResourceSearchAddAction } from '../store/actions';
import { ResourceFormSaveAction } from '../store.persist/persist.save.actions';
import { FormGroup, FormArray } from '@angular/forms';
import { WdsStoreLoadStatusType } from '../store.persist/persist.model';
import { ClearResource } from '../store.persist/tabs';
import { utilsGetJsonByPath } from '../store/generic.save.service';
import { WdsTemplateDirective } from '../w.template.directive';
import { schemeToFormGroup, instanceNode } from 'projects/wds-scaffolding/src/renderer/fn.utils';

@Component({
    selector: 'w-form',
    templateUrl: './cpt.parent.html',
    providers: [MessageService]
})
export class FormCpt implements OnInit {

    @Input()
    formConfig: FormConfigCpt;

    @ContentChildren(WdsTemplateDirective) templates: QueryList<WdsTemplateDirective>;

    resourceForm: FormGroup;

    entity$: Observable<any>;

    loadStatus$: Observable<any>;

    saveStatus$: Observable<any>

    inputContainer: any;

    formTemplate: TemplateRef<any>;
    buttonsTemplate: TemplateRef<any>;

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'form':
                    this.formTemplate = item.template;
                    break;
                case 'buttons':
                    this.buttonsTemplate = item.template;
                    break;

            }
        });
    }

    constructor(
        protected store: Store,
        protected stateService: StateService,
        protected apollo: Apollo,
        protected messageService: MessageService
    ) { }

    get dispatchSave$() {
        return this.store.dispatch(
            this.saveAction
        ).pipe(
            map(state => {
                return this.getJsonByPath(state, `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.saveStatus}`);
            }),
            flatMap(saveStatus => {
                let tempo$ = of(null);
                if (saveStatus.saved == 'OK' && !saveStatus.saving) {
                    tempo$ =
                        zip(
                            this.store.dispatch(new ResourceFormResetLoadAction({ storePath: this.formConfig.storePaths.base })),
                            this.store.select(state => {
                                return utilsGetJsonByPath(state, `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.base}.data.form.saved`)
                            })
                                .pipe(
                                    flatMap(resp => {
                                        const tempo = resp[Object.keys(resp)[0]];
                                        const data = tempo[Object.keys(tempo)[0]];
                                        const id = data.id;
                                        const query = gql(this.formConfig.graphqlConfig.form.update.load);
                                        return this.apollo.query(
                                            {
                                                query,
                                                variables: { id }
                                            }
                                        ).pipe(
                                            map(resp => {
                                                const key = Object.keys(resp.data)[0];
                                                const temp = resp.data[key];
                                                const tempKey = Object.keys(temp)[0]
                                                return resp.data[key][tempKey][0];
                                            }),
                                            map(resource => {
                                                resource.obligatorio = resource.obligatorio ? 'Si' : 'No';
                                                resource.estado = resource.estado == 'A' ? 'ACTIVO' : 'DESHABILITADO'
                                                return resource;
                                            }),
                                            flatMap(data => {
                                                return this.store.dispatch(new ResourceSearchAddAction({
                                                    storePath: `entity.${this.formConfig.resourceConfig.id}.search`,
                                                    data
                                                }));
                                            })
                                        )


                                    })
                                )
                        )
                }
                //  else
                //     if (saveStatus.savedOk == 'ERROR' && !saveStatus.saving) {
                //         return of(saveStatus);
                //     }
                return tempo$.pipe(map(x => saveStatus));

                // const saveStatus = this.getJsonByPath(state, `${this.storePaths.context}.${this.storePaths.saveStatus}`)
                // return ;



            })
        )
    }
    get saveAction(): ResourceFormSaveAction {
        return new ResourceFormSaveAction({
            resourceId: this.formConfig.resourceConfig.id,
            params: this.stateService.params,
            paramNameId: this.formConfig.resourceConfig.paramIdName,
            data: {
                convertDataFn: this.convertDataFn,
                create: {
                    entityFn$: this.createEntityFnWrapper()
                },
                update: {
                    entityFn$: this.createEntityFnWrapper()
                },
                savedOkFn: (data) => {
                    return data;
                }
            },
        })
    }

    updateEntityFnWrapper() {
        const mutation: string = this.getUpdateMutation();
        return (convertedData: any, stateContext: StateContext<any>) => {
            return this.apollo.use('mantenimiento').mutate({
                mutation: gql(mutation),
                variables: {
                    data: convertedData
                }
            });
        }

    }
    createEntityFnWrapper() {
        const mutation: string = this.getSaveMutation();
        return (convertedData: any, stateContext: StateContext<any>) => {
            return this.apollo.use('mantenimiento').mutate({
                mutation: gql(mutation),
                variables: {
                    data: convertedData
                }
            });
        }
    }




    convertDataFn(data: any) {
        return data;
    }

    createEntityFn$(convertedData: any, stateContext: StateContext<any>) {
        const mutation: string = this.getSaveMutation();
        return this.apollo.use('mantenimiento').mutate({
            mutation: gql(mutation),
            variables: {
                data: convertedData
            }
        });
    }

    getSaveMutation(): string {
        return this.formConfig.graphqlConfig.form.create.save

    }

    getUpdateMutation(): string {
        return this.formConfig.graphqlConfig.form.create.save
    }



    updateEntityFn$(convertedData: any, stateContext: StateContext<any>) {
        return of({}).pipe(map(x => { throw 'NotImplementedUpdateEntityFn$'; return x; }))
    }

    ngOnDestroy() {
        this.store.dispatch(new ResourceFormSubmit({
            storePath: this.formConfig.storePaths.ngxsForm,
            value: null
        }));
    }


    ngOnInit() {
        // alert('init');
        this.inputContainer = this.formConfig.resourceFormConfig.inputContainers.map(
            ic => {
                ic.input.elements = ic.input.elements.map(ie => {
                    ie.inputConfig = this.formConfig.resourceFormConfig.inputs.find(i => i.id == ie.inputId);
                    ie.inputConfig.formPath = `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.base}`;
                    return ie;
                });
                return ic;
            }).
            reduce((t, e) => {
                t[e.id] = e;
                return t;
            }, {});
        this.loadStatus$ = this.store.select(state => {
            return this.getJsonByPath(state, `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.loadStatus}`)
        });

        this.saveStatus$ = this.store.select(state => {
            return this.getJsonByPath(state, `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.saveStatus}`)
        });

        this.entity$ = this.loadStatus$.pipe(
            filter((loadStatus: any) => {
                return loadStatus.loaded == WdsStoreLoadStatusType.OK;
            }),
            flatMap(loadedOk => this.store.select(state => {
                return this.getJsonByPath(state, `${this.formConfig.storePaths.context}.${this.formConfig.storePaths.data}`)
            }))
        );
        this.resourceForm = new FormGroup({});
        //TRACE ...
        // instanceNode({}, this.resourceFormConfig.schema.children, this.resourceForm);
        schemeToFormGroup(this.formConfig.resourceFormConfig.schema.children, this.resourceForm)
        if (this.formConfig.onFormCreated)
            this.formConfig.onFormCreated(this.resourceForm);
        this.entity$
            .pipe(
                take(1),
                delay(100)
            ).subscribe(entity => {
                instanceNode(entity, this.formConfig.resourceFormConfig.schema.children, this.resourceForm);
                this.resourceForm.patchValue(entity);
            });
        this.resourceForm.valueChanges.pipe(
            debounceTime(1000),
            map(
                (form) => {
                    return form;// this.getAllErrors(this.resourceForm)
                }
            ),
            // filter(x => !!x),
            flatMap(errors => {
                return this.store.dispatch(
                    new ResourceFormSetErrors({
                        errors,
                        storePath: this.formConfig.storePaths.ngxsForm
                    })
                )

            })
        ).subscribe();

    }

    getJsonByPath(data: any, path: string) {
        return path.split('.').reduce((t, e) => {
            t = t[e];
            return t;
        }, data)
    }


    getVariable = (name: string): Observable<any> => {
        // return this.loadStatus$.pipe(
        //     filter((loadStatus: any) => loadStatus.loaded == EnumLoadedType.OK),
        //     flatMap(loadedOk => this.store.select(state => this.formConfig.loadedOkFn(state, this.formConfig.config).others[name])),
        //     take(1)
        // )
        return null;
    }

    saveValid = () => {
        this.store.dispatch(new ResourceFormSubmit({
            storePath: this.formConfig.storePaths.ngxsForm,
            value: true
        }));

        if (this.resourceForm.valid)
            this.save();
        else {
            this.messageService.add({ severity: 'error', summary: 'Formulario', detail: 'Invalido' });
        }
    }

    save = () => {
        this.dispatchSave$.subscribe(result => {
            if (result.saved == 'OK') {
                this.messageService.add({ severity: 'success', summary: 'Formulario', detail: 'Guardado Satisfactoriamente' });
                setTimeout(() => {
                    const params = this.store.selectSnapshot(state => utilsGetJsonByPath(state, `persist.entity.${this.formConfig.resourceConfig.id}.search.data.params.data`))
                    this.stateService.go(this.formConfig.resourceConfig.search, params);
                }, 2000)
            } else {
                this.messageService.add({ severity: 'error', summary: 'Formulario', detail: 'Error Al Guardar' });
            };
        })
    }


    getAllErrors(form: FormGroup | FormArray): { [key: string]: any; } | null {
        let hasError = false;
        const result = Object.keys(form.controls).reduce((acc, key) => {
            const control = form.get(key);
            const errors = (control instanceof FormGroup || control instanceof FormArray)
                ? this.getAllErrors(control)
                : control.errors;
            if (errors) {
                acc[key] = errors;
                hasError = true;
            }
            return acc;
        }, {} as { [key: string]: any; });
        return hasError ? result : null;
    }

    print(form: FormGroup | FormArray): { [key: string]: any; } | null {
        const result = Object.keys(form.controls).
            filter((key: string) => !key.endsWith('_config'))
            .reduce((acc, key) => {
                const control = form.get(key);
                const value = (control instanceof FormGroup || control instanceof FormArray)
                    ? this.print(control)
                    : control.value;
                acc[key] = value;
                return acc;
            }, {} as { [key: string]: any; });

        return result;
    };
    clean() {
        this.store.dispatch(new ClearResource({ resourceId: this.formConfig.resourceConfig.id }));
    }

    resetForm() {
        this.store.dispatch(new ResourceFormResetLoadAction({ storePath: this.formConfig.storePaths.base }))
            .subscribe(c => {
                this.stateService.go(this.formConfig.resourceConfig.form, this.stateService.params, { reload: true })
            });
    }


    cancel() {
        if (!this.resourceForm.get('id').value)
            this.store.dispatch(new ResourceFormResetLoadAction({ storePath: this.formConfig.storePaths.base }));
        const params = this.store.selectSnapshot(state => state.persist.entity[this.formConfig.resourceConfig.id].search.data.params.data);
        this.stateService.go(`${this.formConfig.resourceConfig.search}`, params)

    }
}
