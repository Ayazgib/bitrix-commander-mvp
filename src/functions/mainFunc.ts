import {bxMethods, returnedTypeInCloneFunc} from '../models/models';

export const createBitrixRequest = async (method: string, params: any = {}) => {
   const requestResult = await sendBitrixRequest(method, params);
   if (requestResult) return  dispatchRequestResult(requestResult, method);
   return null;
};

const sendBitrixRequest = (method: string, params: any) => {
    return new Promise(function(resolve, reject) {
        // @ts-ignore
        BX24.callMethod(
            method,
            params,
            function (result: any)
            {
                if (result.error()) {
                    alert(result.error() + 'повторите позднее');
                    console.error(result.error());
                    reject(false);
                } else {
                    resolve(result.data());
                }
            }
        );
    });
}

export const dispatchRequestResult = (data: any, method: string) => {
    // console.log('dispatchRequestResult', data, method);
    return data;
};

export const getItemType = (item: any) => {
    if (item?.MODULE_ID) return 'disk';
    return item?.TYPE;
}

export const cloneItemFromField = (item: any, allItem: any, field: string, returnedType: string = 'boolean', checkedValue = item[field]) => {
    if (returnedType === returnedTypeInCloneFunc.count) {
        allItem.filter((data: any) => {
            console.log(data.ID !== item.ID && data[field] === item[field] && typeof data[field] !== 'object');
            console.log(data[field], item[field], typeof data[field] );

           return data.ID !== item.ID && data[field] === item[field] && typeof data[field] !== 'object';
        });
        return allItem.filter((data: any) => data.ID !== item.ID && data[field] === checkedValue && typeof data[field] !== 'object').length;
    } else if (returnedType === returnedTypeInCloneFunc.array) {
        return allItem.filter((data: any) => data.ID !== item.ID && data[field] === checkedValue && typeof data[field] !== 'object');
    } else if (returnedType === returnedTypeInCloneFunc.boolean) {
        return !!allItem.find((data: any) => data.ID !== item.ID && data[field] === checkedValue && typeof data[field] !== 'object');
    }
}

export const renameItemPostIndex = (item: any, allItem: any, newName: string) => { //TODO update to universal
    let resultName = newName;
    const cloneCount = cloneItemFromField(item, allItem, 'NAME', returnedTypeInCloneFunc.count, newName);
    const namePostIndex = cloneCount ? ` (${cloneCount})` : '';

    resultName += namePostIndex;
    return resultName;
}

export const getFolder = (id: string) => {
    let folder =  createBitrixRequest(bxMethods.folder.get, {id});
    return folder;
}

