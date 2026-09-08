import { Pause, Play } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { MediaSource } from '../content/types'

type VocabularyMemberMediaProps = {
  audio: MediaSource
  audioRef: RefObject<HTMLAudioElement | null>
  memberName: string
  video: MediaSource
  videoRef: RefObject<HTMLVideoElement | null>
}

function hasPlayableSource(source: MediaSource) {
  return source.kind === 'human-recording' && Boolean(source.src?.trim())
}

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`
}

export function VocabularyMemberMedia({ audio, audioRef, memberName, video, videoRef }: VocabularyMemberMediaProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadedDuration, setLoadedDuration] = useState(0)
  const [peaks, setPeaks] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canPlayAudio = hasPlayableSource(audio)
  const canPlayVideo = hasPlayableSource(video)
  const duration = loadedDuration || audio.durationSeconds || 0

  useEffect(() => {
    if (!canPlayAudio || !audio.src) return
    const controller = new AbortController()
    let context: AudioContext | undefined
    void (async () => {
      try {
        const response = await fetch(audio.src!, { signal: controller.signal })
        if (!response.ok) return
        context = new AudioContext()
        const buffer = await context.decodeAudioData(await response.arrayBuffer())
        const samples = buffer.getChannelData(0)
        const values = Array.from({ length: 72 }, (_, index) => {
          const start = Math.floor(index * samples.length / 72)
          const end = Math.floor((index + 1) * samples.length / 72)
          let peak = 0
          for (let i = start; i < end; i++) peak = Math.max(peak, Math.abs(samples[i]))
          return peak
        })
        const max = Math.max(...values, 0.01)
        if (!controller.signal.aborted) setPeaks(values.map((value) => value / max))
      } catch { /* Playback remains available if waveform analysis is unavailable. */ }
      finally { if (context && context.state !== 'closed') void context.close() }
    })()
    return () => { controller.abort() }
  }, [audio.src, canPlayAudio])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    const values = peaks.length ? peaks : Array.from({ length: 72 }, (_, i) =>
      0.12 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.23)) * (0.85 - i / 110))
    values.forEach((value, i) => {
      const height = Math.max(5, value * 66)
      context.fillStyle = peaks.length
        ? (i / values.length < currentTime / (duration || 1) ? '#145cff' : '#d5dce8')
        : (i < 15 ? '#83a6ff' : '#d5dce8')
      context.fillRect(i * canvas.width / values.length, (80 - height) / 2, 3, height)
    })
  }, [peaks, currentTime, duration])

  const toggleAudio = () => {
    const player = audioRef.current
    if (!player) return
    if (player.paused) void player.play()
    else player.pause()
  }

  return (
    <section aria-label={`${memberName} recording`} className="vocabulary-member-media">
      <div aria-label={`${memberName} video preview`} className="vocabulary-member-video" role="img">
        {canPlayVideo ? <video muted playsInline ref={videoRef}><source src={video.src ?? undefined} /></video> : <img alt="" aria-hidden="true" src="/assets/culture/video-coming-soon.png" />}
      </div>
      <section aria-label={`${memberName} audio player`} className="vocabulary-audio-player">
        <p>{memberName} audio</p>
        {canPlayAudio ? <audio
          onLoadedMetadata={(event) => setLoadedDuration(event.currentTarget.duration)}
          onEnded={() => { setIsPlaying(false); videoRef.current?.pause() }}
          onPause={() => { setIsPlaying(false); videoRef.current?.pause() }}
          onPlay={() => {
            setIsPlaying(true)
            if (videoRef.current) {
              videoRef.current.currentTime = audioRef.current?.currentTime ?? 0
              void videoRef.current.play().catch(() => {})
            }
          }}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} ref={audioRef} src={audio.src ?? undefined} /> : null}
        <div className="vocabulary-audio-player__controls">
          <button aria-label={isPlaying ? `Pause ${memberName} audio` : `Play ${memberName} audio`} disabled={!canPlayAudio} onClick={toggleAudio} type="button">{isPlaying ? <Pause aria-hidden="true" weight="fill" /> : <Play aria-hidden="true" weight="fill" />}</button>
          <div className="vocabulary-audio-player__visual" data-testid="audio-waveform">
            <canvas aria-hidden="true" className="vocabulary-audio-player__waveforms" height={80} ref={canvasRef} width={600} />
            <input aria-label="Audio position" className="vocabulary-audio-player__seek" disabled={!canPlayAudio || !duration} max={duration || 1} min={0} onChange={(event) => {
              const time = Number(event.target.value)
              if (audioRef.current) audioRef.current.currentTime = time
              if (videoRef.current) videoRef.current.currentTime = time
              setCurrentTime(time)
            }} step={0.1} type="range" value={Math.min(currentTime, duration || 1)} />
          </div>
          <output>{canPlayAudio ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Audio coming soon · waveform preview'}</output>
        </div>
      </section>
    </section>
  )
}
