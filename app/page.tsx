import PageLayout from '@/components/PageLayout/PageLayout'
import CodeEditor from '@/components/CodeEditor/CodeEditor'
import { DEFAULT_HTML } from '@/lib/constants'

export default function Home() {
  return (
    <PageLayout>
      <div className="w-full max-w-4xl">
        <CodeEditor initialCode={DEFAULT_HTML} />
      </div>
    </PageLayout>
  )
}
