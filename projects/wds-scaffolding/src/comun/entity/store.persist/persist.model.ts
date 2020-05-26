export interface WdsStoreFormNgxs {
    model: {
        id?: any,
        [key: string]: any
    };
    dirty?: false;
    status?: string;
    errors?: any;
}

export enum WdsStoreFormModeType {
    create = 'create', update = 'update'
}

export enum WdsStoreLoadStatusType {
    OK = 'OK', ERROR = 'ERROR'
}
export enum WdsStoreSaveStatusType {
    OK = 'OK', ERROR = 'ERROR'
}
export interface WdsStoreLoadStatus {
    loading: boolean,
    loaded: WdsStoreLoadStatusType,
    error?: any
}
export interface WdsStoreSaveStatus {
    saving: boolean,
    saved: WdsStoreSaveStatusType,
    error?: any
}
export interface WdsStorePersistData extends WdsStoreData {
    data: {
        form: WdsStoreFormNgxs,
        status: WdsStoreSaveStatus
    }
}
export interface WdsStoreData {
    data: any,
    status: WdsStoreLoadStatus,
    others: any
}

interface WdsStoreFilterFormNgxs extends WdsStoreFormNgxs {
    advancedSearchIsOpen: boolean
}

export interface WdsStorePersistSearchData extends WdsStoreData {
    filter: WdsStoreFilterFormNgxs,
    data: {
        result: any,
        params: {
            data: any,
            loaded: boolean
        },
    }
}


export interface PersistStateModel {
    tabs: string[],
    entity: {
        [key: string]: {
            actions: WdsStorePersistData,
            form: {
                create: WdsStorePersistData,
                update: WdsStorePersistData
            },
            search: WdsStorePersistSearchData
        }
    }
}