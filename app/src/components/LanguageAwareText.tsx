import { Fragment } from 'react'

type LanguageAwareTextProps = {
  text: string
}

const hangulRun = /([ㄱ-ㅎㅏ-ㅣ가-힣]+)/g
const containsHangul = /[ㄱ-ㅎㅏ-ㅣ가-힣]/

export function LanguageAwareText({ text }: LanguageAwareTextProps) {
  return text.split(hangulRun).filter(Boolean).map((run, index) => {
    if (containsHangul.test(run)) {
      return <span className="language-aware-text__ko" data-korean-content key={`${index}-${run}`} lang="ko">{run}</span>
    }

    const [, leadingWhitespace, englishText, trailingWhitespace] = run.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? []

    return (
      <Fragment key={`${index}-${run}`}>
        {leadingWhitespace}
        {englishText ? <span lang="en">{englishText}</span> : null}
        {trailingWhitespace}
      </Fragment>
    )
  })
}
