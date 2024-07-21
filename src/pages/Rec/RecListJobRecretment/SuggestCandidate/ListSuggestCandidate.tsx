import SuggestCandidateCard from '../../../../components/CandidateCard/SuggestCandidateCard'

interface ListCandidateProps {
  jobid: string
  listResume: any[]
}

function ListSuggestCandidate({ listResume, jobid }: ListCandidateProps) {
  console.log({ listResume })
  return (
    <div className='flex flex-col gap-3 p-2'>
      {listResume.map((candidate, index) => (
        // Sử dụng candidate và index như những thông tin cần thiết để render CandidateCard
        <SuggestCandidateCard key={index} candidate={candidate} jobid={jobid} />
      ))}
    </div>
  )
}

export default ListSuggestCandidate
