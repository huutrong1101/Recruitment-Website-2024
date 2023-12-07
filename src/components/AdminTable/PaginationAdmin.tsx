import React from 'react'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { QueryConfig } from './AdminTable'
import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2

export default function PaginationAdmin({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPaginationAcountlist = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <Button variant='outlined' size='sm'>
            <button key={index} className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer'>
              ...
            </button>
          </Button>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <Button variant='outlined' size='sm'>
            <span key={index} className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer'>
              ...
            </span>
          </Button>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Button variant='outlined' size='sm'>
            <Link
              to={{
                pathname: '',
                search: createSearchParams({
                  ...queryConfig,
                  page: pageNumber.toString()
                }).toString()
              }}
              key={index}
              //   className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              //     'border-cyan-500': pageNumber === page,
              //     'border-transparent': pageNumber !== page
              //   })}
            >
              {pageNumber}
            </Link>
          </Button>
        )
      })
  }

  return (
    <>
      <Button variant='outlined' size='sm'>
        <Link
          to={{
            pathname: '',
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}

          //   className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
          //     'border-cyan-500': pageNumber === page,
          //     'border-transparent': pageNumber !== page
          //   })}
        >
          Previous
        </Link>
      </Button>
      {renderPaginationAcountlist()}
      <Button variant='outlined' size='sm'>
        <Link
          to={{
            pathname: '',
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}

          //   className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
          //     'border-cyan-500': pageNumber === page,
          //     'border-transparent': pageNumber !== page
          //   })}
        >
          Next
        </Link>
      </Button>
    </>
  )
}
