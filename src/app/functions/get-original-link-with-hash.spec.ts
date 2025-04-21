import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/makeLink'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { InvalidUrl } from './errors/invalid-url'
import { NotFound } from './errors/not-found'
import { getOriginalLinkWithHash } from './get-original-link-with-hash'

describe('get original link with hash', () => {
  it('should be able to retrieve original link', async () => {
    const link = await makeLink()

    const sut = await getOriginalLinkWithHash({
      hash: link.shortHash,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toMatchObject({
      originalUrl: link.originalUrl,
    })
  })

  it('should not be able to retrieve a original link with a invalid hash', async () => {
    const sut = await getOriginalLinkWithHash({
      hash: 'invalid-hash',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotFound)
  })
})
