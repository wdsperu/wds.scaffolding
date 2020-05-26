export class CreateResource {
    static readonly type = '[Resource] Create';
    constructor(public readonly cmd: {
        resourceId: string,
        action: string
    }) { }
}
export class SelectResource {
    static readonly type = '[Resource] Select';
    constructor(public readonly cmd: {
        resourceId: string
    }) { }
}
export class UnSelectResource {
    static readonly type = '[Resource] UnSelect';
    constructor(public readonly cmd: {
        resourceId: string
    }) { }
}
export class ClearResource {
    static readonly type = '[Resource] UnSelect';
    constructor(public readonly cmd: {
        resourceId: string
    }) { }
}