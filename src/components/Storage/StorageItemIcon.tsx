import React, {useEffect, useState} from 'react';
import {DatabaseFilled, FileFilled, FolderFilled, HddOutlined} from '@ant-design/icons';

function StorageItem(props: any) {
    return (
        <div className="storage--item-icon">
            { props.type === 'disk' ? <DatabaseFilled size={256} /> : null }
            { props.type === 'folder' ? <FolderFilled size={256} /> : null }
            { props.type === 'file' ? <FileFilled size={256} /> : null }
        </div>
    );
}

export default StorageItem;
