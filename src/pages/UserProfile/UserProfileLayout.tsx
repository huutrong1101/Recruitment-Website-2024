import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  prepareCandidateProvider,
  prepareOtherProvider,
  prepareRecruiterProvider,
  prepareRecruiterProviderConfirm
} from '../../utils/NavigateMenu'
import Container from '../../components/Container/Container'
import { useAppSelector } from '../../hooks/hooks'

export default function UserProfileLayout() {
  const { recruiter, loading } = useAppSelector((app) => app.Auth)
  const [asideMenuItems, setAsideMenuItems] = useState<any[]>([])
  const { pathname } = useLocation()

  useEffect(() => {
    if (loading === 'success' && recruiter) {
      const supplyMenuItems =
        recruiter.role === 'CANDIDATE'
          ? prepareCandidateProvider()
          : recruiter.role === 'RECRUITER'
            ? recruiter.acceptanceStatus !== 'waiting'
              ? prepareRecruiterProviderConfirm()
              : prepareRecruiterProvider()
            : prepareOtherProvider()
      // const supplyMenuItems: any[] = prepareCandidateProvider()

      setAsideMenuItems(supplyMenuItems)
    }
  }, [loading, recruiter])

  return (
    <Container>
      <div className={classNames(`flex flex-col md:flex-row mb-4 gap-6`)}>
        {/* Right aside */}
        <div className={classNames(`w-full md:w-3/12 relative`)}>
          <div
            className={classNames(
              `md:min-h-[40vh] bg-zinc-100 text-zinc-600 rounded-xl shadow-sm flex flex-col gap-0`,
              `sticky top-4 px-2 py-2`
            )}
          >
            {asideMenuItems.map((item) => {
              return (
                <Link
                  to={item.url}
                  key={item.url}
                  className={classNames(
                    `px-2 py-2 flex flex-row items-center gap-4 text-base group`,
                    `transition-colors ease-in-out duration-100 rounded-xl`,
                    { 'bg-black/10 text-emerald-500': item.url === pathname }
                  )}
                >
                  <span
                    className={classNames(`group-hover:text-emerald-700`, `transition-colors ease-in-out duration-100`)}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={classNames(
                      `group-hover:text-emerald-700 font-semibold`,
                      `transition-colors ease-in-out duration-100`
                    )}
                  >
                    {item.text}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <Outlet />
      </div>
    </Container>
  )
}
