import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UIRouterModule } from '@uirouter/angular';
import { UiRouterActiveDirective } from './directive';

@NgModule({
    entryComponents: [
    ],
    declarations: [
        UiRouterActiveDirective,
    ],
    imports: [
        UIRouterModule.forChild(),
        NgxsModule.forFeature([
        ]),
    ],
    providers: [
    ],
    exports: [
        UiRouterActiveDirective,
    ]
})
export class WdsRouterModule { }
