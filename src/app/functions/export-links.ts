import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { env } from '@/env'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'
import { stringify } from 'csv-stringify'
import { sql } from 'drizzle-orm'

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {
  const { sql: rawSql, params } = db
    .select({
      originalUrl: schema.link.originalUrl,
      shortHash: schema.link.shortHash,
      shortenedUrl:
        sql<string>`${env.SHORTENER_BASE_URL} || ${schema.link.shortHash}`.as(
          'shortened_url'
        ),
      accessCount: schema.link.accessCount,
      createdAt: schema.link.createdAt,
    })
    .from(schema.link)
    .toSQL()

  const cursor = pg.unsafe(rawSql, params as string[]).cursor(50)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'original_url', header: 'Original URL' },
      { key: 'short_hash', header: 'Short Hash' },
      { key: 'shortened_url', header: 'Shortened URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created At' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, controller, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }
        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  await convertToCSVPipeline

  return makeRight({ reportUrl: url })
}
