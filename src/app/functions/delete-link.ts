import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotFound } from './errors/not-found'

const deleteLinkInput = z.object({
  id: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<NotFound, { deleted: boolean }>> {
  const { id } = deleteLinkInput.parse(input)

  const link = await db.query.link.findFirst({
    where: (link, { eq }) => eq(link.id, id),
  })

  if (!link) {
    return makeLeft(new NotFound())
  }

  await db.delete(schema.link).where(eq(schema.link.id, id))

  return makeRight({
    deleted: true,
  })
}
