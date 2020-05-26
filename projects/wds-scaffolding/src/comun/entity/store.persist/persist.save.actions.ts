import { GenericFormSaveAction, GenericFormSaveActionCmd, GenericFormSavedAction, GenericFormSavedActionCmd, GenericFormSavedErrorAction, GenericFormSavedErrorActionCmd, GenericFormSavingAction, GenericFormSavingActionCmd } from '../store/generic.save.actions';
import { WdsStoreFormModeType } from './persist.model';


export interface ResourceFormSaveActionCmd extends GenericFormSaveActionCmd {
    resourceId: string
};

export class ResourceFormSaveAction extends GenericFormSaveAction {
    static readonly type = '[ResourceForm] Save';
    constructor(public readonly cmd: ResourceFormSaveActionCmd) {
        super(cmd);
        cmd.actions = {
            saving: ResourceFormSavingAction,
            saved: ResourceFormSavedAction,
            savedError: ResourceFormSavedErrorAction
        };
        cmd.storePathFn = (mode: WdsStoreFormModeType) => {
            return {
                data: `entity.${cmd.resourceId}.form.${mode}.data.form.model`,
                // saveStatus: `entity.${cmd.resourceId}.form.${mode}.loadStatus`,
                saveStatus:`entity.${cmd.resourceId}.form.${mode}.data.status`,
                resource: 'xxxxxxxx'
            };
        }
    };
};
/**********************  SAVING  ******************** */
export class ResourceFormSavingAction extends GenericFormSavingAction {
    static readonly type = '[ResourceForm] Saving';
    constructor(public readonly cmd: GenericFormSavingActionCmd) {
        super(cmd);
    };
};
/**********************  SAVED ******************** */
export class ResourceFormSavedAction extends GenericFormSavedAction {
    static readonly type = '[ResourceForm] Saved';
    constructor(public readonly cmd: GenericFormSavedActionCmd) {
        super(cmd);
    };
};
/******************  LOADED ERROR ******************** */
export class ResourceFormSavedErrorAction extends GenericFormSavedErrorAction {
    static readonly type = '[ResourceForm] Saved Error';
    constructor(public readonly cmd: GenericFormSavedErrorActionCmd) {
        super(cmd);
    };
};