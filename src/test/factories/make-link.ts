import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.link>>
) {
  const originalUrl = faker.internet.url()
  const shortHash = nanoid(8)
  const accessCount = faker.number.int({ min: 0, max: 100 })

  const result = await db
    .insert(schema.link)
    .values({
      originalUrl,
      shortHash,
      accessCount,
      ...overrides,
    })
    .returning()

  return result[0]
}
