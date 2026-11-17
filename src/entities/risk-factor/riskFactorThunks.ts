import {createAsyncThunk} from "@reduxjs/toolkit";
import {RiskFactorsService} from "../../shared/api/generated";
import "../../shared/api/config";
import {RISK_FACTORS} from "../../modules/mock";
import {errorMessage, isUnavailable, statusOf} from "../../shared/lib/apiError";
import {toRiskFactor} from "./adapters";
import type {RootState} from "../../app/store";
import type {RiskFactor} from "../../types";

type Config = {state: RootState; rejectValue: string};

export const fetchRiskFactors = createAsyncThunk<{items: RiskFactor[]; mock: boolean}, number, Config>(
    "riskFactors/fetchRiskFactors",
    async (weight: number, {getState, rejectWithValue}) => {
        try {
            const data: unknown = await RiskFactorsService.getRiskFactors(weight || undefined);
            if (!Array.isArray(data)) throw new Error("Некорректный список факторов");
            return {items: data.map(toRiskFactor), mock: false};
        } catch (error) {
            if (!getState().session.username && isUnavailable(error))
                return {items: RISK_FACTORS.filter((f) => !weight || f.weight > weight), mock: true};
            return rejectWithValue(errorMessage(error));
        }
    },
);

export const fetchRiskFactorReel = createAsyncThunk<{factor: RiskFactor | null; mock: boolean}, {id?: number; next?: boolean}, Config>(
    "riskFactors/fetchRiskFactorReel",
    async ({id, next = false}: {id?: number; next?: boolean}, {getState, rejectWithValue}) => {
        try {
            const data: unknown = await RiskFactorsService.getRiskFactorReel(id, next);
            return {factor: toRiskFactor(data), mock: false};
        } catch (error) {
            if (statusOf(error) === 404) {
                return {factor: null, mock: false};
            }

            if (!getState().session.username && isUnavailable(error)) {
                const index = id === undefined ? 0 : RISK_FACTORS.findIndex((f) => f.id === id);
                return {factor: index < 0 ? null : RISK_FACTORS[(index + (next ? 1 : 0)) % RISK_FACTORS.length], mock: true};
            }

            return rejectWithValue(errorMessage(error));
        }
    },
);

export const fetchRiskFactorDraft = createAsyncThunk<RiskFactor | null, void, Config>(
    "riskFactors/fetchRiskFactorDraft",
    async (_, {rejectWithValue}) => {
        try {
            return toRiskFactor(await RiskFactorsService.getRiskFactorDraft());
        } catch (error) {
            return statusOf(error) === 404 ? null : rejectWithValue(errorMessage(error));
        }
    },
);

export const createRiskFactorDraft = createAsyncThunk<RiskFactor, {name: string; image: File; video: File}, Config>(
    "riskFactors/createRiskFactorDraft",
    async (args: {name: string; image: File; video: File}, {rejectWithValue}) => {
        try {
            return toRiskFactor(await RiskFactorsService.createRiskFactorDraft(args));
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);

export const publishRiskFactor = createAsyncThunk<
    RiskFactor,
    {id: number; description: string; weight: number; prevalence: number},
    Config
>(
    "riskFactors/publishRiskFactor",
    async ({id, ...form}: {id: number; description: string; weight: number; prevalence: number}, {rejectWithValue}) => {
        try {
            return toRiskFactor(await RiskFactorsService.publishRiskFactor(id, form));
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);

export const deleteRiskFactor = createAsyncThunk<number, number, Config>(
    "riskFactors/deleteRiskFactor",
    async (id: number, {rejectWithValue}) => {
        try {
            await RiskFactorsService.deleteRiskFactor(id);
            return id;
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);

export const toggleRiskFactorLike = createAsyncThunk<{id: number; liked: boolean}, {id: number; liked: boolean}, Config>(
    "riskFactors/toggleRiskFactorLike",
    async ({id, liked}: {id: number; liked: boolean}, {rejectWithValue}) => {
        try {
            await RiskFactorsService.setRiskFactorLike(id, !liked);
            return {id, liked: !liked};
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);
