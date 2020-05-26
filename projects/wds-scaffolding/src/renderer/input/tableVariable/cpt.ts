import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { WdsInputContainerModel } from '../../input.container/model';
import { WdsDesignerDataStuctureNodeModel } from '../../model';
import { utilsGetJsonByPath } from '../../utils';
import { schemeToFormGroup } from '../../fn.utils';


export enum WdsTableSelectableColumnType {
    inputContainer = "inputContainer",
    label = "label",
    searchable = "searchable",
    index = "index",
    button = "button"

}

export interface WdsSelectableTableColumnConfig {
    type: WdsTableSelectableColumnType,
    header: string,
    width: string,
    /************************************* */
    inputContainer?: WdsInputContainerModel,
    label?: {
        expression: string
    },
    searchable?: {
        path: string
    },
    button?: {
        icon: string
    }
    inputContainerId?: string
}

export interface WdsSelectableTableConfig {
    placeholder: string,
    label: string,
    schemaPath: string
    itemsStorePath: string
    columnSelectablePath: string,
    columns: WdsSelectableTableColumnConfig[]
}

@Component({
    selector: 'w-table-selectable',
    templateUrl: './cpt.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WdsTableSelectableRendererCpt {

    @Input()
    allInputContainers: WdsInputContainerModel[]

    @Input()
    formArray: FormArray;

    @Input()
    schema: WdsDesignerDataStuctureNodeModel[];

    @Input()
    config: WdsSelectableTableConfig;

    @Output() clickOnSufixBtn = new EventEmitter<any>();

    @Output() clickOnRowColumn = new EventEmitter<any>();


    clickSufixBtnx() {
        this.clickOnSufixBtn.emit('s');
    }

    selectedItems: string[] = [];
    items$: Observable<{ label: string, value: string }[]>
    items: { label: string, value: string }[] = [{ label: 'ss', value: 'dd' }];
    searchableColumn: any;

    constructor(
        private store: Store
    ) { }

    loadTable$ = of(false);
    ngOnInit(): void {
        this.loadTable$ = of(null).pipe(
            delay(10000)
        ).pipe(
            map(x => true)
        )

        this.searchableColumn = this.config.columns.find(column => column.searchable);

        this.config.columns
            .filter(column => column.type == WdsTableSelectableColumnType.inputContainer)
            .map(column => {
                column.inputContainer = this.allInputContainers.find(inputContainer => inputContainer.id == column.inputContainerId);
                return column;
            })

        if (!this.searchableColumn) {
            alert('No Hay Columna Searchable');
            throw 'No Hay Columna Searchable';
        }
        this.items$ = this.store.select(state => {
            return utilsGetJsonByPath(state, `${this.config.itemsStorePath}`)
        });
        this.items$.subscribe(items => {
            this.items = items;
        });
        this.formArray.valueChanges.pipe(
        ).subscribe(dataRows => {
            this.selectedItems = dataRows.filter(dataRow => {
                const data = utilsGetJsonByPath(dataRow, this.searchableColumn.searchable.path);
                return data;
            }).map(dataRow => {
                const data = utilsGetJsonByPath(dataRow, this.searchableColumn.searchable.path);
                return data.value;
            });
        })
    }


    // schemeToFormGroup(this.resourceFormConfig.schema.children, this.resourceForm)

    getNodeSchema(formArraySchemaPath: string): WdsDesignerDataStuctureNodeModel[] {
        let last = null;
        const paths: string[] = formArraySchemaPath.split('.').map(x => {
            last = x = last ? [last, x].join('.') : x;
            return x;
        });
        const a = paths.reduce(
            (t, e) => {
                const n = t.find(node => node.id == e)
                return n.children;
            }, this.schema)
        const node = a[Object.keys(a)[0]];
        return node.children;
    }

    addFormGroup(itemValue: string) {

        const item = this.items.find(item => item.value === itemValue);
        const newFormGroup = new FormGroup({});
        const schema = this.getNodeSchema(this.config.schemaPath);
        //TODO: en lugar de  schemeToFormGroup deberia ser instanceNode, pero se necesitaria los valores por defecto
        schemeToFormGroup(schema, newFormGroup);
        let data = {};
        data[this.searchableColumn.searchable.path] = item;
        newFormGroup.patchValue(data);
        this.formArray.push(newFormGroup);

    }


    onChange($event) {
        if ($event.itemValue) {
            const found = $event.value.find(x => x == $event.itemValue);
            if (found) {
                this.addFormGroup($event.itemValue);
            } else {
                const index = this.formArray.value.findIndex(fg => {
                    return fg[this.searchableColumn.searchable.path].value == $event.itemValue;
                });
                this.formArray.removeAt(index);
            }
        } else {
            if ($event.value.length > 0) {
                const newItems: any[] = $event.value.filter(x => {
                    const found = this.formArray.value.find(fg => {
                        return fg[this.searchableColumn.searchable.path].value == x;
                    })
                    return !found;
                });
                newItems.forEach(itemValue => {
                    this.addFormGroup(itemValue);
                })
            } else {
                this.formArray.clear();
            }
        }
    }

    remove(index: number) {
        this.formArray.removeAt(index);
    }


    onTaskDrop(event: CdkDragDrop<any>) {

        if (event.previousContainer === event.container) {

            // const formGroup = _.cloneDeep(
            //      this.formArray.controls[event.previousIndex]
            //      );

            const formGroup = this.formArray.controls[event.previousIndex]


            let items: any[] = this.formArray.value;
            // this.formArray.clear();
            debugger;
            const previous = items[event.previousIndex];
            items.splice(event.previousIndex, 1);
            items[event.currentIndex] = previous;
            // moveItemInArray(items, event.previousIndex, event.currentIndex);
            // setTimeout(()=>{
            items.forEach((item, index) => {
                this.formArray.at(index).patchValue(item);
            })
            // },1000)
            // // this.formArray.at[event.currentIndex]
            // alert('in');
            // debugger;
            // this.formArray.removeAt(event.previousIndex);
            // this.formArray.insert(event.currentIndex, formGroup)
        }
        // else {
        //   transferArrayItem(event.previousContainer.data,
        //     event.container.data,
        //     event.previousIndex,
        //     event.currentIndex);
        // }
    }


    clickOnRow(row, col) {
        this.clickOnRowColumn.emit({ row, col })
    }

}