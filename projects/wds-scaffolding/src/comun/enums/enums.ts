export enum StateLoadType {
    Synchronous = 'Synchronous',
    Asynchronous = 'Asynchronous'
}
export enum FormMode {
    WRITE,
    READ
}

export class WdsError {
    constructor(
        public cause: string,
        public message: string,
        public code: string
    ) { }
}

export enum EnumLoadedType {
    OK,
    ERROR
}

export enum EnumPathType {
    // form = 'form',
    // info = 'info',
    // search = 'search',
    // actions = 'actions'

    form,
    info,
    search,
    actions
}