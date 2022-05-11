import {
    createReducer
} from "@reduxjs/toolkit";

export const is404 = createReducer({
    data: false
}, {
    setIs404: (state, action) => {
        state.data = action.payload
    }
})

export const usernameParameter = createReducer({
    data: undefined
}, {
    setUsernameParameter: (state, action) => {
        state.data = action.payload
    }
})

export const isLoading = createReducer({
    data: false
}, {
    setIsLoading: (state, action) => {
        state.data = action.payload
    }
})

export const usersData_PRIVATE = createReducer({
    data: null
}, {
    setUsersData_PRIVATE: (state, action) => {
        state.data = action.payload
    }
})

export const usersData_PUBLIC = createReducer({
    data: null
}, {
    setUsersData_PUBLIC: (state, action) => {
        state.data = action.payload
    }
})

export const isFileUpload = createReducer({
    data: false
}, {
    setIsFileUpload: (state, action) => {
        state.data = action.payload
    }
})

export const fileUploadStatus = createReducer({
    isPrivate: false,
    isFolder: false
}, {
    setIsPrivateFile: (state, action) => {
        state.isPrivate = action.payload.isPrivate
    },
    setIsFolder: (state, action) => {
        state.isFolder = action.payload.isFolder
    }
})