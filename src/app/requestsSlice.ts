import {createSlice, isPending, isFulfilled, isRejected, isAnyOf} from "@reduxjs/toolkit";

const settled = isAnyOf(isFulfilled(), isRejected());

const slice = createSlice({
    name: "requests",
    initialState: {
        pending: {} as Record<string, boolean>,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(isPending(), (state, action) => {
            state.pending[action.meta.requestId] = true;
        });

        builder.addMatcher(settled, (state, action) => {
            delete state.pending[action.meta.requestId];
        });
    },
});

export const requestsReducer = slice.reducer;
