import { Component, OnInit, Input, ElementRef, Renderer2 } from "@angular/core";
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Actions } from '@ngxs/store';

@Component({
    selector: 'wds-form',
    templateUrl: './cpt.html'
})
export class FormTemplateCpt implements OnInit {

    @Input()
    pCol: string;

    @Input()
    loadStatus$: Observable<any>;

    @Input()
    saveStatus$: Observable<any>;


    display = false;


    constructor(
        private el: ElementRef,
        private render2: Renderer2,
        private actions$: Actions
    ) {
    }

    ngOnInit() {
        this.saveStatus$.pipe(
            filter(saveStatus => {
                return !saveStatus.saving && saveStatus.saved == 'ERROR'
            })
        ).subscribe(x => {
            //TODO:->>>>>>>>>><<
            // alert('error XDD')

        })


        // this.actions$.pipe(
        //     filter(a => a.action.constructor.name == 'ResourceFormSavedErrorAction' && a.status == 'SUCCESSFUL')
        // ).subscribe(a => {
        //     alert('eeeeeeeeeee');
        //     debugger;
        // })


    }
}