import { NoSymbolIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { AiFillPhone } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import user from '../../../images/uses.png'

const RecCandidateCard = (props: any) => {
  const candidate = props.candidate

  return (
    <Link to={`/recruiter/candidates/${candidate.userId}`}>
      <div className='max-w-xs'>
        <div
          className={classNames(
            `relative overflow-hidden bg-white rounded-md group`,
            `border shadow-sm hover:border-emerald-600 group flex flex-col gap-2`
          )}
        >
          <div className='p-2 photo-wrapper'>
            {candidate.blacklist === true ? (
              <div className='flex gap-1 p-1 text-sm font-light text-white bg-black rounded-lg h-fit w-fit opacity-60'>
                <NoSymbolIcon className='items-center w-5 h-5' />
                <span className='hidden transition-all ease-in-out group-hover:inline-block group-focus:inline-block'>
                  Blacklisted
                </span>
              </div>
            ) : (
              <div></div>
            )}
            <img className='w-32 h-32 mx-auto rounded-full' src={candidate.avatar || user} alt='John Doe' />
          </div>
          <div className='p-2'>
            <h3 className='text-xl font-medium leading-8 text-center text-gray-900'>{candidate.fullName}</h3>
            <div className='flex flex-row items-center justify-center'>
              {candidate.information?.skills?.slice(0, 2).map((skill: any, index: any) => (
                <div key={index} className='bg-[#C6DED5] ml-2 text-[#218F6E] text-xs px-2.5 py-0.5 rounded-full'>
                  {skill.label}
                </div>
              ))}
            </div>
            <table className='my-3 text-xs'>
              <tbody>
                <tr>
                  <td className='px-2 py-2 font-semibold text-gray-500'>Phone</td>
                  <td className='px-2 py-2'>{candidate.phone}</td>
                </tr>
                <tr>
                  <td className='px-2 py-2 font-semibold text-gray-500'>Email</td>
                  <td className='px-2 py-2'>{candidate.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecCandidateCard
