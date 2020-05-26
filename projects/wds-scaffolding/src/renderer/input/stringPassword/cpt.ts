import { Component, Input, OnInit } from '@angular/core';
import { WdsRendererInputConfig, WdsRendererStringPasswordConfig } from '../model';

@Component({
    selector: 'wds-renderer-StringPassword',
    templateUrl: './cpt.html'
})
export class WdsRendererStringPasswordCpt implements OnInit {

    @Input()
    inputConfig: WdsRendererInputConfig<WdsRendererStringPasswordConfig>;

    ngOnInit() {
    }
}