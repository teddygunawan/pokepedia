import { mount, RouterLinkStub } from '@vue/test-utils'
import BasePokemonCard from '@/components/pokemons/BasePokemonCard.vue'

const pokemon = {
  'id': 1,
  'image': 'https://pokeres.bastionbot.org/images/pokemon/1',
  'name': 'bulbasaur',
  'types': []
}

describe('BasePokemonCard', () => {
  test('renders correctly', () => {
    const wrapper = mount(BasePokemonCard, {
      propsData: {
        pokemon: pokemon
      },
      stubs: {
        NuxtLink: RouterLinkStub
      }
    })
    expect(wrapper.find('.pokemon-image').exists()).toBeTruthy()
  })
})
