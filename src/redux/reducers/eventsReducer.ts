import {
    APP_SETTINGS_GET, APP_SETTINGS_SET, MOUSE_DOWN, MOUSE_UP,
} from '../types';
import {TemplateInterface} from '../../models/models';


export interface ReducerInterface {
    mouseDown: boolean | null,
}

const initialState: ReducerInterface = {
    mouseDown: null,
}

export const eventsReducer = (state = initialState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case MOUSE_DOWN :
            return {mouseDown: action.payload};

        case MOUSE_UP :
            return {mouseDown: null};

        default: return state
    }

    return state;
};