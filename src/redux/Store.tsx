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

export const ApplicationStore = configureStore({
  reducer: {
    Home: HomeSlice,
    Job: JobSlice,
    JobDetail: JobDetailSlice,

    Navbar: NavbarSlice,
    Auth: AuthSlice,
    OneTimePassword: OneTimePasswordSlice,

    RecJobList: RecJobSlice,
    RecJobDetail: RecJobDetailSlice,

    RecInterviewerList: RecInterviewerSilce,
    CandidateList: CandidateListSlice,

    QuestionList: QuestionListSlice,
    INTCandidates: INTCandidatesSlice,
    INTInterviews: INTInterviewsSlice,
    INTQuestions: INTQuestionsSlice
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof ApplicationStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof ApplicationStore.dispatch
