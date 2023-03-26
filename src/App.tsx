import React, {useEffect, useRef, useState} from 'react';
import './assets/style/App.css';
import 'antd/dist/antd.css';
import Window from './components/Window';
import {createBitrixRequest, getItemType, renameItemPostIndex} from './functions/mainFunc';
import {appSettingsOptionsName, bxMethods, hotKeys, mainKeysInHotKey} from './models/models';
import {
    addFileToActiveItem,
    getAppSettings,
    getStorageList,
    getUserSettings,
    renameItem, setMouseDown, setMouseUp,
    setSelectedItems,
} from './redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Bookmarks from './components/Bookmark/Bookmarks';


function App() {
    const dispatch = useDispatch();

    const activeItem = useSelector((state: any) => state.storage.activeItem);
    const currentItems = useSelector((state: any) => state.storage.currentFiles);
    const selectedItems = useSelector((state: any) => state.storage.selectedItems);
    const bookmarks = useSelector((state: any) => state.userSettings.bookmarks);
    const userSettings = useSelector((state: any) => state.userSettings);
    // const temporaryFolderId = useSelector((state: any) => state.appSettings.temporaryFolderId);


    let pressedKeys: string [] = [];
    let hotHeyUsed = false;
    const temporaryFolderId = '81';

    const arrowsFuncSwitcher = (code: string) => {

        if (pressedKeys.includes(mainKeysInHotKey.shiftLeftKey) || pressedKeys.includes(mainKeysInHotKey.shiftRightKey)) {
            changeSelectedWithShift(code);
            console.log(5555);
        } else {
            console.log(3333);
            changeSelectedWithArrows(code);
        }
    };

    const changeSelectedWithArrows = (code: string) => {
        const currentSelectedItemIndex = currentItems?.findIndex((item: any) => item?.ID === selectedItems[selectedItems.length - 1]?.ID);
        let nextIndex = 0;

        if (currentSelectedItemIndex !== -1) {
            if (code === mainKeysInHotKey.arrowDown) {
                if (currentSelectedItemIndex !== currentItems.length - 1) {
                    nextIndex = currentSelectedItemIndex + 1;
                } else {
                    nextIndex = 0;
                }
            } else if (code === mainKeysInHotKey.arrowUp) {
                if (currentSelectedItemIndex === 0) {
                    nextIndex = currentItems.length - 1;
                } else {
                    nextIndex = currentSelectedItemIndex - 1;
                }
            }
        }

        // @ts-ignore
        dispatch(setSelectedItems([currentItems[nextIndex]]));
    };

    const changeSelectedWithShift = (code: string) => {
        const currentSelectedItemIndex = currentItems?.findIndex((item: any) => item?.ID === selectedItems[selectedItems.length - 1]?.ID);
        let nextIndex = 0;

        if (currentSelectedItemIndex !== -1) {
            if (code === mainKeysInHotKey.arrowDown) {
                if (currentSelectedItemIndex !== currentItems.length - 1) {
                    nextIndex = currentSelectedItemIndex + 1;
                } else {
                    nextIndex = 0;
                }

                // @ts-ignore
                dispatch(setSelectedItems([...selectedItems, currentItems[nextIndex]]));
            } else if (code === mainKeysInHotKey.arrowUp) {
                if (currentSelectedItemIndex === 0) {
                    nextIndex = currentItems.length - 1;
                } else {
                    nextIndex = currentSelectedItemIndex - 1;
                }

                console.log(selectedItems, currentItems[nextIndex]);

                // @ts-ignore
                dispatch(setSelectedItems([currentItems[nextIndex]]));
            }
        }
    };

    const hotKeyFuncSwitcher = () => {
        Object.values(hotKeys).forEach(value => {
            value.forEach(hotKeysList => {
                hotKeysList.forEach(key => {
                    if (!pressedKeys.includes(key)) return;
                    if (hotHeyUsed) return;

                    if (key === mainKeysInHotKey.copy) {
                        hotHeyUsed = true;
                        if (selectedItems[0]) {
                            copySelectedItem(selectedItems[0]);
                        }
                    } else if (key === mainKeysInHotKey.bookmarks) {
                        hotHeyUsed = true;
                        addFolderToBookmark();
                    }
                })
            })
        })
    };

    const downHandler = (e: KeyboardEvent) => {
        pressedKeys = [...pressedKeys, e.code]

        if (pressedKeys.includes(mainKeysInHotKey.arrowDown) || pressedKeys.includes(mainKeysInHotKey.arrowUp)) {
            arrowsFuncSwitcher(e.code);

            return;
        }

        hotKeyFuncSwitcher();
    }

    function upHandler (e: KeyboardEvent) {
         pressedKeys = [...pressedKeys.filter((item: any) => item !== e.code)]
    }



    async function addFolderToBookmark () {
        const isDoubling = !!bookmarks?.find((template: any) => template?.ID === activeItem.ID);
        //TODO add предупреждение по названию шаблона
        let options: any = {};

        if (!isDoubling) {
            options[appSettingsOptionsName] = {...userSettings, bookmarks: [...bookmarks, activeItem]};
            const result = await createBitrixRequest(bxMethods.userSettings.userSet, options);
            //TODO add success notification
            console.log(result);
            // @ts-ignore
            dispatch(getUserSettings());
        } else {
            //TODO add error notification
        }
    };

    async function copySelectedItem (item: any) {
        const type = getItemType(item);

        // @ts-ignore
        await createBitrixRequest(bxMethods[type].moveto, {
            id: item.ID,
            targetFolderId: temporaryFolderId,
        });

        // @ts-ignore
        const copiedFolder = await createBitrixRequest(bxMethods[type].copyto, {
            id: item.ID,
            targetFolderId: activeItem.ID,
        });

        // @ts-ignore
        await createBitrixRequest(bxMethods[type].rename, {
            id: item.ID,
            newName: copiedFolder?.NAME + Math.random(),
        });

        // @ts-ignore
        await createBitrixRequest(bxMethods[type].moveto, {
            id: item.ID,
            targetFolderId: activeItem.ID,
        });
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(getStorageList());
        // @ts-ignore
        dispatch(getAppSettings());
        // @ts-ignore
        dispatch(getUserSettings());
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", downHandler);
        document.addEventListener("keyup", upHandler);

        return () => {
            document.removeEventListener('keydown', downHandler);
            document.removeEventListener("keyup", upHandler);
        }
    }, [selectedItems]);

    const handleMouseDown = (e: any) => {
        // @ts-ignore
        dispatch(setMouseDown(e));
    };

    const handleMouseUp = (e: any) => {
        // @ts-ignore
        dispatch(setMouseUp());
    };

    return (
        <div className="App"
             onMouseDown={(e) => handleMouseDown(e)}
             onMouseUp={(e => handleMouseUp(e))}>
            <Bookmarks/>
            <Window/>
        </div>
    );
}

export default App;


