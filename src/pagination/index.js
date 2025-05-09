import _ from "lodash";
import {enqueueSnackbar} from "notistack";

function openSidebar() {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
    }
}

function closeSidebar() {
    if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--SideNavigation-slideIn');
        document.body.style.removeProperty('overflow');
    }
}

function toggleSidebar() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const slideIn = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue('--SideNavigation-slideIn');
        if (slideIn) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

function Capitalize(inputString) {
    let words = inputString.split(' ');
    let capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}

function syncData(local, global) {
    const mergedArray = [];

    const globalMap = _.keyBy(global.data, global.matcherKey);
    local?.data?.forEach(localObj => {

        const localObjCopy = {...localObj, [global.matcherKey]: localObj[local.matcherKey]}
        const globalObj = globalMap[localObj[local.matcherKey]];

        if (globalObj) {
            const localKeys = Object.keys(localObj);
            const g = {}
            localKeys.forEach(k=>{
                g[k] = globalObj[k]
            })

            // const mergedObj = _.merge({}, localObjCopy, globalObj);
            let updatedObj = {};
            if (!_.isEqual(localObjCopy, g)) {
                updatedObj = {...g, isUpdateRequire: true};
            } else {
                updatedObj = {...g, isUpdateRequire: false};
            }
            mergedArray.push(updatedObj);
            delete globalMap[localObj[local.matcherKey]];
        } else {
            const newObj = {...localObjCopy, isDeletePossible: true};
            mergedArray.push(newObj);
        }
    });
    _.forEach(globalMap, obj => {
        mergedArray.push({...obj, isUpdateRequire: true});
    });

    return mergedArray;
};
const responseHandler = (response,meta) => {
    if(meta.response.status == 200){
    enqueueSnackbar(response?.message,{
        variant:"success"
    })
}else{
    enqueueSnackbar(response?.message,{
        variant:"error"
    })
}
    return response
}


export {
    responseHandler,
    Capitalize,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    syncData
}