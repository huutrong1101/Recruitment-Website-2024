import { TextareaAutosize } from '@mui/material'
import classNames from 'classnames'
import Logo from '../../../images/logo_FPT.png'

interface JobDescriptionWidgetProps {
  companyName: string
  jobRole: string
  publishDate: Date

  logo: {
    src: any
    alt: string
  }
}

export default function AddJobWidget(props: any) {
  const { nameData, setNameData, quantityData, setQuantityData } = props
  return (
    <div className={classNames(`flex flex-row bg-white shadow-sm`, `rounded-xl p-2`, `gap-6 items-center`, `border`)}>
      {/* Logo */}
      <div className={classNames(`w-2/12 flex flex-col items-center justify-center`)}>
        <img className={classNames(`min-w-[64px] w-1/2`)} draggable={false} src={Logo} alt={'image'} />
      </div>
      {/* Information */}
      <form className={classNames(`flex flex-row flex-1 `)}>
        <div className={classNames(`flex flex-col flex-1 font-semibold gap-1`)}>
          <TextareaAutosize
            id='responsibility'
            minRows={1}
            value={nameData}
            className='w-3/5 p-1 text-justify bg-white border rounded-lg resize-none'
            placeholder="Job's Name here..."
            onChange={(event) => setNameData(event.target.value)}
          />
          <div className='inline-flex '>
            <TextareaAutosize
              id='responsibility'
              minRows={1}
              value={quantityData}
              className='inline-flex w-1/5 p-1 text-center bg-white border rounded-lg resize-none'
              onChange={(event) => setQuantityData(event.target.value)}
            />
            <div className='flex items-center justify-center ml-1'>Applicants</div>
          </div>
        </div>
        {/* Right */}

        {/* TODO: change this to from date to date */}
        <div className={`text-zinc-400 text-sm`}></div>
      </form>
    </div>
  )
}
