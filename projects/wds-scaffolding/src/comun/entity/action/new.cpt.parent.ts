import { Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions, Store } from '@ngxs/store';
import { StateService } from '@uirouter/core';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionsConfigCpt } from '../form/model';
import { WdsTemplateDirective } from '../w.template.directive';

@Component({
    selector: 'w-actions',
    templateUrl: './cpt.parent.html',
    providers: [MessageService]
})
export class ActionsCpt {

    @Input()
    actionsConfig: ActionsConfigCpt;

    advancedSearchIsOpen$: Observable<Boolean> = of(false);

    filterForm: FormGroup;

    loadStatus$: Observable<Boolean>

    filterStorePath: string;

    entity$: Observable<any>;

    @ContentChildren(WdsTemplateDirective) templates: QueryList<WdsTemplateDirective>;

    actionsTemplate:TemplateRef<any>

    constructor(
        protected store: Store,
        protected stateService: StateService,
        protected messageService: MessageService,
        protected actions$: Actions
    ) { }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'actions':
                    this.actionsTemplate = item.template;
                    break;
            }
        });
    }



    ngOnInitParent() {
        this.actions$.pipe(
            filter(a => a.action.constructor.name == 'ResourceFormSavedAction' && a.status == 'SUCCESSFUL')
        ).subscribe(a => {
            // alert('Guardado Satisfactoriamente')
            // this.messageService.add({ severity: 'success', summary: 'Formulario', detail: 'Guardado Satisfactoriamente' });
        });


        this.filterForm = new FormGroup({});
        this.filterStorePath = `persist.entity.${this.actionsConfig.resourceConfig.id}.actions.data.form`;

        this.advancedSearchIsOpen$ = this.store.select(state => {
            return state.persist.entity[this.actionsConfig.resourceConfig.id].search.filter.advancedSearchIsOpen;
        })
    }
    search() {
        this.stateService.go(this.actionsConfig.resourceConfig.search, this.filterForm.value, { reload: true });
    }

} 