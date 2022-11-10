import UserRole from '@/enums/UserRole'

export type SelectedRole = {
  value: Exclude<UserRole, 'OWNER'>
  children: string
}
