import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotFound } from './errors/not-found'

const getOriginalLinkWithHashSchema = z.object({
  hash: z.string(),
})

type GetOriginalLinkWithHashInput = z.input<
  typeof getOriginalLinkWithHashSchema
>

type GetOriginalLinkWithHashOutput = {
  originalUrl: string
}

export async function getOriginalLinkWithHash(
  input: GetOriginalLinkWithHashInput
): Promise<Either<NotFound, GetOriginalLinkWithHashOutput>> {
  const { hash } = getOriginalLinkWithHashSchema.parse(input)

  const result = await db
    .select({
      originalUrl: schema.link.originalUrl,
      shortHash: schema.link.shortHash,
    })
    .from(schema.link)
    .where(eq(schema.link.shortHash, hash))
    .limit(1)

  if (result.length === 0) {
    return makeLeft(new NotFound())
  }

  const [{ originalUrl }] = result

  return makeRight({
    originalUrl,
  })
}
