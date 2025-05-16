import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { exportLinks } from './export-links'

describe('export links', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'http://example.com/image.jpg',
          }
        }),
      }
    })
  })

  it('should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/report.csv',
        }
      })

    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    const sut = await exportLinks()

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', reject)
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map((line) => line.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'http://example.com/report.csv',
    })
    expect(csvAsArray).toEqual(
      expect.arrayContaining([
        [
          'Original URL',
          'Short Hash',
          'Shortened URL',
          'Access Count',
          'Created At',
        ],
        [
          link1.originalUrl,
          link1.shortHash,
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
        [
          link2.originalUrl,
          link2.shortHash,
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
        [
          link3.originalUrl,
          link3.shortHash,
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
        [
          link4.originalUrl,
          link4.shortHash,
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
        [
          link5.originalUrl,
          link5.shortHash,
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
      ])
    )
  })
})
