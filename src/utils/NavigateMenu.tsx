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
  EnvelopeIcon
} from '@heroicons/react/24/solid'
MdOutlineEventAvailable

import { BriefcaseIcon } from '@heroicons/react/24/outline'

export const prepareMenuItem = (data: any) => [
  {
    url: '/profile',
    icon: <HiUserCircle />,
    text: 'My Profile'
  },
  ...data,
  {
    url: '/logout',
    icon: <HiArrowLeftOnRectangle />,
    text: 'Log out'
  }
]

const candidateProvider = [
  {
    url: '/profile/resume',
    icon: <HiEnvelope />,
    text: 'My Resume'
  },

  {
    url: '/profile/interviews',
    icon: <HiCog6Tooth />,
    text: 'Interview'
  },
  {
    url: '/profile/submitted-jobs',
    icon: <HiQuestionMarkCircle />,
    text: 'Submitted Jobs'
  }
]

const informationProvider = [
  {
    url: '/profile/information',
    icon: <HiInformationCircle />,
    text: 'My Information'
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
        name: 'Interview Recent',
        icon: <HiOutlineClipboardDocumentList />,
        url: 'interviewer/interview-recent'
      },
      {
        name: 'Candidate Recent',
        icon: <HiOutlineCalendarDays />,
        url: 'interviewer/candidate-recent'
      },
      {
        name: 'Interview Question',
        icon: <HiOutlineClipboardDocument />,
        url: 'interviewer/question'
      }
    ]
  }
]
