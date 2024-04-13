import React from 'react'

function CompanyInfoWidget() {
  return (
    <div className='flex flex-col gap-8 px-8 py-8 text-justify bg-white border shadow-sm rounded-xl'>
      <div>
        <h1 className='text-2xl font-semibold capitalize'>GIỚI THIỆU CÔNG TY</h1>
        <p className='mt-2 whitespace-pre-line'>
          Được thành lập tại Santa Clara, California vào năm 2007, V-Probes Holdings Co., Ltd cung cấp dịch vụ thiết kế
          và sản xuất Thẻ thăm dò cho các công ty bán dẫn lớn trên thế giới.
        </p>
      </div>
      <div>
        <h1 className='text-2xl font-semibold capitalize'>LĨNH VỰC HOẠT ĐỘNG</h1>
        <p className='mt-2 whitespace-pre-line'>Công nghệ cao</p>
      </div>
    </div>
  )
}

export default CompanyInfoWidget
