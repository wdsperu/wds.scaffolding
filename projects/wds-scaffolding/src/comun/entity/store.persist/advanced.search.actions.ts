

export class ResourceAdvencedSearchOpenAction {
    constructor(public readonly cmd: { resourceId: string }) {
    }
    static readonly type = '[Resource Advenced Search] Open';
};

export class ResourceAdvencedSearchCloseAction {
    constructor(public readonly cmd: { resourceId: string }) {
    }
    static readonly type = '[Resource Advenced Search] Close';
};

export class ResourceAdvencedSearchToogleAction {
    constructor(public readonly cmd: { resourceId: string }) {
    }
    static readonly type = '[Resource Advenced Search] Toogle';
};
