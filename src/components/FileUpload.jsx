import { useState, useRef } from 'react'

export default function FileUpload({ accept, onFile, label, icon }) {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  function handleFile(file) {
    if (!file) return
    onFile(file)
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(file))
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
          dragOver
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
          <div>
            <p className="font-medium text-gray-600">{label || 'Drop file here or click to upload'}</p>
            <p className="text-sm text-gray-400 mt-1">Supported: {accept || 'any file'}</p>
          </div>
        </div>
      </div>

      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {preview.includes('video') || accept?.includes('video') ? (
            <video src={preview} controls className="w-full max-h-64 object-contain bg-black" />
          ) : (
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setPreview(null); onFile(null) }}
            aria-label="Remove file"
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
