import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { InvalidUrl } from './errors/invalid-url'

const createLinkInput = z.object({
  originalUrl: z.string().url(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<InvalidUrl, { shortHash: string }>> {
  const { success, data } = createLinkInput.safeParse(input)

  if (!success) {
    return makeLeft(new InvalidUrl())
  }

  const { originalUrl } = data

  const shortHash = nanoid(8)

  await db.insert(schema.link).values({
    originalUrl,
    shortHash,
  })

  return makeRight({
    shortHash,
  })
}
