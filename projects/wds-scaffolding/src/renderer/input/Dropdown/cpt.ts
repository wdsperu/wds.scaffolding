import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WdsRendererDropDownConfig, WdsRendererDropDownType, WdsRendererInputConfig } from '../model';
import { utilsGetJsonByPath } from '../../utils';


@Component({
    selector: 'wds-renderer-Dropdown',
    templateUrl: './cpt.html'
})
export class WdsRendererDropdownCpt implements OnInit {

    items$: Observable<any[]>;

    @Input()
    inputConfig: WdsRendererInputConfig<WdsRendererDropDownConfig>;

    constructor(protected store: Store
    ) {
    }
    ngOnInit() {
        if (this.inputConfig.config.type == WdsRendererDropDownType.fixed)
            this.items$ = of([{ label: null, value: null }, ...this.inputConfig.config.fixed]);
        else {
            const path: string = this.inputConfig.id.replace('.', '_')
            this.items$ = this.store
                .select(state => {
                    return utilsGetJsonByPath(state, `${this.inputConfig.formPath}.others.${path}`);
                })
                .pipe(
                    filter(t => t),
                    map(
                        t => {
                            return [{ label: '', value: '' }, ...t]
                        }
                    )
                );
        }
    }
}