import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { WdsRendererBooleanInputSwitchCpt } from './booleanInputSwitch/cpt';
// import { WdsRendererBooleanToggleButtonCpt } from './booleanToggleButton/cpt';
// import { WdsRendererDateCalendarCpt } from './dateCalendar/cpt';
// import { WdsRendererNumberInputCpt } from './numberInput/cpt';
// import { WdsRendererNumberSpinnerCpt } from './numberSpinner/cpt';
import { WdsRendererStringInputCpt } from './stringInput/cpt';
import { WdsRendererStringPasswordCpt } from './stringPassword/cpt';
import { WdsRendererInputConfig } from './model';
import { WdsRendererDropdownCpt } from './Dropdown/cpt';

const components = {
    stringInput: WdsRendererStringInputCpt,
    stringPassword: WdsRendererStringPasswordCpt,
    // numberInput: WdsRendererNumberInputCpt,
    // numberSpinner: WdsRendererNumberSpinnerCpt,
    booleanInputSwitch: WdsRendererBooleanInputSwitchCpt,
    // booleanToggleButton: WdsRendererBooleanToggleButtonCpt,
    // dateCalendar: WdsRendererDateCalendarCpt,
    Dropdown: WdsRendererDropdownCpt
};
export interface DynamicFormControl {
    formGroup?: FormGroup;
    formArray?: FormArray;
    inputConfig: WdsRendererInputConfig<any>;
}

@Directive({
    selector: 'wds-renderer-input'
})
export class WdsRendererInputDynamicDirective implements OnInit, OnDestroy {

    @Input()
    inputConfig: WdsRendererInputConfig<any>;

    @Input()
    formGroup: FormGroup;

    protected componentRef: ComponentRef<DynamicFormControl>;
    protected componentSubscriptions: Subscription[] = [];

    constructor(
        private store: Store,
        private resolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {
    }

    public ngOnInit() {
        if (!this.inputConfig) {
            // alert('No existe propiedad en el archivo .json')
            return;
        }
        const dataType: string = this.inputConfig.dataType;
        const inputType: string = this.inputConfig.inputType;
        const keyType = `${dataType}${inputType.replace(/^./, inputType[0].toUpperCase())}`;
        const dinamycComponent = components[keyType]

        if (!dinamycComponent) {
            const supportedTypes = Object.keys(components).join(', ');
            console.error(`You tried to use an unsupported type (${keyType}). Supported types: ${supportedTypes}`);
        } else {
            const factory = this.resolver.resolveComponentFactory(dinamycComponent);
            this.componentRef = this.viewContainerRef.createComponent(factory) as ComponentRef<DynamicFormControl>;
            const instance = this.componentRef.instance;
            instance.formGroup = this.formGroup;
            instance.inputConfig = this.inputConfig;
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentSubscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
            this.componentSubscriptions = [];
            this.componentRef.destroy();
        }

    }
}