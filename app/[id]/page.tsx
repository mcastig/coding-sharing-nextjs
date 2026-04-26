import { notFound } from 'next/navigation'
import clientPromise from '@/lib/mongodb'
import PageLayout from '@/components/PageLayout/PageLayout'
import CodeEditor from '@/components/CodeEditor/CodeEditor'

interface Props {
  params: Promise<{ id: string }>
}

async function getSnippet(id: string) {
  const client = await clientPromise
  const db = client.db('notecode')
  return db.collection('snippets').findOne({ id })
}

export default async function SnippetPage({ params }: Props) {
  const { id } = await params

  let snippet
  try {
    snippet = await getSnippet(id)
  } catch {
    notFound()
  }

  if (!snippet) notFound()

  return (
    <PageLayout>
      <div className="w-full max-w-4xl">
        <CodeEditor
          initialCode={snippet!.code as string}
          initialLanguage={snippet!.language as string}
          initialTheme={snippet!.theme as string}
          snippetId={id}
        />
      </div>
    </PageLayout>
  )
}
