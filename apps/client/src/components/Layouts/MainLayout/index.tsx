import { Header } from '@/components/Header'
import { Outlet } from 'react-router-dom'

export const MainLayout = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow h-full">
      <Header />
      <div className="max-w-[889px] px-8 mx-auto w-full h-full">
        <Outlet />
      </div>
    </div>
  )
}
