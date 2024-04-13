export default function FeaturedRecruiter() {
  const listImg = [
    {
      id: 1,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    },
    {
      id: 2,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    },
    {
      id: 3,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    },
    {
      id: 4,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    },
    {
      id: 5,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    },
    {
      id: 6,
      link: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
    }
  ]
  return (
    <div className='mt-[40px] md:mt-[80px]'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold tracking-wider text-center'>NHÀ TUYỂN DỤNG NỔI BẬT</h3>
      </div>
      <div className='flex flex-wrap items-center justify-center -mx-4 mt-[10px]'>
        {listImg.slice(0, 6).map((item) => (
          <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/4' key={item.id}>
            <img src={item.link} alt='' />
          </div>
        ))}
      </div>
    </div>
  )
}
