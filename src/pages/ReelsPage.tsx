import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {fetchRiskFactorReel, toggleRiskFactorLike} from "../entities/risk-factor/riskFactorThunks";
import {mediaUrl} from "../shared/lib/media";

const DEFAULT_VIDEO = "/default.mp4";

export const ReelsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const navigatedId = useRef<string | null>(null);
    const dispatch = useAppDispatch();
    const username = useAppSelector((s) => s.session.username);
    const {reel: factor, error} = useAppSelector((s) => s.riskFactors);

    useEffect(() => {
        if (id && navigatedId.current === id) {
            navigatedId.current = null;
            return;
        }

        void dispatch(fetchRiskFactorReel({id: id ? Number(id) : undefined, next: false}));
    }, [dispatch, id, username]);

    const showNext = async () => {
        if (!factor) {
            return;
        }

        const result = await dispatch(fetchRiskFactorReel({id: factor.id, next: true}));

        if (fetchRiskFactorReel.fulfilled.match(result) && result.payload.factor && result.payload.factor.id !== Number(id)) {
            navigatedId.current = String(result.payload.factor.id);
            navigate(`/reels/${result.payload.factor.id}`, {replace: true});
        }
    };

    if (!factor) {
        return (
            <main className="tabbed-page">
                <p className="empty-hint" role={error ? "alert" : "status"}>
                    {error || "Нет факторов риска."}
                </p>
                <button className="next-button" onClick={() => void dispatch(fetchRiskFactorReel({id: id ? Number(id) : undefined}))}>
                    Повторить
                </button>
            </main>
        );
    }

    return (
        <section className="feed-screen">
            <video className="feed-video" autoPlay muted loop playsInline src={mediaUrl(factor.video_url, DEFAULT_VIDEO)} />
            <div className="bottom-gradient" />
            {error && (
                <p className="feed-notice auth-error" role="alert">
                    {error}
                </p>
            )}

            <div className="top-left-badge">
                <span className="frax-badge">FRAX</span>
            </div>

            <div className="action-row">
                <button
                    type="button"
                    className={`interest-mark${factor.is_liked ? " liked" : ""}`}
                    aria-pressed={factor.is_liked}
                    aria-label={factor.is_liked ? "Снять лайк" : "Поставить лайк"}
                    onClick={() =>
                        username ? void dispatch(toggleRiskFactorLike({id: factor.id, liked: factor.is_liked})) : navigate("/auth")
                    }
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                    <span className="likes-count">{factor.likes}</span>
                </button>

                <dl className="action-fields">
                    <div>
                        <dt>Вес</dt>
                        <dd>{factor.weight}</dd>
                    </div>
                    <div>
                        <dt>Распр.</dt>
                        <dd>{factor.prevalence}%</dd>
                    </div>
                </dl>

                <button type="button" className="next-mark" onClick={() => void showNext()} aria-label="Следующий фактор">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            </div>

            <div className="data-layer">
                <h1 className="factor-title">{factor.name}</h1>

                <div className="factor-description">
                    <input type="checkbox" id={`desc-toggle-${factor.id}`} className="desc-toggle" />
                    <p className="description-text">{factor.description}</p>
                    <label htmlFor={`desc-toggle-${factor.id}`} className="desc-label" />
                </div>
            </div>
        </section>
    );
};
