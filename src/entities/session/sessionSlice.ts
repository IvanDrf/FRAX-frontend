import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

type SessionState = {username: string | null; status: "idle" | "loading" | "failed"; error: string | null};

const initialState: SessionState = {username: null, status: "idle", error: null};

const slice = createSlice({
    name: "session",
    initialState,
    reducers: {
        authStarted(state) {
            state.status = "loading";
            state.error = null;
        },
        loggedIn(state, action: PayloadAction<string>) {
            state.username = action.payload;
            state.status = "idle";
        },
        loggedOut: () => initialState,
        authFailed(state, action: PayloadAction<string>) {
            state.status = "failed";
            state.error = action.payload;
        },
    },
});
export const {authStarted, loggedIn, loggedOut, authFailed} = slice.actions;
export const sessionReducer = slice.reducer;
