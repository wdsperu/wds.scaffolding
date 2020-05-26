import { Directive, Input, Renderer2, ElementRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreadcrumbState } from '../entity/breadcrumbs/store/store';

@Directive({
    selector: '[wUiRouterActive]',
})
export class UiRouterActiveDirective {

    @Select(BreadcrumbState.getCrumbs)
    crumbs$: Observable<any>;


    @Input("wUiRouterActive") config: { state: string, styleClass: string };

    constructor(
        private renderer: Renderer2,
        private el: ElementRef
    ) {
    }

    ngOnInit(): void {
            this.crumbs$.pipe(
            map(
                (crumbs: any[]) => {
                    return !!crumbs.find(crumb => crumb.state === this.config.state);
                })
        ).subscribe(
            (found: boolean) => {
                if (found) {
                    this.renderer.addClass(this.el.nativeElement, this.config.styleClass);
                } else {
                    this.renderer.removeClass(this.el.nativeElement, this.config.styleClass);
                }
            }
        );

    }
}




