import { Header } from '@/components/Header'
import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export const MainLayout = (): JSX.Element => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="relative flex flex-col flex-grow h-full">
      <Header />
      <main
        className={classNames('mx-auto w-full h-full', {
          'max-w-[889px] px-8': !isAuthenticated,
          'max-w-[1440px] mx-auto px-[46px]': isAuthenticated,
        })}
      >
        <Outlet />
      </main>
    </div>
  )
}
