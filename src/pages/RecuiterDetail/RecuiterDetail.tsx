import React, { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import classNames from 'classnames'
import {
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  MapIcon,
  MapPinIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Pagination, Select } from 'antd'
import { Link } from 'react-router-dom'
import { HiHeart } from 'react-icons/hi2'
import RecJobCard from '../../components/JobCard/RecJobCard'
import RecJobRealtedCard from '../../components/JobCard/RecJobRealtedCard'
import GoogleMapReact from 'google-map-react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'

interface MarkerProps {
  text: React.ReactNode
}

const AnyReactComponent = (props: { lat: number; lng: number; text: React.ReactNode }) => <div>{props.text}</div>

function RecuiterDetail() {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const result = await geocodeByAddress(
          'Tòa nhà Petronas lầu 8, 235 Nguyễn Văn Cừ, p.Nguyễn Cư Trinh, Quận 1, TP HCM'
        )
        const lnglat = await getLatLng(result[0])
        setCoords(lnglat)
      } catch (error) {
        console.error('Error fetching coordinates: ', error)
      }
    }

    fetchCoords()
  }, [])

  return (
    <Container>
      <div className='flex flex-col gap-12 md:flex-row'>
        <div
          className={classNames(
            `flex flex-row bg-white shadow-sm`,
            `rounded-xl`,
            `items-center`,
            `border w-full md:w-full`,
            `flex flex-col`
          )}
        >
          <div className={classNames('w-full shadow relative')}>
            <img
              src='https://static.topcv.vn/company_covers/cong-ty-tnhh-mtv-vien-thong-quoc-te-fpt-d3875e922aae8e448c57c760a55305ca-617fa613e3ddf.jpg'
              alt='blog_image'
              className={classNames('w-full h-[200px] object-center object-cover aspect-video rounded-t-md')}
            />
            <img
              className='absolute bottom-[-50px] left-[50px] w-32 h-32 border-2 rounded-full'
              src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
              alt=''
            />
          </div>
          <div className='flex items-center w-full gap-3 bg-emerald-500'>
            <div className='w-1/6'></div>
            <div className='flex items-center justify-between w-5/6 p-5'>
              <div className='flex flex-col gap-3 text-white'>
                <h1 className='text-lg font-bold'>Công Ty TNHH Bảo Hiểm Nhân Thọ AIA (Việt Nam)</h1>
                <div className='flex flex-row gap-10 text-base'>
                  <div className='flex items-center gap-1'>
                    <GlobeAltIcon className='w-4 h-4' />
                    <p>https://www.aia.com.vn/vi/index.html</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <BuildingLibraryIcon className='w-4 h-4' />
                    <p>1000+ nhân viên</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <UserGroupIcon className='w-4 h-4' />
                    <p>227 người theo dõi</p>
                  </div>
                </div>
              </div>
              <div>
                <button className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}>
                  Theo dõi công ty
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(`flex flex-col md:flex-row gap-12 mt-8 mb-8`)}>
        <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
          {/* GIỚI THIỆU CÔNG TY  */}
          <div className={classNames('w-full shadow')}>
            <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
              <h2 className='text-lg font-semibold text-white'>Giới thiệu công ty</h2>
            </div>
            <div className='p-6'>
              AIA VIỆT NAM Gần một thế kỷ qua, AIA đã phục vụ cho nhu cầu không ngừng đổi thay của hàng triệu người dân
              khắp khu vực Châu Á – Thái Bình Dương. AIA Việt Nam là thành viên của Tập đoàn AIA - tập đoàn bảo hiểm
              nhân thọ độc lập, có nguồn gốc châu Á lớn nhất thế giới được niêm yết.
            </div>
          </div>

          {/* TUYỂN DỤNG  */}
          <div className={classNames('w-full shadow')}>
            <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
              <h2 className='text-lg font-semibold text-white'>Tuyển dụng</h2>
            </div>
            <div className='p-6'>
              <div className='flex gap-2'>
                <Input
                  size='middle'
                  placeholder='Tìm kiếm theo tên'
                  prefix={<UserCircleIcon />}
                  className='w-full'
                  type='text'
                  style={{ width: '50%' }}
                />
                <Select
                  showSearch
                  style={{ width: '30%' }}
                  placeholder='Tất cả tỉnh/thành phố'
                  optionFilterProp='children'
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                    {
                      value: '1',
                      label: 'Not Identified'
                    },
                    {
                      value: '2',
                      label: 'Closed'
                    },
                    {
                      value: '3',
                      label: 'Communicated'
                    },
                    {
                      value: '4',
                      label: 'Identified'
                    },
                    {
                      value: '5',
                      label: 'Resolved'
                    },
                    {
                      value: '6',
                      label: 'Cancelled'
                    }
                  ]}
                />
                <Button type='dashed' icon={<SearchOutlined />} className='w-1/5'>
                  Tìm kiếm
                </Button>
              </div>
              <div className='flex flex-col gap-3 mt-3'>
                <RecJobCard />
                <RecJobCard />
                <RecJobCard />

                <div className='flex items-center justify-center mt-2'>
                  <Pagination defaultCurrent={1} total={50} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
          <div className={classNames('w-full shadow')}>
            <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
              <h2 className='text-lg font-semibold text-white'>Thông tin liên hệ</h2>
            </div>
            <div className='p-6'>
              <div className='flex flex-col gap-2 pb-5 border-b-2 border-b-slate-300'>
                <div className='flex gap-2'>
                  <MapPinIcon className='w-6 h-6 text-emerald-500' />
                  <p>Địa chỉ công ty</p>
                </div>
                <p className='text-[#4d5965] font-normal text-sm'>
                  Tòa nhà Petronas lầu 8, 235 Nguyễn Văn Cừ, p.Nguyễn Cư Trinh, Quận 1, TP HCM
                </p>
              </div>

              <div className='flex flex-col gap-2 mt-5'>
                <div className='flex gap-2'>
                  <MapIcon className='w-6 h-6 text-emerald-500' />
                  <p>Xem bản đồ</p>
                </div>
                <div>
                  <div style={{ height: '250px', width: '100%' }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: 'AIzaSyDuDbrt0ch9NeF39B74hYbZXpMs5WQgZik' }}
                      defaultCenter={coords}
                      center={coords}
                      defaultZoom={11}
                    >
                      <AnyReactComponent
                        lat={coords.lat}
                        lng={coords.lng}
                        text={<MapPinIcon className='w-6 h-6 text-red-500' />}
                      />
                    </GoogleMapReact>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(`mt-10 mb-8 w-full`)}>
        <h1 className={classNames(`text-3xl font-semibold capitalize text-center mb-2`)}>Top công ty cùng lĩnh vực</h1>

        <div className='flex flex-wrap -mx-4 mt-[10px]'>
          <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
            <RecJobRealtedCard />
          </div>
          <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
            <RecJobRealtedCard />
          </div>
          <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
            <RecJobRealtedCard />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default RecuiterDetail
