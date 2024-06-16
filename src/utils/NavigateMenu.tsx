import {
  HiArrowLeftOnRectangle,
  HiBriefcase,
  HiCog6Tooth,
  HiEnvelope,
  HiHeart,
  HiHome,
  HiMiniBookOpen,
  HiPlusCircle,
  HiQuestionMarkCircle,
  HiUserCircle
} from 'react-icons/hi2'
import { MdOutlineEventAvailable, MdOutlineManageAccounts } from 'react-icons/md'
import {
  PlusCircleIcon,
  UserIcon,
  HomeIcon,
  ChartPieIcon,
  CalendarIcon,
  UserGroupIcon,
  UsersIcon,
  FolderIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/solid'
MdOutlineEventAvailable

import { BriefcaseIcon } from '@heroicons/react/24/outline'

export const prepareMenuItem = (data: any) => [
  {
    url: '/profile',
    icon: <HiUserCircle />,
    text: 'Thông tin cá nhân',
    exactMatch: true
  },
  ...data,
  {
    url: '/logout',
    icon: <HiArrowLeftOnRectangle />,
    text: 'Đăng xuất'
  }
]

const candidateProvider = [
  {
    url: '/profile/resume',
    icon: <HiEnvelope />,
    text: 'Hồ sơ',
    exactMatch: false
  },
  {
    url: '/profile/interest-companies',
    icon: <HiHome />,
    text: 'Công ty theo dõi',
    exactMatch: false
  },
  {
    url: '/profile/interest-jobs',
    icon: <HiHeart />,
    text: 'Công việc quan tâm',
    exactMatch: false
  },
  {
    url: '/profile/submitted-jobs',
    icon: <HiBriefcase />,
    text: 'Công việc ứng tuyển',
    exactMatch: false
  }
]

const recInformationProviderConfirm = [
  {
    url: '/recruiter/profile',
    icon: <HiUserCircle />,
    text: 'Thông tin tài khoản',
    exactMatch: true
  },
  {
    url: '/recruiter/profile/service',
    icon: <HiMiniBookOpen />,
    text: 'Dịch vụ của tôi',
    exactMatch: false
  },
  {
    url: '/recruiter/profile/company',
    icon: <HiHome />,
    text: 'Thông tin công ty',
    exactMatch: false
  },
  {
    url: '/recruiter/profile/jobsPosted',
    icon: <HiBriefcase />,
    text: 'Việc làm đã đăng tuyển',
    exactMatch: false
  },
  {
    url: '/recruiter/profile/createJob',
    icon: <HiPlusCircle />,
    text: 'Đăng tin tuyển dụng',
    exactMatch: false
  },
  {
    url: '/logout',
    icon: <HiArrowLeftOnRectangle />,
    text: 'Đăng xuất'
  }
]

const recInformationProvider = [
  {
    url: '/logout',
    icon: <HiArrowLeftOnRectangle />,
    text: 'Đăng xuất'
  }
]

export const prepareRecruiterProviderConfirm = () => {
  return recInformationProviderConfirm
}

export const prepareRecruiterProvider = () => {
  return recInformationProvider
}

export const prepareCandidateProvider = () => {
  return prepareMenuItem([...candidateProvider])
}

export const prepareOtherProvider = () => {
  return prepareMenuItem([])
}

export const linksAll = [
  {
    name: 'Dashboard',
    icon: <HomeIcon />,
    url: '/admin'
  },
  {
    name: 'Manager Jobs',
    icon: <BriefcaseIcon />,
    url: '/admin/manage_jobs'
  }
]
