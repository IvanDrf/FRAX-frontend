import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loggedOut} from "../../entities/session/sessionSlice";

const slice = createSlice({
    name: "riskFactorFilter",
    initialState: {weight: 0},
    reducers: {
        weightChanged(state, action: PayloadAction<number>) {
            state.weight = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loggedOut, () => ({weight: 0}));
    },
});

export const {weightChanged} = slice.actions;
export const filterReducer = slice.reducer;
