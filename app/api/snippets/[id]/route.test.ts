/**
 * @jest-environment node
 */

import { GET } from './route'

jest.mock('@/lib/mongodb', () => {
  const findOne = jest.fn()
  return {
    __esModule: true,
    default: Promise.resolve({
      db: () => ({ collection: () => ({ findOne }) }),
    }),
    __findOne: findOne,
  }
})

const getFindOne = () =>
  (jest.requireMock('@/lib/mongodb') as { __findOne: jest.Mock }).__findOne

describe('GET /api/snippets/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns snippet data with status 200 when found', async () => {
    getFindOne().mockResolvedValueOnce({
      id: 'abc123',
      code: '<h1>Hello</h1>',
      language: 'html',
      theme: 'vs',
    })

    const req = new Request('http://localhost/api/snippets/abc123')
    const res = await GET(req as never, { params: Promise.resolve({ id: 'abc123' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({
      id: 'abc123',
      code: '<h1>Hello</h1>',
      language: 'html',
      theme: 'vs',
    })
  })

  it('returns 404 when the snippet does not exist', async () => {
    getFindOne().mockResolvedValueOnce(null)

    const req = new Request('http://localhost/api/snippets/missing')
    const res = await GET(req as never, { params: Promise.resolve({ id: 'missing' }) })

    expect(res.status).toBe(404)
  })

  it('returns 500 when the database throws', async () => {
    getFindOne().mockRejectedValueOnce(new Error('DB error'))

    const req = new Request('http://localhost/api/snippets/err')
    const res = await GET(req as never, { params: Promise.resolve({ id: 'err' }) })

    expect(res.status).toBe(500)
  })
})
