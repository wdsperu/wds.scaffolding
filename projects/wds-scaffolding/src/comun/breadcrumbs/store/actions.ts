export class LimpiarBreadcrumb {
    static readonly type = '[Breadcrumb] Limpiar';
}
export class AgregarBreadcrumb {
    static readonly type = '[Breadcrumb] Agregar';
    constructor(public readonly payload: any) { }
}
export class EliminarBreadcrumb {
    static readonly type = '[Breadcrumb] Eliminar';
    constructor(public readonly payload: any) { }
}
export class EditarBreadcrumb {
    static readonly type = '[Breadcrumb] Editar';
    constructor(public readonly payload: any) { }
}
