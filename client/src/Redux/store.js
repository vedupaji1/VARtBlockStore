import {
    configureStore
} from '@reduxjs/toolkit';
import {
    mainUserData,
    searchedUserData
} from "./Reducers/users";
import {
    is404,
    usernameParameter,
    isLoading,
    usersData_PRIVATE,
    usersData_PUBLIC,
    isFileUpload,
    fileUploadStatus
} from "./Reducers/tempStates";

export const store = configureStore({
    reducer: {
        mainUserData: mainUserData,
        searchedUserData: searchedUserData,
        is404: is404,
        usernameParameter: usernameParameter,
        isLoading: isLoading,
        usersData_PRIVATE: usersData_PRIVATE,
        usersData_PUBLIC: usersData_PUBLIC,
        isFileUpload: isFileUpload,
        fileUploadStatus: fileUploadStatus
    },
})