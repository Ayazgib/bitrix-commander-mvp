export const appSettingsOptionsName = 'BxComanderSettings';
export const firstPageItem = {ID: 0, TYPE: 'firstPage'};
export const returnedTypeInCloneFunc = {
    count: 'count',
    boolean: 'boolean',
    array: 'array',
}

export const mainKeysInHotKey = {
    copy: 'KeyQ',
    bookmarks: 'KeyX',
    arrowUp: 'ArrowUp',
    arrowDown: 'ArrowDown',
    shiftLeftKey: 'ShiftLeft',
    shiftRightKey: 'ShiftRight',
};

export const hotKeys = {
    copy: [
        [ 'ControlRight', mainKeysInHotKey.copy ],
        [ 'ControlLeft', mainKeysInHotKey.copy ]
    ],
    bookmarks: [
        [ 'ControlLeft', mainKeysInHotKey.bookmarks ],
        [ 'ControlRight', mainKeysInHotKey.bookmarks ]
    ]
}

export const bxMethods = {
    storage: {
        getList: 'disk.storage.getlist', // have action
        getFields: 'disk.storage.getfields',
        get: 'disk.storage.get', // have action
        rename: 'disk.storage.rename', // have main action
        addFolder: 'disk.storage.addfolder', // have main action
        getChildren: 'disk.storage.getchildren', // have action
        uploadFile: 'disk.storage.uploadfile',
    },
    folder: {
        get: 'disk.folder.get',
        getChildren: 'disk.folder.getchildren',
        addsubfolder: 'disk.folder.addsubfolder', // have main action
        copyto: 'disk.folder.copyto', // {id: 10, targetFolderId: 226},
        moveto: 'disk.folder.moveto',
        rename: 'disk.folder.rename', // have main action
        deletetree: 'disk.folder.deletetree',
        markdeleted: 'disk.folder.markdeleted',
        restore: 'disk.folder.restore',
        uploadfile: 'disk.folder.uploadfile',
        getExternalLink: 'disk.folder.getExternalLink',
        getFields: 'disk.folder.getFields'
    },
    file: {
        get: 'disk.file.get', // have action
        copyto: 'disk.file.copyto',
        moveto: 'disk.file.moveto',
        rename: 'disk.file.rename', // have main action
        delete: 'disk.file.delete',
        markdeleted: 'disk.file.markdeleted',
        restore: 'disk.file.restore',
        getVersions: 'disk.file.getVersions',
        restoreFromVersion: 'disk.file.restoreFromVersion',
        uploadversion: 'disk.file.uploadversion',
        getExternalLink: 'disk.file.getExternalLink', // have action
    },
    appSettings: {
        appGet: 'app.option.get',
        appSet: 'app.option.set',
    },
    userSettings: {
        userGet: 'user.option.get',
        userSet: 'user.option.set',
    }
}

export interface IMain {
    ID: string,
    NAME: string,
    CODE: null | string,
}

export interface IStorage extends IMain {
    ENTITY_ID?: string,
    ENTITY_TYPE?: string,
    MODULE_ID?: string,
    ROOT_OBJECT_ID?: string,
}

export interface IFolder extends IMain {
    CREATED_BY: string,
    CREATE_TIME: string,
    DELETED_BY: string,
    DELETED_TYPE: string,
    DELETE_TIME: string,
    DETAIL_URL: string,
    PARENT_ID: string,
    REAL_OBJECT_ID: string,
    STORAGE_ID: string,
    TYPE: string,
    UPDATE_TIME: string,
    UPDATED_BY: string,
}

export interface TemplateInterface {
    id: string,
}

export interface AppSettingsInterface {
    templates: TemplateInterface[],
}
