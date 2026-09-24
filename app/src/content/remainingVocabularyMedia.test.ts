import { describe, expect, it } from 'vitest'
import { course } from './course'

const expectedRecordings = [
  ['thailand', 'member-1', 'xin-chen', 2.07],
  ['vietnam', 'member-1', 'xin-chen', 3.05],
  ['philippines', 'member-1', 'xin-chen', 3.39],
  ['singapore', 'member-1', 'xin-chen', 3.6],
  ['indonesia', 'member-2', 'wei-qi', 2.56],
  ['spain', 'member-2', 'wei-qi', 2.32],
  ['italy', 'member-2', 'wei-qi', 1.51],
  ['brazil', 'member-2', 'wei-qi', 1.91],
  ['new-zealand', 'member-2', 'wei-qi', 2.44],
  ['student', 'member-3', 'zhen-long', 2.6],
  ['teacher', 'member-3', 'zhen-long', 1.98],
  ['engineer', 'member-3', 'zhen-long', 2.86],
  ['designer', 'member-3', 'zhen-long', 2.32],
] as const

describe('remaining vocabulary recordings', () => {
  it.each(expectedRecordings)(
    'connects %s to its assigned member video and audio',
    (id, ownerId, memberSlug, durationSeconds) => {
      const item = course.vocabulary.find((entry) => entry.id === id)

      expect(item).toMatchObject({
        ownerId,
        video: {
          kind: 'human-recording',
          src: `/media/vocabulary/${memberSlug}/${id}.mp4`,
          durationSeconds,
        },
        audio: {
          kind: 'human-recording',
          src: `/media/vocabulary/${memberSlug}/${id}.m4a`,
          durationSeconds,
        },
      })
    },
  )
})
