import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('notecode')

    const snippet = await db.collection('snippets').findOne({ id })

    if (!snippet) {
      return Response.json({ error: 'Snippet not found' }, { status: 404 })
    }

    return Response.json({
      id: snippet.id,
      code: snippet.code,
      language: snippet.language,
      theme: snippet.theme,
    })
  } catch {
    return Response.json({ error: 'Failed to retrieve snippet' }, { status: 500 })
  }
}
