import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import UserAppLayout from './layouts/UserAppLayout'
import Home from './pages/Home/Home'
import Authenticate from './pages/Authenticate/Authenticate'
import AuthenticateLogin from './pages/Authenticate/AuthenticateLogin'
import AuthenticateSignUp from './pages/Authenticate/AuthenticateSignUp'
import Contact from './pages/Contact/Contact'
import AboutUs from './pages/AboutUs/AboutUs'
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
import UserProfileMyResume from './pages/UserProfile/UserProfileMyResume'
import UserProfileSubmittedJob from './pages/UserProfile/UserProfileSubmittedJob'
import OneTimePasswordVerify from './pages/OneTimePasswordVerify/OneTimePasswordVerify'
import PrintResume from './pages/PrintResume/PrintResume'
import ManagementAppLayOut from './layouts/ManagementAppLayOut/ManagementAppLayOut'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminManagerAccount from './pages/Admin/AdminManagerAccount'
import Logout from './pages/Logout/Logout'
import { useAppDispatch } from './hooks/hooks'
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
import InterviewSched from './pages/Recruiter/Jobs/CreateInterview/InterviewSched'
import UserProfileInterviews from './pages/UserProfile/UserProfileInterviews/UserProfileInterviews'
import ScorePage from './pages/Interviewer/Interview/ScorePage'

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
    JobService.getJobs(dispatch)
    JobService.getLocation(dispatch)
    JobService.getPosition(dispatch)
    JobService.getType(dispatch)
    EventService.getEvents(dispatch)
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
          <Route path='about-us' element={<AboutUs />} />
          <Route path='auth' element={<Authenticate />}>
            <Route path='login' element={<AuthenticateLogin />} />
            <Route path='signup' element={<AuthenticateSignUp />} />
            <Route element={<AuthenticateLogin />} />
          </Route>

          {/* This route is accepted when user is not logged in */}
          <Route element={<FilterNonLogin />}>
            <Route path='/email' element={<EmailConfirmationLayout />}>
              <Route path='incomplete' element={<IncompleteConfirmEmail />} />
              <Route path='complete' element={<CompleteConfirmEmail />} />
            </Route>
            <Route path='/otp' element={<OneTimePasswordVerify />} />
            <Route path='/forget-password' element={<ForgetPasswordLayout />}>
              <Route index element={<ForgetPassword />} />
              <Route path='confirm-password' element={<ConfirmPassword />} />
            </Route>
          </Route>

          {/* This route is only accepted when user is logged in and/or token is not broken  */}
          <Route element={<FilterCandidate />}>
            <Route path='/profile' element={<UserProfileLayout />}>
              <Route index element={<UserProfileMyProfile />} />
              <Route path='information' element={<UserProfileMyInformation />} />
              <Route path='resume' element={<UserProfileMyResume />} />
              <Route path='submitted-jobs' element={<UserProfileSubmittedJob />} />
              <Route path='interviews' element={<UserProfileInterviews />} />
            </Route>
            <Route path='/print-resume' element={<PrintResume />} />
          </Route>
        </Route>

        {/* ADMIN  */}
        <Route element={<FilterAdmin />}>
          <Route path='/admin' element={<ManagementAppLayOut />}>
            <Route index element={<AdminDashboard />} />
            <Route path='profile' element={<ReccerProfile />} />
            <Route path='account' element={<AdminManagerAccount />} />
            <Route path='create_account' element={<CreateAccount />} />
            <Route path='jobs' element={<AdminJobs />} />
            <Route path='jobs/:jobId' element={<AdminJobDetail />} />
            <Route path='events' element={<AdminEvents />} />
            <Route path='events/:eventId' element={<AdminEventDetail />} />
          </Route>
        </Route>

        {/* RECRUITER  */}
        <Route element={<FilterRecruiter />}>
          <Route path='/recruiter' element={<ManagementAppLayOut />}>
            {/* Define recruiter routes here */}
            <Route index element={<ReccerDashboard />} />
            <Route path='profile' element={<ReccerProfile />} />

            <Route path='jobs' element={<ReccerJobManagement />} />
            <Route path='jobdetail/:jobId' element={<ReccerJobDetail />} />
            <Route path='addjob' element={<AddJob />} />
            <Route path='jobdetail/:jobId/edit' element={<EditJob />} />
            <Route path='candidates' element={<ReccerCandidateManagement />} />
            <Route path='candidates/:userId' element={<CandidateDetail />} />
            <Route path='interviewers' element={<ReccerInterviewerManagement />} />
            <Route path='interviewers/:interviewerId' element={<ReccerInterviewerDetail />} />
            <Route path='events' element={<ReccerEventManagement />} />
            <Route path='events/:eventId' element={<ReccerEventDetail />} />
            <Route path='addevent' element={<AddEvent />} />

            <Route path='jobdetail/:jobId/interview-schedule/:userId' element={<InterviewSched />} />
          </Route>
        </Route>

        {/* INTERVIEW  */}
        <Route element={<FilterInterviewer />}>
          <Route path='/interviewer' element={<ManagementAppLayOut />}>
            <Route index element={<InterviewerDashboard />} />
            <Route path='profile' element={<InterviewProfile />} />
            <Route path='information' element={<InterviewInformation />} />
            <Route path='interview-recent' element={<InterviewRecent />} />
            <Route path='interview-recent/:id' element={<InterviewDetail />} />
            <Route path='candidate-recent' element={<CandidateRecent />} />
            <Route path='candidate-recent/:id' element={<INTCandidateDetail />} />
            <Route path='question' element={<ManageQuestion />} />
            <Route index path='interview-recent/:id/score-page' element={<ScorePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
