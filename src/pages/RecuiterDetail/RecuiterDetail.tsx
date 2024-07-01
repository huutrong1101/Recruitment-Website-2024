import React, { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import classNames from 'classnames'
import {
  BuildingLibraryIcon,
  GlobeAltIcon,
  MapIcon,
  MapPinIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Pagination, Select, Spin } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RecJobCard from '../../components/JobCard/RecJobCard'
import RecJobRealtedCard from '../../components/JobCard/RecJobRealtedCard'
import GoogleMapReact from 'google-map-react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { RecService } from '../../services/RecService'
import parse from 'html-react-parser'
import { JobInterface } from '../../types/job.type'
import { checkFavoriteRec, setIsRecFavorite } from '../../redux/reducer/RecSlice'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'

const AnyReactComponent = (props: { lat: number; lng: number; text: React.ReactNode }) => <div>{props.text}</div>

function RecuiterDetail() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { recruiterSlug } = useParams()

  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
  const { user } = useAppSelector((state) => state.Auth)
  const recDetail = useAppSelector((state) => state.RecJobs.companyDetail)
  const { isRecFavorite } = useAppSelector((state) => state.RecJobs)
  const provinces = useAppSelector((state) => state.Job.province)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [activeData, setActiveData] = useState<JobInterface[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingJob, setIsLoadingJob] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showMoreButton, setShowMoreButton] = useState(true)
  const [shortenedDescription, setShortenedDescription] = useState('')
  const [relatedRecs, setRelatedRecs] = useState([])

  const optionsProvinces = provinces.map((option: any) => ({ value: option, label: option }))

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  useEffect(() => {
    const fetchCoords = async () => {
      if (recDetail && recDetail.companyAddress) {
        try {
          const result = await geocodeByAddress(recDetail.companyAddress)
          const lnglat = await getLatLng(result[0])
          setCoords(lnglat)
        } catch (error) {
          console.error('Error fetching coordinates for address:', recDetail.companyAddress, error)
        }
      }
    }

    if (recDetail && recDetail.about) {
      const fullDescription = recDetail.about
      const shortened = truncate(fullDescription, 155)
      setShortenedDescription(shortened)
      setShowMoreButton(fullDescription.length > 155)
    }

    if (recDetail) {
      const fetchRelatedRecs = async () => {
        try {
          const response = await axiosInstance.get(`/recruiters/${recDetail._id}/related_recruiter`)
          if (response && response.data) {
            setRelatedRecs(response.data.metadata.listRecruiter)
          }
        } catch (err: any) {
          toast.error(`${err.message}`)
          throw err
        }
      }

      fetchRelatedRecs()
    }

    fetchCoords()
  }, [recDetail])

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        if (recruiterSlug) {
          await RecService.getRecFromSlug(dispatch, recruiterSlug)
          setActiveData([])
        }
        if (user) {
          await Promise.all([dispatch(checkFavoriteRec({ slug: recruiterSlug })).unwrap()])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [dispatch, recruiterSlug, user])

  useEffect(() => {
    if (recruiterSlug) {
      fetchJobs(currentPage, pageSize, searchTerm, selectedProvince ?? '', recruiterSlug)
    }
  }, [currentPage, pageSize, recruiterSlug])

  const fetchJobs = async (
    page: number,
    limit: number,
    searchTerm: string,
    province: string,
    recruiterSlug: string
  ) => {
    setIsLoadingJob(true)
    const params = { name: searchTerm, page, limit, province }
    try {
      const response = await RecService.getLsitJobOfRec(recruiterSlug, params)
      if (response && response.data) {
        const data = response.data.metadata.listJob
        const total = response.data.metadata.totalElement
        setActiveData(data)
        setTotalElement(total)
      }
    } catch (error) {
      console.error('Fetching jobs failed:', error)
    } finally {
      setIsLoadingJob(false)
    }
  }

  const truncate = (text: string, maxLength: number) => {
    const words = text.split(' ')
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(' ') + '...'
    } else {
      return text
    }
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    if (recruiterSlug) {
      fetchJobs(page, pageSize, searchTerm, selectedProvince ?? '', recruiterSlug)
    }
  }

  const handleSearch = () => {
    if (recruiterSlug) {
      fetchJobs(currentPage, pageSize, searchTerm, selectedProvince ?? '', recruiterSlug)
    }
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedProvince(undefined)
    setCurrentPage(1)
    if (recruiterSlug) {
      fetchJobs(1, pageSize, '', '', recruiterSlug)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleSaveFavorite = () => {
    if (recDetail) {
      toast
        .promise(RecService.saveFavoriteRec(recDetail._id), {
          pending: `Đang tiến hành theo dõi công ty`,
          success: `Theo dõi công ty thành công`
        })
        .then(() => {
          setIsModalVisible(false)
          dispatch(setIsRecFavorite(true))
        })
        .catch((error) => toast.error(error.response.data.message))
    }
  }

  const handleRemoveFavorite = () => {
    if (recDetail) {
      toast
        .promise(RecService.removeFavoriteRec(recDetail._id), {
          pending: `Đang hủy theo dõi công ty`,
          success: `Hủy theo dõi công ty thành công`
        })
        .then(() => {
          setIsModalVisible(false)
          dispatch(setIsRecFavorite(false))
        })
        .catch((error) => toast.error(error.response.data.message))
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleNavigateToSignIn = () => {
    navigate(`/auth/login`)
    navigate(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
  }

  return (
    <Container>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : recDetail ? (
        <>
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
                  src={recDetail?.companyCoverPhoto}
                  alt='blog_image'
                  className={classNames('w-full h-[200px] object-center object-cover aspect-video rounded-t-md')}
                />
                <img
                  className='absolute bottom-[-50px] left-[50px] w-32 h-32 border-2 rounded-full'
                  src={recDetail?.companyLogo}
                  alt=''
                />
              </div>
              <div className='flex items-center w-full gap-3 bg-emerald-500'>
                <div className='w-1/6'></div>
                <div className='flex items-center justify-between w-5/6 p-5'>
                  <div className='flex flex-col gap-3 text-white'>
                    <h1 className='text-lg font-bold'>{recDetail?.companyName}</h1>
                    <div className='flex flex-row gap-10 text-base'>
                      <div className='flex items-center gap-1'>
                        <GlobeAltIcon className='w-4 h-4' />
                        <p>{recDetail?.companyWebsite}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <BuildingLibraryIcon className='w-4 h-4' />
                        <p>{recDetail?.employeeNumber} nhân viên</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <UserGroupIcon className='w-4 h-4' />
                        <p>{recDetail?.likeNumber} người theo dõi</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {user ? (
                      <button
                        className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}
                        onClick={showModal}
                      >
                        {isRecFavorite ? <p>ĐANG THEO DÕI</p> : <p> THEO DÕI CÔNG TY</p>}
                      </button>
                    ) : (
                      <button
                        className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}
                        onClick={handleNavigateToSignIn}
                      >
                        THEO DÕI CÔNG TY
                      </button>
                    )}

                    <Modal
                      title={isRecFavorite ? 'Xác nhận xóa' : 'Xác nhận theo dõi'}
                      open={isModalVisible}
                      onOk={isRecFavorite ? handleRemoveFavorite : handleSaveFavorite}
                      onCancel={handleCancel}
                      okText={isRecFavorite ? 'Xóa' : 'Lưu'}
                      cancelText='Hủy'
                      cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                      width={450}
                    >
                      <p>
                        Bạn có muốn
                        {isRecFavorite
                          ? 'loại công ty này khỏi danh sách yêu thích'
                          : 'lưu công ty này vào danh sách yêu thích'}
                        ?
                      </p>
                    </Modal>
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
                  <div className='flex gap-2'>
                    <div className='flex items-center justify-center'>
                      <div>
                        {showFullDescription ? (
                          <div>{recDetail && parse(recDetail.about)}</div>
                        ) : (
                          <div>{parse(shortenedDescription)}</div>
                        )}
                        {showMoreButton && (
                          <button onClick={toggleDescription} className='mt-2 text-emerald-500'>
                            {showFullDescription ? (
                              <div className='flex items-center gap-1'>
                                <p>Rút gọn</p>
                                <ArrowUpOutlined />
                              </div>
                            ) : (
                              <div className='flex items-center gap-1'>
                                <p>Xem thêm</p>
                                <ArrowDownOutlined />
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type='text'
                      style={{ width: '50%' }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                    />
                    <Select
                      showSearch
                      style={{ width: '30%' }}
                      placeholder='Tỉnh/Thành phố'
                      filterOption={(input, option) =>
                        option ? (option.label as string).toLowerCase().includes(input.toLowerCase()) : false
                      }
                      options={optionsProvinces}
                      value={selectedProvince}
                      onChange={(value) => setSelectedProvince(value)}
                    />

                    <Button type='primary' onClick={handleSearch} icon={<SearchOutlined />}>
                      Tìm kiếm
                    </Button>
                    <Button danger onClick={handleReset} style={{ backgroundColor: 'transparent' }}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                  <div className='flex flex-col gap-3 mt-3'>
                    {isLoadingJob ? (
                      <div className='text-center'>
                        <Spin size='large' />
                      </div> // Hoặc sử dụng một spinner thực sự
                    ) : activeData && activeData.length > 0 ? (
                      activeData.map((job) => <RecJobCard key={job._id} job={job} />)
                    ) : (
                      <h1 className='text-center'>Hiện tại chưa có công việc nào</h1>
                    )}

                    {!isLoadingJob && (
                      <div className='flex items-center justify-center mt-2'>
                        <Pagination
                          current={currentPage}
                          pageSize={pageSize}
                          total={totalElement}
                          onChange={handlePageChange}
                        />
                      </div>
                    )}
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
                    <p className='text-[#4d5965] font-normal text-sm'>{recDetail?.companyAddress}</p>
                  </div>

                  <div className='flex flex-col gap-2 mt-5'>
                    <div className='flex gap-2'>
                      <MapIcon className='w-6 h-6 text-emerald-500' />
                      <p>Xem bản đồ</p>
                    </div>
                    <div>
                      <div style={{ height: '250px', width: '100%' }}>
                        <GoogleMapReact
                          bootstrapURLKeys={{ key: 'AIzaSyDiTFSvK7eZQoKZkBVSmzybVvuG4aY0m6A' }}
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
            <h1 className={classNames(`text-3xl font-semibold capitalize text-center mb-2`)}>
              Top công ty cùng lĩnh vực
            </h1>

            <div className='flex flex-wrap -mx-4 mt-[10px]'>
              {relatedRecs && relatedRecs.length > 0 ? (
                relatedRecs.slice(0, 3).map((rec, index) => (
                  <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3' key={index}>
                    <RecJobRealtedCard rec={rec} />
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <p>Hiện chưa có công ty nào cùng lĩnh vực</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy công ty phù hợp</p>
        </div>
      )}
    </Container>
  )
}

export default RecuiterDetail
