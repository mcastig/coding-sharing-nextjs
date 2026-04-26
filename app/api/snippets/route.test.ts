/**
 * @jest-environment node
 */

import { POST } from './route'

jest.mock('uuid', () => ({ v4: () => 'mock-uuid-1234' }))

jest.mock('@/lib/mongodb', () => {
  const insertOne = jest.fn()
  return {
    __esModule: true,
    default: Promise.resolve({
      db: () => ({ collection: () => ({ insertOne }) }),
    }),
    __insertOne: insertOne,
  }
})

const getInsertOne = () =>
  (jest.requireMock('@/lib/mongodb') as { __insertOne: jest.Mock }).__insertOne

describe('POST /api/snippets', () => {
  beforeEach(() => jest.clearAllMocks())

  it('saves snippet and returns 201 with the generated id', async () => {
    getInsertOne().mockResolvedValueOnce({ insertedId: 'mongo-id' })

    const req = new Request('http://localhost/api/snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '<h1>Hi</h1>', language: 'html', theme: 'vs' }),
    })

    const res = await POST(req as never)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toEqual({ id: 'mock-uuid-1234' })
    expect(getInsertOne()).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-uuid-1234',
        code: '<h1>Hi</h1>',
        language: 'html',
        theme: 'vs',
      })
    )
  })

  it('returns 500 when the database throws', async () => {
    getInsertOne().mockRejectedValueOnce(new Error('DB error'))

    const req = new Request('http://localhost/api/snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '', language: 'html', theme: 'vs' }),
    })

    const res = await POST(req as never)
    expect(res.status).toBe(500)
  })
})
