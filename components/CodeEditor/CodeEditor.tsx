'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import EditorToolbar from '@/components/EditorToolbar/EditorToolbar'
import './CodeEditor.css'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white text-nc-medium text-sm">
      Loading editor…
    </div>
  ),
})

interface CodeEditorProps {
  initialCode: string
  initialLanguage?: string
  initialTheme?: string
  snippetId?: string
}

export default function CodeEditor({
  initialCode,
  initialLanguage = 'html',
  initialTheme = 'vs',
  snippetId,
}: CodeEditorProps) {
  const router = useRouter()
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [theme, setTheme] = useState(initialTheme)
  const [isShared, setIsShared] = useState(!!snippetId)
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const markEdited = () => {
    if (isShared) setIsShared(false)
  }

  const handleCodeChange = (value: string | undefined) => {
    setCode(value ?? '')
    markEdited()
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    markEdited()
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value)
  }

  const handleShare = async () => {
    if (isShared || isSharing) return
    setIsSharing(true)
    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, theme }),
      })
      const data = await res.json()
      if (data.id) {
        setIsShared(true)
        router.push(`/${data.id}`, { scroll: false })
      }
    } catch (err) {
      console.error('Share failed:', err)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isDark = theme === 'vs-dark'

  return (
    <div className={`w-full rounded-2xl overflow-hidden shadow-2xl code-editor${isDark ? ' code-editor--dark' : ''}`}>
      <div className="w-full h-[500px] sm:h-[600px] lg:h-[720px]">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme={isDark ? 'vs-dark' : 'vs'}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: typeof window !== 'undefined' && window.innerWidth >= 640 },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'off',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
          }}
        />
      </div>

      <EditorToolbar
        language={language}
        theme={theme}
        isDark={isDark}
        isShared={isShared}
        isSharing={isSharing}
        copied={copied}
        snippetId={snippetId}
        onLanguageChange={handleLanguageChange}
        onThemeChange={handleThemeChange}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
      />
    </div>
  )
}
