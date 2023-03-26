import {
    APP_SETTINGS_SET,
    APP_SETTINGS_GET,
    FILE_GET_LINK,
    FOLDER_GET_CHILDREN,
    STORAGE_GET,
    STORAGE_GET_CHILDREN,
    STORAGE_GET_LIST,
    FILE_ADD_TO_CURRENT,
    MAIN_ADD_FOLDER,
    MAIN_ITEM_RENAME,
    USER_SETTINGS_GET,
    MAIN_REMOVE_SELECTED, MAIN_SET_SELECTED, MOUSE_DOWN, MOUSE_UP
} from './types';
import {createBitrixRequest} from '../functions/mainFunc';
import {appSettingsOptionsName, bxMethods, IFolder, IStorage} from '../models/models';

/**
 * MAIN ACTIONS
 * */

export const addFolderToActiveItem = (storageId: string, type: string, newName: string) => async (dispatch: any) => {
    let storageType = type;
    let actionType = 'addsubfolder';
    if (storageType === 'disk') {
        storageType = 'storage';
        actionType = 'addFolder'
    }

    // @ts-ignore
    const result = await createBitrixRequest(bxMethods[storageType][actionType],  {
        id: storageId,
        data: {'NAME': `${newName}`}
    },);

    dispatch(
        {
            type: MAIN_ADD_FOLDER,
            payload: result,
        }
    )
}

export const renameItem = (id: string, type: string, newName: string) => async (dispatch: any) => {
    let storageType = type;
    if (storageType === 'disk') {
        storageType = 'storage';
    }

    // @ts-ignore
    await createBitrixRequest(bxMethods[storageType].rename, {id: id, newName: newName});

    dispatch(
        {
            type: MAIN_ITEM_RENAME,
            payload: {ID: id, NAME: newName},
        }
    )
}

export const setSelectedItems = (items: any[]) => (dispatch: any) => {
    dispatch(
        {
            type: MAIN_SET_SELECTED,
            payload: items,
        }
    )
}


export const removeSelectedItems = (item: any[]) => (dispatch: any) => {
    dispatch(
        {
            type: MAIN_REMOVE_SELECTED,
            payload: item,
        }
    )
}

/**
 * STORAGE ACTIONS
 * */

export const getStorageList = () => {
    return async (dispatch: any) => {
        const result = await createBitrixRequest(bxMethods.storage.getList);

        dispatch({type: STORAGE_GET_LIST, payload: result})
    }
};

export const getStorage = (id: string) => {
    return async (dispatch: any) => {
        const result = await createBitrixRequest(bxMethods.storage.get, {id: id});

        dispatch({type: STORAGE_GET, payload: result})
    }
};

export const getStorageChildren = (item: IStorage) => {
    return async (dispatch: any) => {
        const result = await createBitrixRequest(bxMethods.storage.getChildren, {id: item.ID});

        dispatch(
            {
                type: STORAGE_GET_CHILDREN,
                payload: {
                    result,
                    storage: {item: item, type: 'storage'},
                }
            }
        )
    }
};




/**
 * FOLDER ACTIONS
 * */

export const getFolderChildren = (item: IFolder) => {
    return async (dispatch: any) => {
        const result = await createBitrixRequest(bxMethods.folder.getChildren, {id: item.ID});

        dispatch(
            {
                type: FOLDER_GET_CHILDREN,
                payload: {
                    result,
                    storage: {item: item, type: 'folder'}
                }
            }
        )
    }
};


/**
 * FILE ACTIONS
 * */

export const getFileLink = (item: any) => async (dispatch: any) => {
    const link = await createBitrixRequest(bxMethods.file.getExternalLink, {id: item.ID});

    dispatch(
        {
            type: FILE_GET_LINK,
            payload: { item, link }
        }
    )
}


export const addFileToActiveItem = (newItem: any, currentFiles: any[]) => async (dispatch: any) => {
    let files = currentFiles;
    const isAdded = !!files.find((item: any) => item.ID === newItem?.ID);

    if (!isAdded) files.push(newItem);

    dispatch(
        {
            type: FILE_ADD_TO_CURRENT,
            payload: files,
        }
    )
}
/**
 * APP SETTINGS ACTIONS
 * */

export const getAppSettings = () => async (dispatch: any) => {
    const settings = await createBitrixRequest(bxMethods.appSettings.appGet, {option: appSettingsOptionsName});

    dispatch(
        {
            type: APP_SETTINGS_GET,
            payload: settings ?? null,
        }
    )
}


export const getUserSettings = () => async (dispatch: any) => {
    const settings = await createBitrixRequest(bxMethods.userSettings.userGet, {option: appSettingsOptionsName});

    dispatch(
        {
            type: USER_SETTINGS_GET,
            payload: settings ?? [],
        }
    )
}


export const getTemproryFolderSettings = () => async (dispatch: any) => {
    const settings = await createBitrixRequest(bxMethods.appSettings.appGet, {option: appSettingsOptionsName});

    dispatch(
        {
            type: APP_SETTINGS_GET,
            payload: settings ?? null,
        }
    )
}


/**
 * EVENTS ACTIONS
 * */

export const setMouseDown = (e: any) => async (dispatch: any) => {
    dispatch(
        {
            type: MOUSE_DOWN,
            payload: e.buttons,
        }
    )
}

export const setMouseUp = (e: any) => async (dispatch: any) => {
    dispatch(
        {
            type: MOUSE_UP,
            payload: false,
        }
    )
}