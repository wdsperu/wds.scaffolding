import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { WdsRendererInputConfig, WdsRendererStringInputConfig } from '../model';

@Component({
    selector: 'wds-renderer-StringInput',
    templateUrl: './cpt.html',
    styles: [`
    ::ng-deep .ui-message{
        z-index:1000
    }
    `]
})
export class WdsRendererStringInputCpt implements OnInit {

    @Input()
    inputConfig: WdsRendererInputConfig<WdsRendererStringInputConfig>;

    ngOnInit() {

        this.inputConfig.config.placeholder = this.inputConfig.config.placeholder || ''

    }
}