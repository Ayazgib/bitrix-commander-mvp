import {combineReducers} from 'redux';
import {storageReducer} from './storageReduceer';
import {appSettingsReducer} from './appSettingsReduceer';
import {userSettingsReducer} from './userSettingsReduceer';
import {eventsReducer} from './eventsReducer';

export const rootReducer = combineReducers(
    {
        storage: storageReducer,
        appSettings: appSettingsReducer,
        userSettings: userSettingsReducer,
        events: eventsReducer,
    }
)
