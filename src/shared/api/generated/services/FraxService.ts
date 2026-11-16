/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_draft_factor_api_factors_draft_post } from '../models/Body_create_draft_factor_api_factors_draft_post';
import type { Body_publish_factor_api_factors_draft__factor_id__put } from '../models/Body_publish_factor_api_factors_draft__factor_id__put';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FraxService {
    /**
     * Get Risk Factors
     * @param riskFactorWeight
     * @param sessionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRiskFactorsApiFactorsGet(
        riskFactorWeight?: (number | null),
        sessionId?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/factors',
            cookies: {
                'session_id': sessionId,
            },
            query: {
                'risk_factor_weight': riskFactorWeight,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Risk Factor
     * @param riskFactorId
     * @returns void
     * @throws ApiError
     */
    public static deleteRiskFactorApiFactorsRiskFactorIdDelete(
        riskFactorId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/factors/{risk_factor_id}',
            path: {
                'risk_factor_id': riskFactorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Risk Factor Info
     * @param riskFactorId
     * @param next
     * @param sessionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRiskFactorInfoApiFactorsReelsGet(
        riskFactorId?: (number | null),
        next: boolean = false,
        sessionId?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/factors/reels',
            cookies: {
                'session_id': sessionId,
            },
            query: {
                'risk_factor_id': riskFactorId,
                'next': next,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Draft Factor
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDraftFactorApiFactorsDraftGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/factors/draft',
        });
    }
    /**
     * Create Draft Factor
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createDraftFactorApiFactorsDraftPost(
        formData: Body_create_draft_factor_api_factors_draft_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/factors/draft',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Factor
     * @param factorId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static publishFactorApiFactorsDraftFactorIdPut(
        factorId: number,
        formData: Body_publish_factor_api_factors_draft__factor_id__put,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/factors/draft/{factor_id}',
            path: {
                'factor_id': factorId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Like
     * @param riskFactorId
     * @param addLike
     * @returns void
     * @throws ApiError
     */
    public static addLikeApiFactorsLikePost(
        riskFactorId: number,
        addLike: boolean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/factors/like',
            query: {
                'risk_factor_id': riskFactorId,
                'add_like': addLike,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
