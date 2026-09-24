import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { VocabularyJourney } from './VocabularyJourney'

const occupationItems = course.vocabulary.filter((item) => item.unitId === 'vocabulary-2')
const countryItems = course.vocabulary.filter((item) => item.unitId === 'vocabulary-1')

afterEach(cleanup)
beforeEach(() => localStorage.clear())

describe('VocabularyJourney', () => {
  it('presents Unit 1 as selectable vocabulary words', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={countryItems} />)

    expect(screen.getByRole('heading', { name: 'Choose a word' })).toBeVisible()
    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*태국.*Thailand/ })
    expect(chooser).toHaveTextContent('Choose vocabulary word')
    expect(screen.getByRole('complementary', { name: 'Ordered vocabulary words' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Vocabulary words' })).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Word navigation' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Word position' })).toBeVisible()
    expect(screen.getByText('Word 1 of 9')).toBeVisible()

    await user.click(chooser)
    expect(screen.getByRole('listbox', { name: 'Vocabulary words' })).toBeVisible()
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: 'Next word' }))
    expect(screen.getByRole('heading', { name: '베트남' })).toBeVisible()
  })

  it('presents every ordered word as a freely selectable bilingual button', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const rail = screen.getByRole('list', { name: 'Vocabulary words' })
    const buttons = within(rail).getAllByRole('button')
    expect(buttons).toHaveLength(9)
    expect(buttons.every((button) => !button.hasAttribute('aria-label'))).toBe(true)
    expect(buttons[0]).toHaveAccessibleName(/학생.*Student.*Now learning/)
    expect(buttons[8]).toHaveAccessibleName(/경찰관.*Police officer/)
    expect(within(buttons[0]).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(buttons[0]).getByText('Student')).toHaveAttribute('lang', 'en')
    expect(buttons[0]).toHaveAttribute('aria-current', 'true')
    expect(within(buttons[0]).getByText('Now learning')).toBeVisible()
  })

  it('lets a beginner choose any bilingual word without unlocking it first', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    await user.click(screen.getByRole('button', { name: /약사.*Pharmacist/ }))

    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(screen.getByRole('heading', { name: '약사' })).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('Pharmacist')).toBeVisible()
    expect(within(details).getByText('yaksa')).toBeVisible()
    expect(screen.getByRole('button', { name: /약사.*Pharmacist.*Now learning/ })).toHaveAttribute('aria-current', 'true')
  })

  it('supports keyboard selection in the compact bilingual listbox', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    expect(chooser).toHaveAttribute('aria-haspopup', 'listbox')
    await user.click(chooser)
    const student = screen.getByRole('option', { name: /학생.*Student/ })
    expect(student).toHaveFocus()

    await user.keyboard('{End}')
    const policeOfficer = screen.getByRole('option', { name: /경찰관.*Police officer/ })
    expect(policeOfficer).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.queryByRole('listbox', { name: 'Vocabulary words' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '경찰관' })).toHaveAttribute('lang', 'ko')
    expect(screen.getByRole('button', { name: /Choose vocabulary word.*경찰관.*Police officer/ })).toHaveFocus()
  })

  it('keeps the listbox mounted while Tab completes native forward focus navigation', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    const desktopRail = screen.getByRole('list', { name: 'Vocabulary words' })
    const firstRailButton = within(desktopRail).getAllByRole('button')[0]
    await user.click(chooser)
    expect(screen.getByRole('option', { name: /학생.*Student/ })).toHaveFocus()

    await user.tab()

    expect(screen.getByRole('listbox', { name: 'Vocabulary words' })).toBeInTheDocument()
    expect(firstRailButton).toHaveFocus()
  })

  it('keeps the listbox mounted while Shift+Tab returns focus to its trigger', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    await user.click(chooser)
    expect(screen.getByRole('option', { name: /학생.*Student/ })).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByRole('listbox', { name: 'Vocabulary words' })).toBeInTheDocument()
    expect(chooser).toHaveFocus()
  })

  it('enables the shared listen control and separate media player for a recorded word', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('button', { name: 'Listen & watch' })).toBeEnabled()
    const audioPlayer = screen.getByRole('region', { name: 'Member 3 audio player' })
    expect(audioPlayer).toHaveTextContent('0:00 / 0:02')
    const waveform = within(audioPlayer).getByTestId('audio-waveform')
    expect(waveform).toBeVisible()
    expect(waveform.querySelector('canvas')).toBeInTheDocument()
    expect(document.querySelector('audio')?.getAttribute('src')).toBe('/media/vocabulary/zhen-long/student.m4a')
    expect(document.querySelector('video source')?.getAttribute('src')).toBe('/media/vocabulary/zhen-long/student.mp4')
    await user.click(screen.getByRole('button', { name: /의사.*Doctor/ }))
    expect(screen.getByRole('button', { name: 'Listen & watch' })).toBeEnabled()
    expect(screen.getByRole('region', { name: 'Member 4 audio player' })).toHaveTextContent('0:00 / 0:01')
    expect(document.querySelector('audio')?.getAttribute('src')).toBe('/media/vocabulary/yi-siang/doctor.m4a')
    expect(document.querySelector('video source')?.getAttribute('src')).toBe('/media/vocabulary/yi-siang/doctor.mp4')
  })

  it('presents assigned country vocabulary with its human recording', () => {
    render(<VocabularyJourney items={countryItems} />)

    expect(screen.getByRole('region', { name: 'Member 1 audio player' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Listen & watch' })).toBeEnabled()
    expect(screen.queryByText(/Course member|Presented by|Member video coming soon/)).not.toBeInTheDocument()
    expect(document.querySelector('audio')?.getAttribute('src')).toBe('/media/vocabulary/xin-chen/thailand.m4a')
    expect(document.querySelector('video source')?.getAttribute('src')).toBe('/media/vocabulary/xin-chen/thailand.mp4')
    expect(screen.getByRole('heading', { name: '태국' })).toHaveAttribute('lang', 'ko')
    expect(screen.getAllByText('Thailand').every((node) => node.getAttribute('lang') === 'en')).toBe(true)
    expect(screen.getAllByRole('img', { name: 'Thailand flag' }).every((flag) => flag.getAttribute('src')?.endsWith('/assets/flags/th.svg'))).toBe(true)
  })

  it('keeps sequential navigation available without completing or persisting words', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('button', { name: 'Previous word' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    expect(screen.getByRole('heading', { name: '선생님' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Previous word' })).toBeEnabled()
    expect(localStorage.length).toBe(0)

    await user.click(screen.getByRole('button', { name: /경찰관.*Police officer/ }))
    expect(screen.getByRole('link', { name: 'All units' })).toHaveAttribute('href', '/vocabulary')
    expect(screen.queryByRole('button', { name: /finish vocabulary|vocabulary complete/i })).not.toBeInTheDocument()
    expect(localStorage.length).toBe(0)
  })

  it('shows every beginner support layer with Korean language metadata', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(screen.getByRole('heading', { name: '학생' })).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('Student')).toBeVisible()
    expect(within(details).getByText('Romanization')).toBeVisible()
    expect(within(details).getByText('haksaeng')).toBeVisible()
    expect(within(details).getByText('Say it like')).toBeVisible()
    expect(within(details).getByText('hak-ssaeng')).toBeVisible()
    expect(within(details).getByText('저는 학생이에요.')).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('I am a student.')).toHaveAttribute('lang', 'en')
    expect(within(details).getByRole('heading', { name: 'Grammar tip' })).toBeVisible()
    const grammarTip = within(details).getByRole('region', { name: 'Grammar tip' })
    expect(grammarTip).toHaveTextContent('학생 ends in a consonant, so use 이에요.')
    expect(within(grammarTip).getAllByText('학생').every((node) => node.lang === 'ko')).toBe(true)
    expect(within(grammarTip).getAllByText('이에요').every((node) => node.lang === 'ko')).toBe(true)
  })

  it('keeps the member video preview separate from the bilingual word example', () => {
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByLabelText('Member 3 video preview')).toBeVisible()
    expect(screen.getByText('저는 학생이에요.')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('I am a student.')).toHaveAttribute('lang', 'en')
  })

  it('uses an honest passive preview and disabled audio controls when recordings are missing', () => {
    const missingStudent = {
      ...occupationItems[0],
      video: { src: null, kind: 'development-missing' as const },
      audio: { src: null, kind: 'development-missing' as const },
    }
    render(<VocabularyJourney items={[missingStudent]} />)

    expect(screen.getByLabelText('Member 3 video preview')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Listen & watch' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Play Member 3 audio' })).toBeDisabled()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('does not introduce a second page-level heading inside Learn', () => {
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('keeps an empty lesson honest without creating a page-level heading', () => {
    render(<VocabularyJourney items={[]} />)

    expect(screen.getByRole('heading', { name: 'Vocabulary unavailable' })).toBeVisible()
    expect(screen.getByText('There are no words in this lesson yet. Choose another lesson from All lessons.')).toBeVisible()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })
})
