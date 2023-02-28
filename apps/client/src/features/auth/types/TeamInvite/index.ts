import UserRole from '@/enums/UserRole'

export type SelectedRole = Exclude<UserRole, 'OWNER'>
