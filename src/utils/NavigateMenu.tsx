import {
  HiArrowLeftOnRectangle,
  HiBriefcase,
  HiCog6Tooth,
  HiEnvelope,
  HiHome,
  HiInformationCircle,
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentList,
  HiOutlineFolder,
  HiOutlineUser,
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
    text: 'Thông tin cá nhân'
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
    text: 'Hồ sơ'
  },

  {
    url: '/profile/interest-jobs',
    icon: <HiCog6Tooth />,
    text: 'Công việc quan tâm'
  },
  {
    url: '/profile/submitted-jobs',
    icon: <HiQuestionMarkCircle />,
    text: 'Công việc ứng tuyển'
  }
]

const recInformationProviderConfirm = [
  {
    url: '/recruiter/profile',
    icon: <HiUserCircle />,
    text: 'Thông tin tài khoản'
  },
  {
    url: '/recruiter/profile/service',
    icon: <HiUserCircle />,
    text: 'Dịch vụ của tôi'
  },
  {
    url: '/recruiter/profile/company',
    icon: <HiHome />,
    text: 'Thông tin công ty'
  },
  {
    url: '/recruiter/profile/jobsPosted',
    icon: <HiBriefcase />,
    text: 'Việc làm đã đăng tuyển'
  },
  {
    url: '/recruiter/profile/createJob',
    icon: <HiPlusCircle />,
    text: 'Đăng tin tuyển dụng'
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
