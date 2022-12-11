import Role from 'App/Models/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserRole from 'App/Enum/UserRole'

export default Factory.define(Role, () => {
  return {
    name: UserRole.OWNER,
  }
})
  .state('member', (state) => (state.name = UserRole.MEMBER))
  .state('manager', (state) => (state.name = UserRole.MANAGER))
  .state('orgAdmin', (state) => (state.name = UserRole.ORG_ADMIN))
  .build()
