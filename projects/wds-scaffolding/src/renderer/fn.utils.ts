import { WdsDesignerDataStuctureNodeModel } from './model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export function instanceNode(actualData: any, actualChildrenSchme: WdsDesignerDataStuctureNodeModel[], actualContainer: AbstractControl) {
    if (actualChildrenSchme.length > 0) {
        if (actualContainer instanceof FormArray) {
            const childScheme = actualChildrenSchme[0];
            (actualData || []).forEach(chilData => {
                let childAbstractControl: AbstractControl;
                if (childScheme.type == 'FormControl')
                    childAbstractControl = new FormControl();
                if (childScheme.type == 'FormGroup') {
                    console.error(childScheme.id);
                    childAbstractControl = new FormGroup({});

                } if (childScheme.type == 'FormArray') {
                    childAbstractControl = new FormArray([]);
                }
                instanceNode(chilData, childScheme.children, childAbstractControl);
                actualContainer.push(childAbstractControl);
            })
        }
        if (actualContainer instanceof FormGroup) {
            schemeToFormGroup(actualChildrenSchme, actualContainer)
            buscarNodeFormArray(actualData, actualChildrenSchme, <FormGroup>actualContainer);
        }
    }
}


export function schemeToFormGroup(childrenScheme: WdsDesignerDataStuctureNodeModel[], formGroup: FormGroup) {
    childrenScheme
        .filter(child => child.type === 'FormControl')
        .forEach(child => {
            formGroup.addControl(getNodeName(child.id), new FormControl(null))
        });
    childrenScheme.filter(child => child.type === 'FormArray')
        .forEach(child =>{
            formGroup.addControl(getNodeName(child.id), new FormArray([]))
        });

    childrenScheme.filter(child => child.type === 'FormGroup').forEach(child => {
        const formGroup2 = new FormGroup({});
        formGroup.addControl(getNodeName(child.id), formGroup2);
        //TRACE
        schemeToFormGroup(child.children, formGroup2)
        // child.children.forEach(grandChild => { schemeToFormGroup(grandChild.children, formGroup2) })
    });
}


export function buscarNodeFormArray(data: any, actualChildrenSchme: WdsDesignerDataStuctureNodeModel[], containerFormGroup: FormGroup) {
    actualChildrenSchme.forEach(
        (chilScheme: WdsDesignerDataStuctureNodeModel) => {
            if (chilScheme.type == 'FormArray') {
                const formArray = containerFormGroup.get(getNodeName(chilScheme.id)) as FormArray;
                const childData: any = data[getNodeName(chilScheme.id)];
                instanceNode(childData, chilScheme.children, formArray)
            }
            if (chilScheme.type == 'FormGroup') {
                const formGroup = containerFormGroup.get(getNodeName(chilScheme.id)) as FormGroup;
                const childData = data[getNodeName(chilScheme.id)];
                //TRACE: Aqui se esta modificando
                if (childData)
                    buscarNodeFormArray(childData, chilScheme.children, formGroup)
            }
        }
    )
}


export function getNodeName(value: string) {
    const parts: string[] = value.split('.')
    return parts[parts.length - 1];
}