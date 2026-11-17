import {configureStore} from "@reduxjs/toolkit";
import {sessionReducer} from "../entities/session/sessionSlice";
import {riskFactorReducer} from "../entities/risk-factor/riskFactorSlice";
import {filterReducer} from "../features/risk-factor-filter/filterSlice";
import {requestsReducer} from "./requestsSlice";

export const store = configureStore({
    reducer: {session: sessionReducer, riskFactors: riskFactorReducer, riskFactorFilter: filterReducer, requests: requestsReducer},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
