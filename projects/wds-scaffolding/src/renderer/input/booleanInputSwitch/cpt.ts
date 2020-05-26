import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WdsRendererStringPasswordCpt } from '../stringPassword/cpt';
import { WdsRendererInputConfig } from '../model';
import { Store } from '@ngxs/store';

@Component({
    selector: 'wds-renderer-BooleanInputSwitch',
    templateUrl: './cpt.html',
    styles: [`
        ::ng-deep .ui-inputswitch {
            width: 50px !important;
          }
    
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WdsRendererBooleanInputSwitchCpt implements OnInit {

    @Input()
    inputConfig: WdsRendererInputConfig<WdsRendererStringPasswordCpt>;


    ngOnInit() {

    }
}