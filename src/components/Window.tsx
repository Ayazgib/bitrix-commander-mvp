import React, {useEffect, useState} from 'react';
import {bxMethods, IFolder, IStorage} from '../models/models';
import {HddOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {
    getFolderChildren,
    getStorage,
    getStorageChildren,
    getStorageList,
    getFileLink,
    getAppSettings,
    addFileToActiveItem,
    renameItem,
    addFolderToActiveItem, removeSelectedItems, setSelectedItems
} from '../redux/actions';
import StorageItem from './Storage/StorageItem';
import {createBitrixRequest, getFolder, getItemType, renameItemPostIndex} from '../functions/mainFunc';
import {findAllByDisplayValue} from '@testing-library/react';

function Window() {
    const dispatch = useDispatch();
    const currentItems = useSelector((state: any) => state.storage.currentFiles);
    const activeItem = useSelector((state: any) => state.storage.activeItem);
    const openedPath = useSelector((state: any) => state.storage.openedPath);
    const openedLinks = useSelector((state: any) => state.storage.openedLinks);
    const activeLink = useSelector((state: any) => state.storage.activeLink);
    const settings = useSelector((state: any) => state.appSettings.templates);
    const selectedItems = useSelector((state: any) => state.storage.selectedItems);
    const mouseDown = useSelector((state: any) => state.events.mouseDown);

    const [isShowNextBtn, setIsShowNextBtn] = useState<boolean>(false);
    const [isOpenLink, setIsOpenLink] = useState<boolean>(false);
    const [isLoadStorage, setIsLoadStorage] = useState(true);
    const [isCreateFromTemplate, setIsCreateFromTemplate] = useState<boolean>(false);
    const [rightMouseDown, setRightMouseDown] = useState<boolean>(false);



    useEffect(() => {
        const activeIndex = openedPath.findIndex((path: any) => path?.item?.ID === activeItem?.ID);

        if (openedPath.length > 2 && activeIndex < openedPath.length - 1) {
            setIsShowNextBtn(true);
        } else {
            setIsShowNextBtn(false);
        }
    }, [openedPath])

    useEffect(() => {
        if (isOpenLink) {
            openLink(activeLink);
        }

        setIsOpenLink(false);

    }, [activeLink])

    useEffect(() => {
        if (isCreateFromTemplate && !settings.length) {
            alert('У вас нет шаблонов');
        }
    }, [isCreateFromTemplate]);


    const goPrev = async () => {
        console.log(activeItem);
        if (activeItem.TYPE === 'folder' && activeItem.PARENT_ID) {
            const parentFolder = await getFolder(activeItem.PARENT_ID);

            loadItemChildren(parentFolder);
        } else {
            const activeIndex = openedPath.findIndex((path: any) => path.item.ID === activeItem.ID);
            let item = openedPath[activeIndex - 1];

            loadItemChildren(item);
        }
    };

    const goNext = () => {
        const activeIndex = openedPath.findIndex((path: any) => path.item.ID === activeItem.ID);
        const {item, type} = openedPath[activeIndex + 1];

        loadItemChildren(item);
    };

    const openFileFromLink = (item: any) => {
        const linkInState = openedLinks?.find((link: any) => link?.item?.ID === item.ID);
        setIsOpenLink(true);

        if (linkInState) {
            openLink(linkInState.link);
        } else {
            // @ts-ignore
            dispatch(getFileLink(item));
        }
    }

    const loadItemChildren = (item: any) => {
        const itemType = getItemType(item);

        if (itemType === 'firstPage') {
            // @ts-ignore
            dispatch(getStorageList());
        } else if (itemType === 'disk') {
            // @ts-ignore
            dispatch(getStorageChildren(item));
        } else if (itemType === 'folder') {
            // @ts-ignore
            dispatch(getFolderChildren(item));
        } else if (itemType === 'file') {
            openFileFromLink(item);
        }
    };

    function openLink(link: string) {
        window.open(link);
    }

    const getSettings = () => {
        // @ts-ignore
        dispatch(getAppSettings());
    };

    const createFileFromTemplate = async (e: any) => {
        const id = e?.target.value;

        const result = await createBitrixRequest(bxMethods.file.copyto,
            {
                id,
                targetFolderId: activeItem.ID
            }
        );

        if (result) addFileToActiveItem(result, currentItems);
        // TODO UNiQ NAME
        console.log(result, currentItems, result.NAME);
        const newName = renameItemPostIndex(result, currentItems, result.NAME);

        // @ts-ignore
        dispatch(renameItem(result.ID, 'file', newName));


        setIsCreateFromTemplate(false);
    };

    const addFolder = () => {
        const itemType = getItemType(activeItem);
        // @ts-ignore
        dispatch(addFolderToActiveItem(activeItem?.ID, itemType, `New${Math.random()}`));
    };

    useEffect(() => {console.log(mouseDown)}, [mouseDown])

    const handleMouseEnter = (e: MouseEvent, item: any) => {
        if (mouseDown === 1) {
            const isSelected = !!selectedItems?.find((selectedItem: any) => selectedItem.ID === item.ID);

            if (isSelected) {
                // @ts-ignore
                dispatch(removeSelectedItems([item]));
            } else {
                // @ts-ignore
                dispatch(setSelectedItems([...selectedItems, item]));
            }
        }
    };

    return (
        <div className="window">
            <div className='window__btns-wrapper'>
                {
                    openedPath?.length > 1 ? <button onClick={() => goPrev()}><LeftOutlined/></button> : null
                }
                {
                    isShowNextBtn ? <button onClick={() => goNext()}><RightOutlined/></button> : null
                }
                <button onClick={() => getSettings()}>GET SETTINGS</button>

                <button onClick={() => setIsCreateFromTemplate(!isCreateFromTemplate)}>
                    create from template
                </button>

                {
                    activeItem && getItemType(activeItem) !== 'firstPage' ? <button onClick={() => addFolder()}>
                        add folder
                    </button> : null
                }

                <button onClick={() => loadItemChildren(activeItem)}>
                    reload here
                </button>

                {
                    activeItem?.TYPE !== 'firsPage' &&
                    isCreateFromTemplate &&
                    settings.length ? <select onChange={(e) => createFileFromTemplate(e)}>
                        {
                            settings.map((item: any) =>
                                <option value={item.ID} key={item.ID}>{item.NAME}</option>)
                        }
                    </select> : null
                }
            </div>

            <div className='window__items'>
                {
                    currentItems?.length ? currentItems.map((item: IStorage | IFolder) =>
                            <div onMouseEnter={(e: any) => handleMouseEnter(e, item)}>
                                <StorageItem item={item}
                                             loadItemChildren={loadItemChildren}/>
                            </div>
                        )
                        : null
                }
            </div>

        </div>
    );
}

export default Window;
