import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {useSelector} from 'react-redux';
import {MenuOutlined} from '@ant-design/icons';
import BookmarkItem from './BookmarkItem';


function Bookmarks() {
    const currentItems = useSelector((state: any) => state.storage.currentFiles);
    const bookmarks = useSelector((state: any) => state.userSettings.bookmarks);

    return (
        <div>
            Закладки <button><MenuOutlined /></button>
            {
                bookmarks.length ? bookmarks.map((bookmark: any) => <BookmarkItem  bookmark={bookmark} />) : null
            }
        </div>
    );
}

export default Bookmarks;


