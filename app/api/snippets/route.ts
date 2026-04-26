import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { code, language, theme } = await request.json()

    const id = uuidv4()
    const client = await clientPromise
    const db = client.db('notecode')

    await db.collection('snippets').insertOne({
      id,
      code,
      language,
      theme,
      createdAt: new Date(),
    })

    return Response.json({ id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to save snippet' }, { status: 500 })
  }
}
