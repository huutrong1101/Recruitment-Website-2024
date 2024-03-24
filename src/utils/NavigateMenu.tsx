import {
  HiArrowLeftOnRectangle,
  HiCog6Tooth,
  HiEnvelope,
  HiInformationCircle,
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentList,
  HiOutlineFolder,
  HiOutlineUser,
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
    url: '/profile/interviews',
    icon: <HiCog6Tooth />,
    text: 'Danh sách phỏng vấn'
  },
  {
    url: '/profile/submitted-jobs',
    icon: <HiQuestionMarkCircle />,
    text: 'Danh sách ứng tuyển'
  }
]

const informationProvider = [
  {
    url: '/profile/information',
    icon: <HiInformationCircle />,
    text: 'Thông tin bổ sung'
  }
]

export const prepareCandidateProvider = () => {
  return prepareMenuItem([...informationProvider, ...candidateProvider])
}

export const prepareInterviewerProvider = () => {
  return prepareMenuItem([...informationProvider])
}

export const prepareOtherProvider = () => {
  return prepareMenuItem([])
}

export const linksAll = [
  {
    title: 'ADMIN',
    links: [
      {
        name: 'Dashboard',
        icon: <HomeIcon />,
        url: '/admin'
      },
      {
        name: 'Profile',
        icon: <UserIcon />,
        url: '/admin/profile'
      },
      {
        name: 'Manager Account',
        icon: <UserIcon />,
        url: '/admin/account'
      },
      {
        name: 'Create Account',
        icon: <PlusCircleIcon />,
        url: '/admin/create_account'
      },
      {
        name: 'Manager Jobs',
        icon: <BriefcaseIcon />,
        url: '/admin/jobs'
      },
      {
        name: 'Manager Events',
        icon: <EnvelopeIcon />,
        url: '/admin/events'
      }
    ]
  },
  {
    title: 'RECRUITER',
    links: [
      {
        name: 'Overview',
        icon: <ChartPieIcon />,
        url: '/recruiter'
      },
      {
        name: 'Profile',
        icon: <UserIcon />,
        url: '/recruiter/profile'
      },
      {
        name: 'Interviewer',
        icon: <UserGroupIcon />,
        url: '/recruiter/interviewers'
      },
      {
        name: 'Candidate',
        icon: <UsersIcon />,
        url: '/recruiter/candidates'
      },
      {
        name: 'Job',
        icon: <FolderIcon />,
        url: '/recruiter/jobs'
      },
      {
        name: 'Event',
        icon: <EnvelopeIcon />,
        url: '/recruiter/events'
      }
    ]
  },
  {
    title: 'INTERVIEWER',
    links: [
      {
        name: 'Overview',
        icon: <ChartPieIcon />,
        url: '/interviewer'
      },
      {
        name: 'Profile',
        icon: <UserIcon />,
        url: '/interviewer/profile'
      },
      {
        name: 'Information',
        icon: <UserIcon />,
        url: '/interviewer/information'
      },
      {
        name: 'Interview Recent',
        icon: <UserGroupIcon />,
        url: '/interviewer/interview-recent'
      },
      {
        name: 'Candidate Recent',
        icon: <UsersIcon />,
        url: '/interviewer/candidate-recent'
      },
      {
        name: 'Questions',
        icon: <QuestionMarkCircleIcon />,
        url: '/interviewer/question'
      }
    ]
  }
]
