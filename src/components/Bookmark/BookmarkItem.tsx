import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {useDispatch, useSelector} from 'react-redux';
import {MenuOutlined} from '@ant-design/icons';
import StorageItemIcon from '../Storage/StorageItemIcon';
import {getFolderChildren} from '../../redux/actions';


function Bookmarks(props: any) {
    const dispatch = useDispatch();

    const {bookmark} = props;

    const openFolder = () => {
        // @ts-ignore
        dispatch(getFolderChildren(bookmark));
    };

    return (
        <div className='bookmark__item' onClick={() => openFolder()}>
            <StorageItemIcon type={'folder'} />
            <h5>{bookmark.NAME}</h5>
        </div>
    );
}

export default Bookmarks;


