import Image from 'next/image'
import { LANGUAGES, THEMES } from '@/lib/constants'
import './EditorToolbar.css'

interface EditorToolbarProps {
  language: string
  theme: string
  isDark: boolean
  isShared: boolean
  isSharing: boolean
  copied: boolean
  snippetId?: string
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onThemeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onShare: () => void
  onCopyLink: () => void
}

export default function EditorToolbar({
  language,
  theme,
  isDark,
  isShared,
  isSharing,
  copied,
  snippetId,
  onLanguageChange,
  onThemeChange,
  onShare,
  onCopyLink,
}: EditorToolbarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-4 py-3 toolbar${isDark ? ' toolbar--dark' : ''}`}>
      {/* Language & Theme selectors */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <select
            value={language}
            onChange={onLanguageChange}
            className="appearance-none w-full sm:w-auto pl-3 pr-7 py-1.5 text-sm font-semibold rounded-full cursor-pointer focus:outline-none toolbar-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <Image src="/down-arrow.svg" alt="" width={16} height={16} />
          </div>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <select
            value={theme}
            onChange={onThemeChange}
            className="appearance-none w-full sm:w-auto pl-3 pr-7 py-1.5 text-sm font-semibold rounded-full cursor-pointer focus:outline-none toolbar-select"
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <Image src="/down-arrow.svg" alt="" width={16} height={16} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isShared && snippetId && (
          <button
            onClick={onCopyLink}
            title={copied ? 'Copied!' : 'Copy link'}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 toolbar-copy-btn"
          >
            <Image src="/link.svg" alt="" width={16} height={16} />
            <span className="toolbar-copy-url">…/{snippetId}</span>
          </button>
        )}

        <button
          onClick={onShare}
          disabled={isShared || isSharing}
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-md font-semibold text-white disabled:cursor-not-allowed hover:opacity-90 toolbar-share-btn"
        >
          <Image src="/Share.svg" alt="" width={16} height={16} />
          <span>{isSharing ? 'Sharing…' : 'Share'}</span>
        </button>
      </div>
    </div>
  )
}
