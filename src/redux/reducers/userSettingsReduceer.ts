import {
    USER_SETTINGS_GET,
} from '../types';
import {TemplateInterface} from '../../models/models';


export interface ReducerInterface {
    // templates: TemplateInterface[],
    bookmarks: TemplateInterface[],
}

const initialState: ReducerInterface = {
    // templates: [],
    bookmarks: [],
}

export const userSettingsReducer = (state = initialState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case USER_SETTINGS_GET:
            console.log(action.payload?.bookmarks);
            const bookmarks = action.payload && action.payload?.bookmarks?.length  ? [...action.payload?.bookmarks] : [];

            return {...state, bookmarks}

        default: return state
    }

    return state;
};