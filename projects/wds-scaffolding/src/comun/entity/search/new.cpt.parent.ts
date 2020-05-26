import { Input, ViewChild, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { StateService } from '@uirouter/angular';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { filter, flatMap, debounceTime } from 'rxjs/operators';
import { WdsStoreLoadStatusType } from '../store.persist/persist.model';
import { SearchConfigCpt } from '../form/model';
import { WdsTemplateDirective } from '../w.template.directive';

@Component({
    selector: 'w-search',
    templateUrl: './cpt.parent.html'
})
export class SearchCpt {

    @Input()
    searchConfig: SearchConfigCpt;

    @ContentChildren(WdsTemplateDirective) templates: QueryList<WdsTemplateDirective>;

    tableTemplate: TemplateRef<any>

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'table':
                    this.tableTemplate = item.template;
                    break;
            }
        });
    }


    // @Input()
    // resourceSearchConfig: any;
    // @Input()
    // storePaths: {
    //     data: string,
    //     loadStatus: string,
    //     others: string,
    //     resource: string
    // }

    // @Input()
    // resourceConfig: ResourceConfig;


    @ViewChild(Table, { static: false })
    table: Table;


    limit: number;
    offset: number;

    loadStatus$: Observable<any>;
    result$: Observable<any>;

    constructor(
        protected stateService: StateService,
        protected store: Store,
    ) { }

    ngOnInit() {

        this.store.select(state => {
            return state.persist.entity[this.searchConfig.resourceConfig.id].search.filter.model.filter
        }).pipe(
            debounceTime(600)
        ).subscribe(x => {
            // if (this.table)
            // this.table.filterGlobal(x, 'contains')
        });
        this.loadStatus$ = this.store.select(state => {
            return this.getJsonByPath({ ...state }, `${this.searchConfig.storePaths['loadStatus2']}`)
        });
        this.result$ = this.loadStatus$.pipe(
            filter((loadStatus: any) => {
                return loadStatus.loaded == WdsStoreLoadStatusType.OK;
            }),
            flatMap(loadedOk => this.store.select(state => {
                return this.getJsonByPath({ ...state }, `${this.searchConfig.storePaths['data2']}.result`)
            }))
        );
        const params = this.stateService.params;
        this.limit = params.size ? params.size : 10;
        const page = params.page ? params.page - 1 : 0;
        this.offset = page * this.limit;
    }
    paginate(event) {
        this.stateService.go(
            this.searchConfig.resourceConfig.search,
            {
                ...this.stateService.params,
                limit: this.limit,
                page: event.page + 1
            }
        );
    }
    getJsonByPath(data: any, path: string) {
        return path.split('.').reduce((t, e) => {
            t = t[e];
            return t;
        }, data)
    }   
    goToEdit(data: any) {
        let params = {};
        params[this.searchConfig.resourceConfig.paramIdName] = data.id;
        this.stateService.go(this.searchConfig.resourceConfig.form, params)
    }
    goToInfo(data: any) {
        let params = {};
        params[this.searchConfig.resourceConfig.paramIdName] = data.id;
        this.stateService.go(this.searchConfig.resourceConfig.info, params)
    }
}