import { AfterViewInit, Component, ContentChildren, Input, OnInit, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { combineLatest, interval, merge, Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { WdsRendererStringInputCpt } from '../input/stringInput/cpt';
import { WdsInputContainerModel } from './model';
import { utilsGetJsonByPath } from '../utils';
export type ValidatorFactory = (args: any) => ValidatorFn;

export interface WdsFormContext {
    path: string
}
export enum WdsRenderSchemaNodeType {
    FormControl = 'FormControl', FormGroup = 'FormGroup', FormArray = 'FormArray'
}
export interface WdsRenderSchema {
    id: string,
    type: WdsRenderSchemaNodeType,
    children: WdsRenderSchema[]
}
export interface PathConfig {

}

@Component({
    selector: 'w-input',
    templateUrl: './cpt.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WdsRendererInputContainerCpt implements OnInit, AfterViewInit {

    @Input()
    contextConfig: WdsFormContext;

    @Input()
    schema: WdsRenderSchema[];


    @Input('formGroup')
    formGroup: FormGroup;

    @Input()
    inputContainer: WdsInputContainerModel;

    errors$: Observable<any>[] = [];
    @ContentChildren(WdsRendererStringInputCpt) tabPanels: QueryList<WdsRendererStringInputCpt>;

    ngAfterViewInit() {
        // alert(this.tabPanels);
        // debugger
    };
    constructor(
        private store: Store
    ) {

    }

    getRelativePath(nodes: WdsRenderSchema[], id: string): PathConfig {
        let last = null;
        const paths: string[] = id.split('.').map(x => {
            last = x = last ? [last, x].join('.') : x;
            return x;
        });
        const value = paths.reduce((t, e) => {
            const node: WdsRenderSchema = t.nodes.find(node => node.id == e);
            if (node) {
                let path = '';
                let containerType = t.containerType;
                if (node.type == 'FormArray')
                    containerType = 'FormArray';
                if (node.type == 'FormGroup' || node.type == 'FormControl') {
                    if (t.path)
                        path = t.path + '.';
                    path = path + e.split('.')[e.split('.').length - 1];
                }
                return { nodes: node.children, path, containerType }
            } else
                throw 'Not Found'
        }, { nodes, path: '', containerType: 'FormGroup' });
        return value;
    }

    ngOnInit() {
        const formPath: string = this.inputContainer.input.elements[0].inputConfig.formPath;
        const submitted$: Observable<Boolean> = this.store.select(state => {
            return utilsGetJsonByPath(state, `${formPath}.data.form.w_submit`);
        });
        this.inputContainer.input.elements.forEach(e => {
            const pathConfig = this.getRelativePath(this.schema, e.inputId);
            const formControl = this.getFormControl(this.formGroup, pathConfig)
            this.addValidations(formControl, e.inputConfig.validators);
            e.inputConfig.errors$ = this.getErrors$(formControl, submitted$);
            e.inputConfig.formControl = formControl;
            /************************************+++ */
        })
    }



    getFormControl(formGroup: FormGroup, pathConfig: any) {
        let path = pathConfig.path;
        if (pathConfig.containerType === 'FormArray') {
            const parts: string[] = pathConfig.path.split('.');
            path = parts.slice(1).join('.');
        }
        const internalFormControl = path.split('.')
            .reduce((t, e) => {
                if (t instanceof FormControl || t instanceof FormArray)
                    throw `node:${pathConfig.path} ->${e} is not a instanceOf FormGroup `;
                if (!t) {
                    console.error(this.formGroup.value);
                    throw `node:${pathConfig.path} ->${e} T null`;
                }
                const c = t.get(e);
                return c;
            }, formGroup);
        if (!internalFormControl) {
            throw `node:${pathConfig.path} -> not Found.`;
        }
        if (!(internalFormControl instanceof FormControl)) {
            throw `node:${pathConfig.path} -> is not a instanceOf FormControl.`
        }
        return internalFormControl;
    }

    addValidations(formControl: FormControl, validators: any[]) {

        const functions = validators
            .filter((x: any) => x.checked)
            .map(
                (validator) => {
                    const args = validator.args || null;
                    return this.getValidatorFn(validator.type, args)
                }
            )
        if (functions.length === 0)
            return null;
        formControl.setValidators(Validators.compose(functions));
        formControl.updateValueAndValidity();

    }

    public getValidatorFn(validatorName: string, validatorArgs: any) {
        let validatorFn: ValidatorFn = null;
        if (Validators.hasOwnProperty(validatorName)) {
            validatorFn = (Validators as any)[validatorName];
            if (validatorArgs !== null) {
                validatorFn = (validatorFn as ValidatorFactory)(validatorArgs);
            }
            return validatorFn;
        }
    }

    getErrors$(formControl: FormControl, submitted$: Observable<any>) {
        const errors1$ = merge(of(null), formControl.valueChanges).pipe(
            map((value) => {
                return formControl.errors || {}
            }),
            map(
                (errors) => Object.keys(errors).map(error => ({ error }))
            ),
        );
        const touched$ = interval(1000).pipe(
            filter(c => formControl.touched),
            take(1),
            map(x => true)
        );

        return combineLatest(
            merge(of(null), submitted$),
            errors1$,
            merge(of(null), touched$),
            (submitted, errors, touched) => {
                const dirty = formControl.dirty;
                return { errors, submitted, dirty, touched }
            }
        ).pipe(
            filter(
                (data: any) => {
                    return data.submitted || data.dirty && data.touched;
                }
            ),
            map(
                (data: any) => data.errors
            )
        );
    }
}