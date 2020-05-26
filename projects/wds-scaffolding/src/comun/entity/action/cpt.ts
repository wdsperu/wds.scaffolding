import { Component, Input, OnInit } from "@angular/core";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BreadcrumbState } from '../breadcrumbs/store/store';

@Component({
    selector: 'wds-action',
    templateUrl: './cpt.html'
})
export class ActionTemplateCpt implements OnInit {

    @Input()
    resourceId: string;

    @Input()
    key: string;

    loadStatus$: Observable<any>;

    toogleFilters$: Observable<Boolean>;

    @Select(BreadcrumbState.getCrumbs)
    crumbs$: Observable<any>;

    constructor(
        private store: Store,
    ) {
    }

    ngOnInit() {
        // this.toogleFilters$ = this.store
        //     .select(state => state.entity[this.key].actions.toogleFilters)
    }
}