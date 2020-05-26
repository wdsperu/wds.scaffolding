import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Transition, UIRouter } from '@uirouter/core';
import { Observable } from 'rxjs';
import { AgregarBreadcrumb } from './store/actions';
import { BreadcrumbState } from './store/store';


declare module "@uirouter/core/lib/state/stateObject" {
    interface StateObject {
        breadcrumb?: (trans: Transition) => string;
    }
}
declare module "@uirouter/core/lib/state/interface" {
    interface StateDeclaration {
        breadcrumb?: (trans: Transition) => string;
    }
}
interface Crumb {
    state: string;
    text: string;
}
@Component({
    selector: 'wds-app-breadcrumbs',
    templateUrl: './cpt.html',
    styles: [`
    .breadcrumbs { list-style: none; }
    ul li { display: inline; }
    li + li:before { content: '/'; padding: 1em; }
  `]
})
export class BreadcrumbsCpt implements OnInit, OnDestroy {
    private unsub: any;
    private crumbs: Crumb[] = [];

    @Select(BreadcrumbState.getCrumbs)
    crumbs$: Observable<any>;

    ngOnInit() {
    }
    constructor(
        public router: UIRouter,
        private store: Store
    ) {
        const allPath: Array<any> = router.stateService.get();
        this.updateCrumbs(router.globals.successfulTransitions.peekTail())
        this.unsub = router.transitionService
            .onSuccess({}, trans => {
                // this.store.dispatch(new fromBreadcrumbActions.LimpiarBreadcrumb());
                return this.updateCrumbs(trans);
            });
    }

    private updateCrumbs(trans: Transition) {
        this.crumbs = trans.treeChanges('to')
            .map(node => {
                return {
                    state: node.state.name,
                    text: node.state.breadcrumb ? node.state.breadcrumb(trans) : node.state.name
                }
            });
        this.store.dispatch(new AgregarBreadcrumb(this.crumbs));
    }
    ngOnDestroy() {
        this.unsub();
    }
}
