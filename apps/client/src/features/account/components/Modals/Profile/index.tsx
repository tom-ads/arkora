import { Avatar, HorizontalDivider, TabGroup, TabItem, UserIcon } from '@/components'
import { Modal } from '@/components/Modal'
import { RootState } from '@/stores/store'
import { ModalBaseProps } from '@/types'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ProfileDetailsView, ProfilePasswordView } from './../../Views'

export const ProfileModal = (props: ModalBaseProps): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<'details' | 'password'>('details')

  const { authUser } = useSelector((state: RootState) => ({
    authUser: state.auth.user,
  }))

  return (
    <Modal
      title="Account"
      description="Manage account information"
      isOpen={props.isOpen}
      onClose={props.onClose}
      className="max-w-[500px]"
    >
      <>
        <div className="flex items-center gap-5 mb-2">
          <Avatar className="w-[52px] h-[52px]">
            <UserIcon className="w-6 h-6 text-purple-90" />
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-100">
              {authUser?.firstname} {authUser?.lastname ?? ''}
            </p>
            <span className="font-medium text-sm text-gray-60">{authUser?.role?.name}</span>
          </div>
        </div>

        <div className="mb-8 mt-6">
          <TabGroup className="gap-x-5">
            <TabItem isActive={selectedTab === 'details'} onClick={() => setSelectedTab('details')}>
              Details
            </TabItem>
            <TabItem
              isActive={selectedTab === 'password'}
              onClick={() => setSelectedTab('password')}
            >
              Password
            </TabItem>
          </TabGroup>
          <HorizontalDivider />
        </div>

        {selectedTab === 'details' && <ProfileDetailsView {...props} />}
        {selectedTab === 'password' && <ProfilePasswordView {...props} />}
      </>
    </Modal>
  )
}
