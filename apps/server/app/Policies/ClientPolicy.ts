import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import Client from 'App/Models/Client'
import User from 'App/Models/User'

export default class ClientPolicy extends BasePolicy {
  public async index(authUser: User) {
    if (!authUser || !authUser?.role?.name) {
      return false
    }

    if (authUser.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  public async create(authUser: User) {
    if (!authUser || !authUser?.role?.name) {
      return false
    }

    if (authUser?.role?.name === UserRole.MEMBER || authUser?.role?.name === UserRole.MANAGER) {
      return false
    }

    return true
  }

  public async view(authUser: User, client: Client) {
    if (!authUser || !authUser?.role?.name || !client) {
      return false
    }

    if (authUser?.organisationId !== client?.organisationId) {
      return false
    }

    if (authUser?.role?.name === UserRole.MEMBER || authUser?.role?.name === UserRole.MANAGER) {
      return false
    }

    return true
  }

  public async update(authUser: User, client: Client) {
    if (!authUser || !authUser?.role?.name || !client) {
      return false
    }

    if (authUser.organisationId !== client.organisationId) {
      return false
    }

    if (authUser?.role?.name === UserRole.MEMBER || authUser?.role?.name === UserRole.MANAGER) {
      return false
    }

    return true
  }

  public async delete(authUser: User, client: Client) {
    if (!authUser || !authUser?.role?.name || !client) {
      return false
    }

    if (authUser.organisationId !== client.organisationId) {
      return false
    }

    if (authUser?.role?.name === UserRole.MEMBER || authUser?.role?.name === UserRole.MANAGER) {
      return false
    }

    return true
  }
}
