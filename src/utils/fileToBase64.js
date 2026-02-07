export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function fileToGenerativePart(base64, mimeType) {
  return {
    inlineData: { data: base64, mimeType },
  }
}

export function extractVideoFrames(file, count = 4) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const url = URL.createObjectURL(file)
    video.src = url

    video.onloadedmetadata = () => {
      video.currentTime = 0
    }

    const frames = []
    const duration = () => video.duration || 1
    let frameIndex = 0

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Math.min(video.videoWidth, 640)
      canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
      frames.push(base64)
      frameIndex++

      if (frameIndex >= count) {
        URL.revokeObjectURL(url)
        resolve(frames)
      } else {
        video.currentTime = (frameIndex / (count - 1)) * duration()
      }
    }

    video.onloadeddata = () => {
      video.currentTime = 0
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }
  })
}
