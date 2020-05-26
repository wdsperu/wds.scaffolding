import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ActionTemplateCpt } from './entity/action/cpt';
import { FormTemplateCpt } from './entity/form/cpt';
import { SearchTemplateCpt } from './entity/search/cpt';
import { PersistState } from './entity/store.persist/persist.store';
import { WdsGenericStoreService } from './entity/store.persist/service';
import { GenericFormSaveService } from './entity/store/generic.save.service';
import { ResourceState } from './entity/store/store';
import { WdsRouterModule } from './wds.router/module';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormCpt } from './entity/form/new.cpt.parent';
import { ToastModule } from 'primeng/toast';
import { SearchCpt } from './entity/search/new.cpt.parent';
import { PaginatorModule } from 'primeng/paginator';
import { ActionsCpt } from './entity/action/new.cpt.parent';
import { WdsTemplateDirective } from './entity/w.template.directive';



@NgModule({
    entryComponents: [
    ],
    declarations: [
        FormCpt,
        SearchCpt,
        ActionsCpt,
        ActionTemplateCpt,
        FormTemplateCpt,
        SearchTemplateCpt,
        WdsTemplateDirective
    ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            // BreadcrumbState,
            PersistState,
            ResourceState
            // ParamsState,
        ]),
        WdsRouterModule,
        NgxsFormPluginModule,
        ReactiveFormsModule,
        FormsModule,


        PanelModule,

        ButtonModule,
        FlexLayoutModule,
        InputTextModule,

        BlockUIModule,
        DialogModule,
        ProgressSpinnerModule,
        MultiSelectModule,
        ToastModule,
        PaginatorModule

    ],
    providers: [
        WdsGenericStoreService,
        GenericFormSaveService
    ],
    exports: [
        ActionTemplateCpt,
        FormTemplateCpt,
        SearchTemplateCpt,
        /*********** */
        WdsTemplateDirective,
        FormCpt,
        SearchCpt,
        ActionsCpt
    ]
})
export class ComunModule { }
