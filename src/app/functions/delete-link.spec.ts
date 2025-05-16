import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { deleteLink } from './delete-link'
import { NotFound } from './errors/not-found'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const link = await makeLink()

    const sut = await deleteLink({
      id: link.id,
    })

    expect(isRight(sut)).toBe(true)
  })

  it('should not be able to crate a link with invalid url', async () => {
    const sut = await deleteLink({
      id: 'invalid-id',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotFound)
  })
})
