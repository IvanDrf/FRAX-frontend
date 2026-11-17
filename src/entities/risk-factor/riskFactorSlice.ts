import {createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import type {RiskFactor} from "../../types";
import {loggedIn, loggedOut} from "../session/sessionSlice";
import * as thunks from "./riskFactorThunks";

type State = {
    items: RiskFactor[];
    reel: RiskFactor | null;
    draft: RiskFactor | null;
    catalogMock: boolean;
    reelMock: boolean;
    error: string | null;
    catalogRequest: string | null;
    reelRequest: string | null;
};

const operations = [
    thunks.fetchRiskFactors,
    thunks.fetchRiskFactorReel,
    thunks.fetchRiskFactorDraft,
    thunks.createRiskFactorDraft,
    thunks.publishRiskFactor,
    thunks.deleteRiskFactor,
    thunks.toggleRiskFactorLike,
] as const;

const initialState: State = {
    items: [],
    reel: null,
    draft: null,
    catalogMock: false,
    reelMock: false,
    error: null,
    catalogRequest: null,
    reelRequest: null,
};

const slice = createSlice({
    name: "riskFactors",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loggedIn, () => initialState)
            .addCase(loggedOut, () => initialState)
            .addCase(thunks.fetchRiskFactors.pending, (state, action) => {
                state.catalogRequest = action.meta.requestId;
            })
            .addCase(thunks.fetchRiskFactorReel.pending, (state, action) => {
                state.reelRequest = action.meta.requestId;
                if (!action.meta.arg.next) state.reel = null;
            })
            .addCase(thunks.fetchRiskFactors.fulfilled, (state, action) => {
                if (state.catalogRequest !== action.meta.requestId) return;
                state.items = action.payload.items;
                state.catalogMock = action.payload.mock;
            })
            .addCase(thunks.fetchRiskFactorReel.fulfilled, (state, action) => {
                if (state.reelRequest !== action.meta.requestId) return;
                state.reel = action.payload.factor;
                state.reelMock = action.payload.mock;
            })
            .addCase(thunks.fetchRiskFactorDraft.fulfilled, (state, action) => {
                state.draft = action.payload;
            })
            .addCase(thunks.createRiskFactorDraft.fulfilled, (state, action) => {
                state.draft = action.payload;
            })
            .addCase(thunks.publishRiskFactor.fulfilled, (state) => {
                state.draft = null;
            })
            .addCase(thunks.deleteRiskFactor.fulfilled, (state, action) => {
                state.items = state.items.filter((f) => f.id !== action.payload);
                if (state.draft?.id === action.payload) state.draft = null;
                if (state.reel?.id === action.payload) state.reel = null;
            })
            .addCase(thunks.toggleRiskFactorLike.fulfilled, (state, action) => {
                for (const factor of [...state.items, ...(state.reel ? [state.reel] : [])]) {
                    if (factor.id === action.payload.id) {
                        factor.likes = Math.max(0, factor.likes + (action.payload.liked ? 1 : -1));
                        factor.is_liked = action.payload.liked;
                    }
                }
            })
            .addMatcher(isPending(...operations), (state) => {
                state.error = null;
            })
            .addMatcher(isRejected(...operations), (state, action) => {
                state.error = action.payload ?? "Ошибка запроса";
            });
    },
});

export const riskFactorReducer = slice.reducer;
