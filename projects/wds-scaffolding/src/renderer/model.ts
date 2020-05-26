

export enum WdsDesignerDataStuctureNodeType {
    FormControl = 'FormControl',
    FormGroup = 'FormGroup',
    FormArray = 'FormArray',
}

export interface WdsDesignerDataStuctureModel {
    [key: string]: WdsDesignerDataStuctureNodeModel
}

export class WdsDesignerDataStuctureNodeModel {
    id: string;
    type: WdsDesignerDataStuctureNodeType;
    children: WdsDesignerDataStuctureNodeModel[];

    saved?: WdsDesignerDataStuctureNodeModel[]
}