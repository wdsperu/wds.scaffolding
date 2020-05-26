import { Component, Input } from "@angular/core";
import { Observable } from 'rxjs';

@Component({
    selector: 'wds-search',
    templateUrl: './cpt.html'
})
export class SearchTemplateCpt  {

    @Input()
    loadStatus$: Observable<any>;

}