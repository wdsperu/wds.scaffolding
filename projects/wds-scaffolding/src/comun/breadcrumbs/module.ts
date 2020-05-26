import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbsCpt } from './cpt';

@NgModule({
    entryComponents: [

    ],
    declarations: [
        BreadcrumbsCpt
    ],
    imports: [
        UIRouterModule.forChild(),
        PanelModule
    ],
    providers: [
    ],
    exports: [
        BreadcrumbsCpt
    ]
})
export class BreadCrumbModule { }
