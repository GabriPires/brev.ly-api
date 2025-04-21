import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/makeLink'
import { describe, expect, it } from 'vitest'
import { getLinks } from './get-links'

describe('get links', () => {
  it('should be able to retrieve original link', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()

    const sut = await getLinks()

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: link1.id,
        }),
        expect.objectContaining({
          id: link2.id,
        }),
        expect.objectContaining({
          id: link3.id,
        }),
      ])
    )
  })
})
