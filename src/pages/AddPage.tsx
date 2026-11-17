import { useState, useEffect } from 'react'
import type { ChangeEvent, SubmitEventHandler } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchRiskFactorDraft, createRiskFactorDraft, publishRiskFactor, deleteRiskFactor } from '../entities/risk-factor/riskFactorThunks'
import { mediaUrl } from '../shared/lib/media'

const DEFAULT_IMAGE = '/default.png'
const DEFAULT_VIDEO = '/default.mp4'

interface FormState {
  name: string
  description: string
  weight: string
  prevalence: string
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  weight: '1',
  prevalence: '0',
}

export const AddPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector(s => s.session.username)
  const { draft, error } = useAppSelector(s => s.riskFactors)
  const step = draft ? 'details' : 'name'
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  useEffect(() => { if (username) void dispatch(fetchRiskFactorDraft()) }, [dispatch, username])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [imageName, setImageName] = useState('Файл не выбран')
  const [videoName, setVideoName] = useState('Файл не выбран')

  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [videoUrl])

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setName: (v: string) => void,
    setUrl: (v: string) => void,
    setFile: (v: File | null) => void,
  ) => {
    const file = e.target.files?.[0]
    setFile(file ?? null)
    if (file) {
      setName(file.name)
      setUrl(URL.createObjectURL(file))
    } else {
      setName('Файл не выбран')
      setUrl('')
    }
  }

  const handleNameSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !imageFile || !videoFile) return
    await dispatch(createRiskFactorDraft({ name: form.name.trim(), image: imageFile, video: videoFile }))
  }

  const handlePublish: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!draft) return
    const result = await dispatch(publishRiskFactor({ id: draft.id, description: form.description.trim(), weight: Number(form.weight), prevalence: Number(form.prevalence) }))
    if (publishRiskFactor.fulfilled.match(result)) navigate('/')
  }

  if (!username) return <Navigate to="/auth" replace />

  return (
    <main className="tabbed-page">
      <header className="page-header">
        <span className="frax-badge">FRAX</span>
        <h1 className="page-title">
          {step === 'name' ? 'Новый фактор' : 'Публикация фактора'}
        </h1>
      </header>

      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      {step === 'name' && (
        <form onSubmit={handleNameSubmit}>
          <section className="minio-block">
            <h2>Изображение</h2>
            <img
              className="minio-preview"
              alt="Изображение по умолчанию"
              src={imageUrl || mediaUrl(draft?.image_url, DEFAULT_IMAGE)}
            />
            <label className="file-field-custom">
              <input
                type="file"
                required
                accept="image/*"
                aria-label="Изображение"
                onChange={(e) =>
                  handleFileChange(e, setImageName, setImageUrl, setImageFile)
                }
              />
              <span className="file-button">Выбрать файл</span>
              <span className="file-name">{imageName}</span>
            </label>
          </section>

          <section className="minio-block">
            <h2>Видео</h2>
            <video
              className="minio-preview"
              controls
              preload="metadata"
              playsInline
              src={videoUrl || mediaUrl(draft?.video_url, DEFAULT_VIDEO)}
            />
            <label className="file-field-custom">
              <input
                type="file"
                required
                accept="video/*"
                aria-label="Видео"
                onChange={(e) =>
                  handleFileChange(e, setVideoName, setVideoUrl, setVideoFile)
                }
              />
              <span className="file-button">Выбрать файл</span>
              <span className="file-name">{videoName}</span>
            </label>
          </section>

          <label className="field-label" htmlFor="name">
            Название фактора
          </label>
          <input
            className="factor-field"
            id="name"
            name="name"
            type="text"
            placeholder="Например, Курение"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <button className="next-button" type="submit">
            Далее
          </button>
        </form>
      )}

      {draft && (
        <form onSubmit={handlePublish}>
          <p className="filter-hint">Черновик: {draft.name}</p>
          <section className="minio-block">
            <h2>Изображение</h2>
            <img
              className="minio-preview"
              src={imageUrl || mediaUrl(draft?.image_url, DEFAULT_IMAGE)}
              alt={draft.name}
            />
          </section>

          <section className="minio-block">
            <h2>Видео</h2>
            <video
              className="minio-preview"
              src={videoUrl || mediaUrl(draft?.video_url, DEFAULT_VIDEO)}
              controls
              preload="metadata"
              playsInline
            />
          </section>

          <label className="field-label" htmlFor="description">
            Краткое описание фактора
          </label>
          <textarea
            className="factor-field"
            id="description"
            name="description"
            required
            placeholder="Краткое описание фактора риска"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label className="field-label" htmlFor="weight">
            Вес фактора
          </label>
          <input
            className="factor-field"
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="1"
            max="2"
            required
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />

          <label className="field-label" htmlFor="prevalence">
            Распространённость фактора, %
          </label>
          <input
            className="factor-field"
            id="prevalence"
            name="prevalence"
            type="number"
            step="1"
            min="0"
            max="100"
            required
            value={form.prevalence}
            onChange={(e) =>
              setForm({ ...form, prevalence: e.target.value })
            }
          />

          <button type="button" className="auth-toggle" onClick={() => void dispatch(deleteRiskFactor(draft.id))}>Удалить черновик</button>
          <button className="next-button" type="submit">
            Опубликовать
          </button>
        </form>
      )}
    </main>
  )
}