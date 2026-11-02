import { useState, useEffect } from 'react'
import type { ChangeEvent, SubmitEventHandler } from 'react'

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
  weight: '0',
  prevalence: '0',
}

export const AddPage = () => {
  const [step, setStep] = useState<'name' | 'details'>('name')
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
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setName(file.name)
      setUrl(URL.createObjectURL(file))
    } else {
      setName('Файл не выбран')
      setUrl('')
    }
  }

  const handleNameSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setStep('details')
  }

  const handlePublish: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    console.log('Опубликовать фактор:', form)
    setStep('name')
    setForm(EMPTY_FORM)
    setImageName('Файл не выбран')
    setVideoName('Файл не выбран')

    setImageUrl('')
    setVideoUrl('')
  }

  return (
    <main className="tabbed-page">
      <header className="page-header">
        <span className="frax-badge">FRAX</span>
        <h1 className="page-title">
          {step === 'name' ? 'Новый фактор' : 'Публикация фактора'}
        </h1>
      </header>

      {step === 'name' && (
        <form onSubmit={handleNameSubmit}>
          <section className="minio-block">
            <h2>Изображение</h2>
            <img
              className="minio-preview"
              alt="Изображение по умолчанию"
              src={imageUrl || DEFAULT_IMAGE}
            />
            <label className="file-field-custom">
              <input
                type="file"
                accept="image/*"
                aria-label="Изображение"
                onChange={(e) =>
                  handleFileChange(e, setImageName, setImageUrl)
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
              src={videoUrl || DEFAULT_VIDEO}
            />
            <label className="file-field-custom">
              <input
                type="file"
                accept="video/*"
                aria-label="Видео"
                onChange={(e) =>
                  handleFileChange(e, setVideoName, setVideoUrl)
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

      {step === 'details' && (
        <form onSubmit={handlePublish}>
          <section className="minio-block">
            <h2>Изображение</h2>
            <img
              className="minio-preview"
              src={imageUrl || DEFAULT_IMAGE}
              alt={form.name}
            />
          </section>

          <section className="minio-block">
            <h2>Видео</h2>
            <video
              className="minio-preview"
              src={videoUrl || DEFAULT_VIDEO}
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
            min="0"
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

          <button className="next-button" type="submit">
            Опубликовать
          </button>
        </form>
      )}
    </main>
  )
}