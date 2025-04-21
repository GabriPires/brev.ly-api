import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const link = pgTable('link', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
