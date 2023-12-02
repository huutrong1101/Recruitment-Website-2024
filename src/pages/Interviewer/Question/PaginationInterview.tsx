import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from './ManageQuestion'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function PaginationInterview({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    if (pageSize) {
      return Array(pageSize)
        .fill(0)
        .map((_, index) => {
          const pageNumber = index + 1
          return (
            <li key={index}>
              <Link
                to={{
                  pathname: '/interviewer/question',
                  search: createSearchParams({
                    ...queryConfig,
                    page: pageNumber.toString()
                  }).toString()
                }}
                key={index}
                className={classNames(
                  'mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm hover:bg-zinc-100',
                  {
                    'border-cyan-500': pageNumber === page,
                    'border-transparent': pageNumber !== page
                  }
                )}
              >
                {pageNumber}
              </Link>
            </li>
          )
        })
    }
  }

  return (
    <>
      <nav aria-label='Page navigation example' className='flex items-center justify-center'>
        <ul className='flex items-center justify-center list-style-none '>
          <li>
            {page === 1 ? (
              <span className='px-3 py-2 mx-2 border rounded shadow-sm cursor-not-allowed bg-white/60 '>Prev</span>
            ) : (
              <Link
                to={{
                  pathname: '/interviewer/question',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer hover:bg-zinc-100'
              >
                Prev
              </Link>
            )}
          </li>

          {renderPagination()}

          <li>
            {page === pageSize ? (
              <button className='px-3 py-2 mx-2 border rounded shadow-sm cursor-not-allowed bg-white/60 '>Next</button>
            ) : (
              <Link
                to={{
                  pathname: '/interviewer/question',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer hover:bg-zinc-100'
              >
                Next
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  )
}
