import { Pause, Play, Waveform } from '@phosphor-icons/react'
import { useState, type RefObject } from 'react'
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
  const canPlayAudio = hasPlayableSource(audio)
  const canPlayVideo = hasPlayableSource(video)
  const duration = audio.durationSeconds ?? 0

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
        {canPlayAudio ? <audio onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} ref={audioRef} src={audio.src ?? undefined} /> : null}
        <div className="vocabulary-audio-player__controls">
          <button aria-label={isPlaying ? `Pause ${memberName} audio` : `Play ${memberName} audio`} disabled={!canPlayAudio} onClick={toggleAudio} type="button">{isPlaying ? <Pause aria-hidden="true" weight="fill" /> : <Play aria-hidden="true" weight="fill" />}</button>
          <div className="vocabulary-audio-player__visual" data-testid="audio-waveform">
            <div aria-hidden="true" className="vocabulary-audio-player__waveforms">
              {Array.from({ length: 6 }, (_, index) => <Waveform key={index} weight={index < 3 ? 'duotone' : 'light'} />)}
            </div>
            <div className="vocabulary-audio-player__track"><span style={{ width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%` }} /></div>
          </div>
          <output>{canPlayAudio ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Audio coming soon'}</output>
        </div>
      </section>
    </section>
  )
}
