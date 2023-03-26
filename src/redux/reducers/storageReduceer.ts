import {
    FILE_ADD_TO_CURRENT,
    FILE_GET_LINK,
    FOLDER_GET_CHILDREN,
    MAIN_ADD_FOLDER, MAIN_ITEM_RENAME,
    STORAGE_GET,
    STORAGE_GET_CHILDREN,
    STORAGE_GET_FIELDS,
    STORAGE_GET_LIST,
    MAIN_REMOVE_SELECTED,
    MAIN_SET_SELECTED,
} from '../types';
import {firstPageItem, IFolder, IStorage} from '../../models/models';

export interface ReducerInterface {
    activeItem: any,
    currentFiles: any,
    openedPath: OpenedPathInterface[],
    openedLinks: OpenedLinksInterface[],
    activeLink: string,
    selectedItems: any,
}

export interface OpenedPathInterface {
    item: IStorage | IFolder,
    type: 'storage' | 'folder' | 'file',
}

export interface OpenedLinksInterface {
    item: IStorage | IFolder,
    link: string,
}

const initialState: ReducerInterface = {
    activeItem: null,
    currentFiles: [],
    openedPath: [],
    openedLinks: [],
    activeLink: '',
    selectedItems: [],
}

//TODO ADD folder cashing
export const storageReducer = (state = initialState, action: {type: string, payload: any}) => {
    let checkDoubling : boolean;
    let openedPath: OpenedPathInterface[] = [];
    let openedLinks: OpenedLinksInterface[] = [];


    switch (action.type) {
        case MAIN_ADD_FOLDER:
            return {...state, currentFiles: [...state.currentFiles, action.payload]}

        case MAIN_ITEM_RENAME:
            const files = state.currentFiles;
            const renamedItemIndex = files.findIndex((file: any) => file.ID === action.payload?.ID);
            if (renamedItemIndex !== -1) files[renamedItemIndex] = {...files[renamedItemIndex], NAME: action.payload?.NAME}

            return {
                ...state,
                currentFiles: [...files],
            }

        case MAIN_SET_SELECTED:
            return {...state, selectedItems: [...action.payload]}

        case MAIN_REMOVE_SELECTED:
            return {...state, selectedItems: [...state.selectedItems.filter((item: any) => !action.payload?.find((removeItem: any) => removeItem.ID === item.ID))]}

        case STORAGE_GET :
            return {...state, currentFile: action.payload}
        case STORAGE_GET_LIST :
            return {
                ...state,
                currentFiles: [...action.payload],
                openedPath: [{type: 'firstPage', item: firstPageItem}],
                activeItem:  firstPageItem,
            }
        case STORAGE_GET_CHILDREN:
            checkDoubling = !!state.openedPath.find(path => path?.item?.ID === action.payload.storage?.item?.ID);
            openedPath = checkDoubling ? [...state.openedPath] : [...state.openedPath, action.payload.storage];

            return {
                ...state,
                currentFiles: [...action.payload.result],
                activeItem: action.payload.storage.item,
                openedPath,
            }


        case FOLDER_GET_CHILDREN:
            checkDoubling = !!state.openedPath.find(path => path?.item?.ID === action.payload.storage?.item?.ID);
            openedPath = checkDoubling ? [...state.openedPath] : [...state.openedPath, action.payload.storage];

            return {
                ...state,
                currentFiles: [...action.payload.result],
                activeItem: action.payload.storage.item,
                openedPath,
            }


        case FILE_GET_LINK:
            checkDoubling = !!state.openedPath.find(path => path?.item?.ID === action.payload.item?.ID);
            openedLinks = checkDoubling ? [...state.openedLinks] : [...state.openedLinks, action.payload];

            return {
                ...state,
                openedLinks,
                activeLink: action.payload.link
            }



        case FILE_ADD_TO_CURRENT:
            return {
                ...state,
                currentFiles: [...action.payload],
            }

        default: return state
    }

    return state;
};