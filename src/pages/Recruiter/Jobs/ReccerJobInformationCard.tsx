import classNames from 'classnames'

export default function RecJobInformationCard({ cardData }: any) {
  return (
    <div
      className={classNames(
        `w-full bg-white shadow-sm px-4 py-6 rounded-xl border sticky top-20`,
        `flex flex-col gap-4`
      )}
    >
      <h1 className={classNames(`font-semibold text-xl`)}>Job Information</h1>
      <div className={classNames(`flex flex-col gap-3`)}>
        {cardData &&
          cardData.map((item: any) => {
            return <JobInformationCardItem icon={item.icon} name={item.name} value={item.value} />
          })}
      </div>
    </div>
  )
}

interface JobInformationCardItemProps {
  icon: React.ReactElement
  name: string
  value: string
}

function JobInformationCardItem({ icon, name, value }: JobInformationCardItemProps) {
  return (
    <div className={classNames(`flex flex-row items-center gap-4`)}>
      <div className={classNames(`w-1/12 mx-2`)}>{icon}</div>
      <div className={classNames(`flex flex-col flex-1`)}>
        <span>{name}</span>
        <span className={classNames(`text-teal-700`)}>{value}</span>
      </div>
    </div>
  )
}
