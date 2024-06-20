import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import UserAppLayout from './layouts/UserAppLayout'
import Home from './pages/Home/Home'
import Authenticate from './pages/Authenticate/Authenticate'
import AuthenticateLogin from './pages/Authenticate/AuthenticateLogin'
import AuthenticateSignUp from './pages/Authenticate/AuthenticateSignUp'
import Contact from './pages/Contact/Contact'
import EmailConfirmationLayout from './pages/EmailConfirmation/EmailConfirmationLayout'
import IncompleteConfirmEmail from './pages/EmailConfirmation/IncompleteConfirmEmail'
import CompleteConfirmEmail from './pages/EmailConfirmation/CompleteConfirmEmail'
import ForgetPasswordLayout from './pages/ForgetPassword/ForgetPasswordLayout'
import ForgetPassword from './pages/ForgetPassword/ForgetPassword'
import ConfirmPassword from './pages/ForgetPassword/ConfirmPassword'
import Jobs from './pages/Jobs/Jobs'
import JobDetail from './pages/JobDetail/JobDetail'
import EventDetail from './pages/NewDetail/NewDetail'
import UserProfileLayout from './pages/UserProfile/UserProfileLayout'
import UserProfileMyProfile from './pages/UserProfile/UserProfileMyProfile'
import UserProfileMyInformation from './pages/UserProfile/UserProfileMyInformation'
import UserProfileMyResume from './pages/UserProfile/UserResume/UserProfileMyResume'
import UserProfileSubmittedJob from './pages/UserProfile/UserProfileSubmittedJob'
import OneTimePasswordVerify from './pages/OneTimePasswordVerify/OneTimePasswordVerify'
import PrintResume from './pages/PrintResume/PrintResume'
import ManagementAppLayOut from './layouts/ManagementAppLayOut/ManagementAppLayOut'
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard'
import Logout from './pages/Logout/Logout'
import { useAppDispatch } from './hooks/hooks'
import { JobService } from './services/JobService'
import FilterNonLogin from './components/Routers/FilterNonLogin'
import FilterAdmin from './components/Routers/FilterAdmin'
import Recruiters from './pages/Recruiters/Recruiters'
import AuthenticateRecSignUp from './pages/Authenticate/AuthenticateRecSignUp'
import UserInterestJob from './pages/UserProfile/UserInterestJob'
import ConfirmRec from './pages/ConfirmRec/ConfirmRec'
import ConfirmComplete from './pages/ConfirmRec/ConfirmComplete'
import ConfirmRecLayout from './pages/ConfirmRec/ConfirmRecLayout'
import RecProfile from './pages/Rec/RecProfile'
import RecCompany from './pages/Rec/RecCompany'
import RecListJobRecruitment from './pages/Rec/RecListJobRecretment/RecListJobRecretment'
import RecAddJob from './pages/Rec/RecJob/RecAddJob'
import AdminManageJobs from './pages/Admin/AdminManageJobs/AdminManageJobs'
import AdminManageJobDetail from './pages/Admin/AdminManageJobs/AdminManageJobDetail'
import AdminManageCompanies from './pages/Admin/AdminManageCompanies/AdminManageCompanies'
import AdminManageCompanyDetail from './pages/Admin/AdminManageCompanies/AdminManageCompanyDetail'
import ListCandidateApply from './pages/Rec/RecListJobRecretment/ListCandidateApply/ListCandidateApply'
import CandidateProfileDetail from './pages/Rec/RecListJobRecretment/ListCandidateApply/CandidateProfileDetail/CandidateProfileDetail'
import UserResumeDetail from './pages/UserProfile/UserResume/UserResumeEdit'
import UserResumeAdd from './pages/UserProfile/UserResume/UserResumeAdd/UserResumeAdd'
import UserResumeEdit from './pages/UserProfile/UserResume/UserResumeEdit'
import RecEditJob from './pages/Rec/RecJob/RecEditJob'
import RecMyService from './pages/Rec/RecMyService/RecMyService'
import { RecService } from './services/RecService'
import RecuiterDetail from './pages/RecuiterDetail/RecuiterDetail'
import Payment from './pages/Recruiter/Payment.tsx/Payment'
import RecFindCandidate from './pages/Rec/RecMyService/RecFindCandidate'
import RecStatistical from './pages/Rec/RecMyService/RecStatistical'
import AdminManageNews from './pages/Admin/AdminManageNews/AdminManageNews/AdminManageNews'
import AdminManageNewDetail from './pages/Admin/AdminManageNews/AdminManageNewDetail'
import AdminManageAddCompany from './pages/Admin/AdminManageCompanies/AddCompany/AdminManageAddCompany'
import AdminManageAddJob from './pages/Admin/AdminManageJobs/AdminManageAddJob/AdminManageAddJob'
import AdminManageAddNew from './pages/Admin/AdminManageNews/AdminManageAddNew/AdminManageAddNew'
import UserInterestCompanies from './pages/UserProfile/UserInterestCompanies'
import ResumeDetail from './pages/Rec/RecMyService/ResumeDetail/ResumeDetail'
import AdminManageEditCompany from './pages/Admin/AdminManageCompanies/EditCompany/AdminManageEditCompany'
import AdminManageEditJob from './pages/Admin/AdminManageJobs/AdminManageEditJob/AdminManageEditJob'
import AdminManageEditNew from './pages/Admin/AdminManageNews/AdminManageEditNew/AdminManageEditNew'
import News from './pages/News/News'
import UserResumeLayout from './layouts/UserResumeLayout'
import { NewService } from './services/NewService'
import FilterCandidate from './components/Routers/FilterCandidate'
import FilterRecruiter from './components/Routers/FilterRecruiter'
import NewDetail from './pages/NewDetail/NewDetail'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    JobService.getProvince(dispatch)
    JobService.getMajor(dispatch)
    JobService.getExperience(dispatch)
    JobService.getLevelRequirement(dispatch)
    JobService.getGenderRequirement(dispatch)
    JobService.getActivity(dispatch)
    JobService.getType(dispatch)
    JobService.getJobs(dispatch)
    JobService.getHighlightedJobs(dispatch)
    NewService.getListNews(dispatch)
    RecService.getListRec(dispatch)
  }, [])

  return (
    <BrowserRouter>
      <>
        <ScrollToTop />
      </>
      <Routes>
        <Route path='/' element={<UserAppLayout />}>
          <Route index element={<Home />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='jobs' element={<Jobs />} />
          <Route path='/jobs/:jobId' element={<JobDetail />} />
          <Route path='news' element={<News />} />
          <Route path='/news/:newId' element={<NewDetail />} />
          <Route path='contact' element={<Contact />} />
          <Route path='recruiters' element={<Recruiters />} />
          <Route path='recruiters/:recruiterSlug' element={<RecuiterDetail />} />
          <Route path='auth' element={<Authenticate />}>
            <Route path='login' element={<AuthenticateLogin />} />
            <Route path='signup' element={<AuthenticateSignUp />} />
            <Route path='rec-signup' element={<AuthenticateRecSignUp />} />
            <Route element={<AuthenticateLogin />} />
          </Route>

          <Route path='/confirm-rec' element={<ConfirmRecLayout />}>
            <Route index element={<ConfirmRec />} />
            <Route path='complete' element={<ConfirmComplete />} />
          </Route>

          {/* This route is accepted when user is not logged in */}
          <Route element={<FilterNonLogin />}>
            <Route path='/email' element={<EmailConfirmationLayout />}>
              <Route path='incomplete' element={<IncompleteConfirmEmail />} />
              <Route path='complete' element={<CompleteConfirmEmail />} />
            </Route>
            <Route path='/otp' element={<OneTimePasswordVerify />} />
            <Route path='/forgot-password' element={<ForgetPasswordLayout />}>
              <Route index element={<ForgetPassword />} />
              <Route path='confirm-password' element={<ConfirmPassword />} />
            </Route>
          </Route>

          {/* CANDIDATE  */}
          <Route element={<FilterCandidate />}>
            <Route path='/profile' element={<UserProfileLayout />}>
              <Route index element={<UserProfileMyProfile />} />
              <Route path='information' element={<UserProfileMyInformation />} />
              <Route path='resume' element={<UserProfileMyResume />} />
              <Route path='submitted-jobs' element={<UserProfileSubmittedJob />} />
              <Route path='interest-jobs' element={<UserInterestJob />} />
              <Route path='interest-companies' element={<UserInterestCompanies />} />
            </Route>
            <Route path='/print-resume' element={<PrintResume />} />

            <Route path='/profile/resume/add' element={<UserResumeLayout />}>
              <Route index element={<UserResumeAdd />} />
            </Route>

            <Route path='/profile/resume/edit/:resumeId' element={<UserResumeLayout />}>
              <Route index element={<UserResumeEdit />} />
            </Route>
          </Route>
        </Route>

        {/* RECRUITER  */}
        <Route element={<FilterRecruiter />}>
          <Route path='/recruiter' element={<UserAppLayout />}>
            <Route path='thankyou' element={<Payment />} />
            <Route path='profile' element={<UserProfileLayout />}>
              <Route index element={<RecProfile />} />
              <Route path='service' element={<RecMyService />} />
              <Route path='service/findCandidate' element={<RecFindCandidate />} />
              <Route path='service/findCandidate/:resumeId' element={<ResumeDetail />} />
              <Route path='service/statistical' element={<RecStatistical />} />
              <Route path='company' element={<RecCompany />} />
              <Route path='jobsPosted' element={<RecListJobRecruitment />} />
              <Route path='jobsPosted/listCandidate/:jobid' element={<ListCandidateApply />} />
              <Route
                path='jobsPosted/listCandidate/:jobid/candidateDetail/:candidateId'
                element={<CandidateProfileDetail />}
              />
              <Route path='createJob' element={<RecAddJob />} />
              <Route path='editJob/:jobId' element={<RecEditJob />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN  */}
        <Route element={<FilterAdmin />}>
          <Route path='/admin' element={<ManagementAppLayOut />}>
            <Route index element={<AdminDashboard />} />
            <Route path='manage_jobs' element={<AdminManageJobs />} />
            <Route path='manage_jobs/:jobId' element={<AdminManageJobDetail />} />
            <Route path='manage_jobs/addJob' element={<AdminManageAddJob />} />
            <Route path='manage_jobs/editJob/:jobId' element={<AdminManageEditJob />} />

            <Route path='manage_companies' element={<AdminManageCompanies />} />
            <Route path='manage_companies/:companyId' element={<AdminManageCompanyDetail />} />
            <Route path='manage_companies/addCompany' element={<AdminManageAddCompany />} />
            <Route path='manage_companies/editCompany/:companyId' element={<AdminManageEditCompany />} />

            <Route path='manage_news' element={<AdminManageNews />} />
            <Route path='manage_news/:newId' element={<AdminManageNewDetail />} />
            <Route path='manage_news/addNew' element={<AdminManageAddNew />} />
            <Route path='manage_news/editNew/:newId' element={<AdminManageEditNew />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
