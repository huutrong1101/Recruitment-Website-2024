import { configureStore } from '@reduxjs/toolkit'
import NavbarSlice from './reducer/NavbarSlice'
import HomeSlice from './reducer/HomeSlice'
import AuthSlice from './reducer/AuthSlice'
import OneTimePasswordSlice from './reducer/OneTimePasswordSlice'
import JobSlice from './reducer/JobSlice'
import JobDetailSlice from './reducer/JobDetailSlice'
import RecJobSlice from './reducer/RecJobSlice'
import RecJobDetailSlice from './reducer/RecJobDetailSlice'
import RecInterviewerSilce from './reducer/RecInterviewerSilce'
import CandidateListSlice from './reducer/CandidateListSlice'
import QuestionListSlice from './reducer/QuestionListSlice'
import INTCandidatesSlice from './reducer/INTCandidatesSlice'
import INTInterviewsSlice from './reducer/INTInterviewsSlice'
import INTQuestionsSlice from './reducer/INTQuestionsSlice'
import UserInterviewSlice from './reducer/UserInterviewSlice'
import AdminListAcountRecentSlice from './reducer/AdminListAcountRecentSlice'
import RecSlice from './reducer/RecSlice'
import AdminSlice from './reducer/AdminSlice'

export const ApplicationStore = configureStore({
  reducer: {
    Home: HomeSlice,
    Job: JobSlice,
    JobDetail: JobDetailSlice,

    RecJobs: RecSlice,

    Navbar: NavbarSlice,
    Auth: AuthSlice,
    OneTimePassword: OneTimePasswordSlice,

    AdminSlice: AdminSlice,

    RecJobList: RecJobSlice,
    RecJobDetail: RecJobDetailSlice,

    RecInterviewerList: RecInterviewerSilce,
    CandidateList: CandidateListSlice,
    UserInterview: UserInterviewSlice,

    QuestionList: QuestionListSlice,
    INTCandidates: INTCandidatesSlice,
    INTInterviews: INTInterviewsSlice,
    INTQuestions: INTQuestionsSlice,

    AdminacountList: AdminListAcountRecentSlice
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof ApplicationStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof ApplicationStore.dispatch
