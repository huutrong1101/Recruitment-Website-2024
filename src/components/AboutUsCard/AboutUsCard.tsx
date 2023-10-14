interface AboutUsCardProps {
  item: {
    id: number
    title: string
    icon: JSX.Element
  }
}

export default function AboutUsCard({ item }: AboutUsCardProps) {
  return (
    <div key={item.id} className='w-full px-4 mb-8 sm:w-1/2 lg:w-1/4 group'>
      <div className='flex flex-col items-center justify-center gap-2 p-6 text-center bg-white rounded-lg shadow-lg group-hover:bg-emerald-600 group-hover:bg-opacity-5'>
        <div className='p-6 transition-colors duration-500 ease-in-out bg-green-600 rounded-md shadow-sm bg-opacity-5 group-hover:bg-emerald-600'>
          {/* {<PhoneIcon className="w-6 h-6 text-emerald-600 group-hover:text-white" />} */}
          {item.icon}
        </div>
        <p className='font-semibold capitalize'>{item.title}</p>
        <span className='text-gray-500'>Many desktop publishing now use and a search for job.</span>
      </div>
    </div>
  )
}
