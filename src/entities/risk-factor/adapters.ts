import type {RiskFactor} from "../../types";
export function toRiskFactor(value: unknown): RiskFactor {
    if (!value || typeof value !== "object" || !("id" in value) || !("name" in value)) throw new Error("Некорректный ответ сервиса");
    const factor = value as Record<string, unknown>;

    return {
        id: Number(factor.id),
        name: String(factor.name),
        description: String(factor.description ?? ""),
        image_url: String(factor.image_url ?? ""),
        video_url: String(factor.video_url ?? ""),
        weight: Number(factor.weight ?? 1),
        prevalence: Number(factor.prevalence ?? 0),
        likes: Number(factor.likes ?? 0),
        is_liked: factor.is_liked === true,
        is_creator: factor.is_creator === true,
    };
}
