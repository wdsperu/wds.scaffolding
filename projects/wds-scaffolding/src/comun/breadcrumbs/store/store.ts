import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AgregarBreadcrumb, EditarBreadcrumb, LimpiarBreadcrumb } from './actions';
import { Injectable } from '@angular/core';

export interface BreadcrumbStateModel {
  crumbs: any[]
}
@State<BreadcrumbStateModel>({
  name: 'crumbs',
  defaults: {
    crumbs: []
  }
})
@Injectable()
export class BreadcrumbState {

  @Action(LimpiarBreadcrumb)
  limpiarBreadcrumb({ getState, patchState }: StateContext<BreadcrumbStateModel>) {
    patchState({
      crumbs: []
    });
  }

  @Action(AgregarBreadcrumb)
  agregarBreadcrumb({ patchState }: StateContext<BreadcrumbStateModel>, { payload }: AgregarBreadcrumb) {
    patchState({
      crumbs: payload
    })
  }

  @Action(EditarBreadcrumb)
  editarBreadcrumb() {
    alert('falta Implementar')
  }

  @Selector()
  static get(state: BreadcrumbStateModel) {
    return state;
  }

  @Selector()
  static getCrumbs(state: BreadcrumbStateModel) {
    return state.crumbs;
  }

}