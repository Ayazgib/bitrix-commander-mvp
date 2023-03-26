import {
    APP_SETTINGS_GET, APP_SETTINGS_SET,
} from '../types';
import {TemplateInterface} from '../../models/models';


export interface ReducerInterface {
    settings: any,
    temporaryFolderId: number | null,
}

const initialState: ReducerInterface = {
    settings: null,
    temporaryFolderId: 81, // TODO get from settings
}

export const appSettingsReducer = (state = initialState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case APP_SETTINGS_GET :
            return {settings: {...action.payload}};

        default: return state
    }

    return state;
};