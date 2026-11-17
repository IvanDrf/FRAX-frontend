export interface RiskFactor {
    id: number;
    name: string;
    description: string;
    image_url: string;
    video_url: string;
    weight: number;
    prevalence: number;
    likes: number;
    is_liked: boolean;
    is_creator: boolean;
}
