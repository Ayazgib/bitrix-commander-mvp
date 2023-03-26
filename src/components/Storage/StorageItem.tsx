import React, {useEffect, useState} from 'react';
import StorageItemIcon from './StorageItemIcon';
import {useDispatch, useSelector} from 'react-redux';
import {getAppSettings, renameItem, setSelectedItems} from '../../redux/actions';
import {appSettingsOptionsName, bxMethods, returnedTypeInCloneFunc} from '../../models/models';
import {cloneItemFromField, createBitrixRequest, getItemType, renameItemPostIndex} from '../../functions/mainFunc';

function StorageItem(props: any) {
    const dispatch = useDispatch();
    const settings = useSelector((state: any) => state.appSettings.templates);
    const currentItems = useSelector((state: any) => state.storage.currentFiles);
    const selectedItems = useSelector((state: any) => state.storage.selectedItems);

    const [isShowRenaming, setIsShowRenaming] = useState<boolean>(false);
    const [renamedName, setRenamedName] = useState<string>('');
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const {
        item,
        loadItemChildren
    } = props;


    useEffect(() => {
        if (!isShowRenaming) setRenamedName(item.NAME);
    }, [isShowRenaming])

    useEffect(() => {
        let isSelected = false
        if (selectedItems) {
            isSelected = !!selectedItems?.find((selected: any) => selected?.ID === item?.ID);
        }

        setIsSelected(isSelected);
    }, [selectedItems]);

    const addFileToTempalte = async () => {
        const isDoubling = !!settings?.find((template: any) => template?.ID === item.ID);
        //TODO add предупреждение по названию шаблона
        let options: any = {};
        if (!isDoubling) {
            options[appSettingsOptionsName] = [...settings, item];
            const result = await createBitrixRequest(bxMethods.appSettings.appSet, options);
            //TODO add success notification
            // @ts-ignore
            dispatch(getAppSettings());
        } else {
            //TODO add error notification
        }
    }

    const handleRenameItem = () => {
        const type = getItemType(item);
        const newName = renameItemPostIndex(item, currentItems, renamedName);

        // @ts-ignore
        dispatch(renameItem(item.ID, type, newName));

        setIsShowRenaming(false);
    };

    const handleRenameChange = (e: any) => setRenamedName(e.target.value);

    const handleClickToItem = () => {
        // @ts-ignore
        dispatch(setSelectedItems([item]));
    };

    const handleDoubleClick = () => {
        setIsShowRenaming(!isShowRenaming)
        // @ts-ignore
        dispatch(setSelectedItems([...selectedItems, item]));
    };


    return (
        <div className='storage--item' style={{background: isSelected ? 'yellow' : ''}}
              onDoubleClick={() => handleDoubleClick()}>
            <div onClick={() => handleClickToItem()} style={{width: 100, background: 'lightblue'}}>
                <h4>{item.ID}</h4>

                <StorageItemIcon type={props?.item?.TYPE ? props?.item?.TYPE : props?.item?.MODULE_ID}/>
            </div>


            <button onClick={() => loadItemChildren(item)}>
                <h4 key={item.ID}>
                    {item.NAME}
                </h4>
            </button>

            <button onClick={() => setIsShowRenaming(!isShowRenaming)}>
                rename {getItemType(item)}
            </button>
            {
                isShowRenaming ? <div>
                        <input type='text' value={renamedName} onChange={(e) => handleRenameChange(e)}/>
                        <button onClick={() => handleRenameItem()}>save</button>
                    </div> : null
            }
            {
                props?.item?.TYPE === 'file' ?
                    <button onClick={() => addFileToTempalte()}>
                        + to template
                    </button> : null
            }

        </div>
    );
}

export default StorageItem;
