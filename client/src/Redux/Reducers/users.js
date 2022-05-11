import {
    createReducer
} from "@reduxjs/toolkit";

export const mainUserData = createReducer({
    data: null
}, {
    setMainUserData: (state, action) => {
        state.data = action.payload
    }
})

export const searchedUserData = createReducer({
    data: null
}, {
    setSearchedUserData: (state, action) => {
        state.data = action.payload
    }
})