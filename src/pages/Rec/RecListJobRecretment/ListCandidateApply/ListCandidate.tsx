import React from 'react'
import CandidateCard from '../../../../components/CandidateCard/CandidateCard'

interface ListCandidateProps {
  jobid: string
  listResume: any[]
}

function ListCandidate({ listResume, jobid }: ListCandidateProps) {
  return (
    <div className='flex flex-col gap-3 p-2'>
      {listResume.map((candidate, index) => (
        // Sử dụng candidate và index như những thông tin cần thiết để render CandidateCard
        <CandidateCard key={index} candidate={candidate} jobid={jobid} />
      ))}
    </div>
  )
}

export default ListCandidate
