import { MdWorkspacesOutline } from 'react-icons/md'
import Container from '../../components/Container/Container'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { BriefcaseIcon } from '@heroicons/react/24/outline'

const listData = [
  { id: 1, date: '31/1/1997', content: 'Thành lập trung tâm dữ liệu FPT (FPT Online Exchange - FOX)' },
  { id: 2, date: '2001', content: 'Ra mắt trang báo điện tử đầu tiên tại Việt Nam' },
  { id: 3, date: '2002', content: 'Trở thành nhà cung cấp kết nối Internet IXP (Internet Ex-changer Provider)' },
  { id: 4, date: '2005', content: 'Chuyển đổi thành Công ty cổ phần Viễn Thông FPT (FPT Telecom)' },
  {
    id: 5,
    date: '2007',
    content:
      'FPT Telecom bắt đầu mở rộng hoạt động trên phạm vi toàn quốc, được cấp giấy phép cung cấp dịch vụ viên thông liên tỉnh và cổng kết nối quốc tế. Đặc biệt, FPT Telecom đã trở thành thành viên chính thức của Liên minh AAG (Asia America Gateway - nhóm các công ty viễn thông hai bên bờ Thái Bình Dương)'
  },
  {
    id: 6,
    date: '2008',
    content:
      'Trở thành nhà cung cấp dịch vụ Internet cáp quang băng rộng (FTTH) đầu tiên tại Việt Nam và chính thức có đường kết nối quốc tế từ Việt Nam đi Hồng Kong'
  },
  {
    id: 7,
    date: '2009',
    content: 'Đạt mốc doanh thu 100 triệu đô la Mỹ và mở rộng thị trường sang các nước lân cận như Campuchia'
  },
  { id: 8, date: '2012', content: 'Hoàn thiện tuyến trục bắc nam với tổng chiều dài 4000 km đi qua 30 tỉnh thành' },
  { id: 9, date: '2014', content: 'Tham gia cung cấp dịch vụ truyền hình IPTV với thương hiệu truyền hình FPT' },
  {
    id: 10,
    date: '2015',
    content:
      'FPT Telecom có mặt trên cả nước với gần 200 VPGD, chính thức được cấp phép kinh doanh tại Myanmar, đạt doanh thu hơn 5,500 tỷ đồng và là một trong những đơn vị dẫn đầu trong triển khai chuyển đổi giao thức liên mạng IPv6'
  },
  {
    id: 11,
    date: '2016',
    content:
      'Khai trương Trung tâm Dữ liệu FPT Telecom mở rộng chuẩn TIER III với quy mô lớn nhất miền Nam. Được cấp phép triển khai thử nghiệm mạng 4G tại Việt Nam. Đồng thời là doanh nghiệp Việt Nam đầu tiên nhận giải thưởng digital Trans-formers of the Year của IDC năm 2016. Năm 2016, doanh thu của FPT Telecom đạt 6.666 tỷ đồng'
  },
  {
    id: 12,
    date: '2017',
    content:
      'Ra mắt gói dịch vụ Internet tốc độ nhanh nhất Việt Nam Soc – 1Gbps cũng như phiên bản nâng cấp hệ thông Ftv Lucas Onca của Truyền hình FPT. Năm 2017, FPT Telecom cũng vinh dự lọt Top Doanh nghiệp có ảnh hưởng lớn nhất đến Internet Việt Nam. Doanh thu thuần năm 2017 của Công ty đạt 7,562 tỷ đồng'
  }
]

export default function AboutUs() {
  return (
    <Container>
      <div className="bg-[url('https://fptjobs.com/public/img/Bandron.png')] bg-no-repeat bg-center bg-contain text-uppercase text-[20px] text-white text-center h-24 font-bold pt-5">
        <h1 className='flex items-center justify-center'>LỊCH SỬ HÌNH THÀNH FPT TELECOM</h1>
      </div>
      <div className='mt-2 mb-4'>
        <VerticalTimeline>
          {listData.map((data) => (
            <VerticalTimelineElement
              className='vertical-timeline-element--work'
              date={data.date}
              iconStyle={{ background: 'orange', color: '#fff' }}
              icon={<BriefcaseIcon />}
            >
              <h3 className='vertical-timeline-element-title'>{data.content}</h3>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>

        <div className='p-5 mt-4 font-bold text-white rounded-sm bg-orange'>
          <p>
            Công ty cổ phần viễn thông FPT - FPT Telecom là nhà cung cấp dịch vụ internet, truyền hình và các dịch vụ
            gia tăng trên nền tảng internet với hơn 25 năm hình thành và phát triển. HIện tại FPT Telecom đang có mặt
            trên 63 tỉnh thành trong nước và một số thị trường quốc tế. Với phương châm “mọi dịch vụ trên một kết nối”,
            chúng tôi kỳ vọng mỗi gia đình việt nam đều sử dụng ít nhất một dịch vụ của FPT Telecom trong tương lai.
          </p>
        </div>
      </div>
    </Container>
  )
}
