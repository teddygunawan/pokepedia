import { actions, state } from '@/store/pokemons.js'
let url = 'https://pokeapi.co/api/v2/pokemon/'
let body = {}
const commit = jest.fn()
const dispatch = jest.fn()

jest.mock('axios', () => ({
  get: (_url, _body) => {
    return new Promise((resolve) => {
      url = _url
      body = _body
      resolve(true)
    })
  }
}))

describe('Fetch Many Pokemons', () => {
  it('Fetching many pokemons from API, synchronize the data and comit all of the data at once', async () => {
    await actions.fetchManyPokemons({ state, dispatch, commit })

    expect(url).toBe('https://pokeapi.co/api/v2/pokemon/')
    expect(body).toEqual({})
    expect(commit).toHaveBeenCalledWith(
      'TOGGLE_LOADING', true,
    )
    expect(commit).toHaveBeenCalledWith(
      'APPEND_POKEMONS', {},
    )
    expect(commit).toHaveBeenCalledWith(
      'TOGGLE_LOADING', false
    )
  })
})