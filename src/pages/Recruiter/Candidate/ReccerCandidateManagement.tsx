import classNames from 'classnames'
import { isEqual, isUndefined, omitBy } from 'lodash'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import useQueryParams from '../../../hooks/useQueryParams'

const ReccerCandidateManagement = () => {
  return (
    <>
      <h1>Recruiter Candidate</h1>
    </>
  )
}

export default ReccerCandidateManagement
