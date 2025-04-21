import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { InvalidUrl } from './errors/invalid-url'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const sut = await createLink({
      originalUrl: 'https://example.com',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toMatchObject({
      shortHash: expect.any(String),
    })
  })

  it('should not be able to crate a link with invalid url', async () => {
    const sut = await createLink({
      originalUrl: 'invalid-url',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidUrl)
  })
})
