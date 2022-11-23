import Role from 'App/Models/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserRole from 'App/Enum/UserRole'

export default Factory.define(Role, () => {
  return {
    name: UserRole.OWNER,
  }
}).build()
