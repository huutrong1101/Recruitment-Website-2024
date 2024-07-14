import classNames from 'classnames'
import JobInformationCard from '../JobInformationCard'
import { AdminJobInterface, JobInterface } from '../../../types/job.type'
import parse from 'html-react-parser'
import { Button, Modal, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import { useAppSelector } from '../../../hooks/hooks'

interface JobProps {
  job: JobInterface
  jobInformation: { icon: JSX.Element; name: string; value: string }[]
}

function JobDetailWidget({ job, jobInformation }: JobProps) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { admin } = useAppSelector((state) => state.Auth)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
      {/* Left side description */}
      <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
        <div
          className={classNames(
            `border bg-white shadow-sm rounded-xl flex flex-col gap-8`,
            `px-8 py-8`,
            `text-justify`
          )}
        >
          {admin &&
            (job.acceptanceStatus === 'decline' ? (
              <Tooltip placement='top' title={'Xem lí do'} arrow={true}>
                <Tag
                  color={'error'}
                  className='w-1/5 py-1 font-medium text-center uppercase cursor-pointer'
                  onClick={showModal}
                >
                  Không được duyệt
                </Tag>
              </Tooltip>
            ) : (
              <Tag
                color={`${job.acceptanceStatus === 'accept' ? 'success' : 'default'}`}
                className='w-1/5 py-1 font-medium text-center uppercase'
              >
                {job.acceptanceStatus === 'accept' ? 'Đã duyệt' : 'Đang chờ duyệt'}
              </Tag>
            ))}

          <div>
            <h1 className='text-2xl font-semibold capitalize'>Chi tiết công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.description)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Yêu cầu công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.requirement)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Quyền lợi</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.benefit)}</p>
          </div>
        </div>
      </div>

      {/* Right side description */}
      <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
        <JobInformationCard cardData={jobInformation} jobId={job._id} />
      </div>

      <Modal
        title='Lý do không được duyệt'
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleCancel}>
            OK
          </Button>
        ]}
      >
        <p>{job.reasonDecline}</p>
      </Modal>
    </div>
  )
}

export default JobDetailWidget
