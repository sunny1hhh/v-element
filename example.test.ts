import {expect, test} from 'vitest'

test('test common matcher', () => {
    const name = 'viking'
    expect(name).toBe('viking')
})