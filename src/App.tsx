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
import Events from './pages/Events/Events'
import EventDetail from './pages/EventDetail/EventDetail'
import UserProfileLayout from './pages/UserProfile/UserProfileLayout'
import UserProfileMyProfile from './pages/UserProfile/UserProfileMyProfile'
import UserProfileMyInformation from './pages/UserProfile/UserProfileMyInformation'
import UserProfileMyResume from './pages/UserProfile/UserResume/UserProfileMyResume'
import UserProfileSubmittedJob from './pages/UserProfile/UserProfileSubmittedJob'
import OneTimePasswordVerify from './pages/OneTimePasswordVerify/OneTimePasswordVerify'
import PrintResume from './pages/PrintResume/PrintResume'
import ManagementAppLayOut from './layouts/ManagementAppLayOut/ManagementAppLayOut'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminManagerAccount from './pages/Admin/AdminManagerAccount'
import Logout from './pages/Logout/Logout'
import { useAppDispatch, useAppSelector } from './hooks/hooks'
import { JobService } from './services/JobService'
import CreateAccount from './pages/Admin/CreateAccount'
import AdminJobs from './pages/Admin/AdminJobs'
import FilterCandidate from './components/Routers/FilterCandidate'
import FilterNonLogin from './components/Routers/FilterNonLogin'
import FilterAdmin from './components/Routers/FilterAdmin'
import { EventService } from './services/EventService'
import AdminJobDetail from './pages/Admin/AdminJobDetail'
import AdminEvents from './pages/Admin/AdminEvents'
import AdminEventDetail from './pages/Admin/AdminEventDetail'
import FilterRecruiter from './components/Routers/FilterRecruiter'
import ReccerDashboard from './pages/Recruiter/ReccerDashboard'
import ReccerJobManagement from './pages/Recruiter/Jobs/ReccerJobManagement'
import ReccerInterviewerManagement from './pages/Recruiter/Interview/ReccerInterviewerManagement'
import ReccerEventManagement from './pages/Recruiter/Events/ReccerEventManagement'
import ReccerJobDetail from './pages/Recruiter/Jobs/ReccerJobDetail'
import ReccerCandidateManagement from './pages/Recruiter/Candidate/ReccerCandidateManagement'
import ReccerEventDetail from './pages/Recruiter/Events/ReccerEventDetail'
import ReccerProfile from './pages/Recruiter/ReccerProfile'
import EditJob from './pages/Recruiter/Jobs/EditJob'
import AddJob from './pages/Recruiter/Jobs/AddJob'
import FilterInterviewer from './components/Routers/FilterInterviewer'
import InterviewerDashboard from './pages/Interviewer/InterviewerDashboard'
import ManageQuestion from './pages/Interviewer/Question/ManageQuestion'
import InterviewRecent from './pages/Interviewer/Interview/InterviewRecent'
import CandidateRecent from './pages/Interviewer/Candidate/CandidateRecent'
import AddEvent from './pages/Recruiter/Events/AddEvent/AddEvent'
import CandidateDetail from './pages/Recruiter/Candidate/CandidateDetail'
import ReccerInterviewerDetail from './pages/Recruiter/Interview/ReccerInterviewerDetail'
import InterviewInformation from './pages/Interviewer/InterviewInformation'
import InterviewProfile from './pages/Interviewer/InterviewProfile'
import INTCandidateDetail from './pages/Interviewer/Candidate/Detail/INTCandidateDetail'
import InterviewDetail from './pages/Interviewer/Interview/Detail/InterviewDetail'
import ScorePage from './pages/Interviewer/Interview/ScorePage'
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
import UserResumeAdd from './pages/UserProfile/UserResume/UserResumeAdd'
import UserResumeEdit from './pages/UserProfile/UserResume/UserResumeEdit'
import RecEditJob from './pages/Rec/RecJob/RecEditJob'
import RecMyService from './pages/Rec/RecMyService/RecMyService'
import { RecService } from './services/RecService'
import RecuiterDetail from './pages/RecuiterDetail/RecuiterDetail'
import Payment from './pages/Recruiter/Payment.tsx/Payment'
import RecFindCandidate from './pages/Rec/RecMyService/RecFindCandidate'
import RecStatistical from './pages/Rec/RecMyService/RecStatistical'
import AdminManageNews from './pages/Admin/AdminManageNews/AdminManageNews'
import AdminManageNewDetail from './pages/Admin/AdminManageNews/AdminManageNewDetail'
import AdminManageAddCompany from './pages/Admin/AdminManageCompanies/AddCompany/AdminManageAddCompany'
import AdminManageAddJob from './pages/Admin/AdminManageJobs/AdminManageAddJob/AdminManageAddJob'
import AdminManageAddNew from './pages/Admin/AdminManageNews/AdminManageAddNew/AdminManageAddNew'

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
    JobService.getExperience(dispatch)
    JobService.getLevelRequirement(dispatch)
    JobService.getGenderRequirement(dispatch)
    JobService.getActivity(dispatch)
    JobService.getType(dispatch)
    JobService.getJobs(dispatch)
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
          <Route path='events' element={<Events />} />
          <Route path='/events/:eventId' element={<EventDetail />} />
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

          {/* This route is only accepted when user is logged in and/or token is not broken  */}
          {/* <Route element={<FilterCandidate />}> */}
          <Route path='/profile' element={<UserProfileLayout />}>
            <Route index element={<UserProfileMyProfile />} />
            <Route path='information' element={<UserProfileMyInformation />} />
            <Route path='resume' element={<UserProfileMyResume />} />
            <Route path='resume/add' element={<UserResumeAdd />} />
            <Route path='resume/edit/:resumeId' element={<UserResumeEdit />} />
            {/* <Route path='resume/:resumeId' element={<UserResumeDetail />} /> */}
            <Route path='submitted-jobs' element={<UserProfileSubmittedJob />} />
            <Route path='interest-jobs' element={<UserInterestJob />} />
          </Route>
          <Route path='/print-resume' element={<PrintResume />} />
        </Route>
        {/* </Route> */}

        {/* ADMIN  */}
        <Route element={<FilterAdmin />}>
          <Route path='/admin' element={<ManagementAppLayOut />}>
            <Route index element={<AdminDashboard />} />
            <Route path='manage_jobs' element={<AdminManageJobs />} />
            <Route path='manage_jobs/:jobId' element={<AdminManageJobDetail />} />
            <Route path='manage_jobs/addJob' element={<AdminManageAddJob />} />

            <Route path='manage_companies' element={<AdminManageCompanies />} />
            <Route path='manage_companies/:companyId' element={<AdminManageCompanyDetail />} />
            <Route path='manage_companies/addCompany' element={<AdminManageAddCompany />} />

            <Route path='manage_news' element={<AdminManageNews />} />
            <Route path='manage_news/:newId' element={<AdminManageNewDetail />} />
            <Route path='manage_news/addNew' element={<AdminManageAddNew />} />
          </Route>
        </Route>

        {/* RECRUITER  */}

        <Route path='/recruiter' element={<UserAppLayout />}>
          <Route path='thankyou' element={<Payment />} />
          <Route path='profile' element={<UserProfileLayout />}>
            <Route index element={<RecProfile />} />
            <Route path='service' element={<RecMyService />} />
            <Route path='service/findCandidate' element={<RecFindCandidate />} />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
