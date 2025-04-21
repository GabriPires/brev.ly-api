import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'

interface GetLinksOutput {
  links: {
    id: string
    originalUrl: string
    shortHash: string
    accessCount: number
  }[]
}

export async function getLinks(): Promise<Either<null, GetLinksOutput>> {
  const result = await db
    .select({
      id: schema.link.id,
      originalUrl: schema.link.originalUrl,
      shortHash: schema.link.shortHash,
      accessCount: schema.link.accessCount,
    })
    .from(schema.link)

  return makeRight({
    links: result,
  })
}
