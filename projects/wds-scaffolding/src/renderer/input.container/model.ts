import { WdsRendererInputConfig } from '../input/model';

export enum WdsInputContainerPrefixType {
    label = 'label',
    icon = 'icon'
}
export interface WdsInputContainerPrefixSufixModel {
    has: boolean,
    width?: string,
    elements: {
        width?: string,
        type: WdsInputContainerPrefixType,
        text: string,
        icon: string
    }[]
};
export interface WdsInputContainerModel {
    id: string;
    label: {
        has: boolean,
        text: string
    }
    input: {
        width?: string,
        elements: {
            width?: string,
            inputId: string
            inputConfig: WdsRendererInputConfig<any>
        }[]
    };
    prefix: WdsInputContainerPrefixSufixModel;
    sufix: WdsInputContainerPrefixSufixModel
}
export interface WdsInputContainerFormModel {
    selected: string,
    containers: WdsInputContainerModel[]
}