import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import {
  clearLocalToken,
  clearPermission,
  clearRefreshToken,
  getLocalToken,
  hasLocalToken,
  setLocalToken,
  setPermission,
  setRefreshToken
} from '../../utils/localToken'
import {
  AdminResponseState,
  LoadingState,
  RecRegisterParamsInterface,
  RecruiterResponseState,
  UserLoginParamsInterface,
  UserRegisterParamsInterface,
  UserResponseState
} from '../../types/user.type'
import { AuthService } from '../../services/AuthService'
import axiosInstance from '../../utils/AxiosInstance'
import { UserService } from '../../services/UserService'

interface AuthState {
  isLoggedIn: boolean
  user?: UserResponseState | null
  recruiter?: RecruiterResponseState | null
  admin?: AdminResponseState | null
  token: string | null
  loading: LoadingState
  signInLoadingState: LoadingState
  registerLoadingState: LoadingState
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: hasLocalToken() ? getLocalToken() : null,
  loading: `idle`,
  signInLoadingState: `idle`,
  registerLoadingState: `idle`
}

export const authRegister = createAsyncThunk(
  'Auth/register',
  async ({ name, email, password, confirmPassword }: UserRegisterParamsInterface, thunkAPI) => {
    // thunkAPI.dispatch()
    try {
      const response = await AuthService.register({
        name,
        email,
        password,
        confirmPassword
      })
      // const { result: token, message } = response.data;
      // thunkAPI.dispatch(setToken(token));
      // Fetch the user from token
      // thunkAPI.dispatch(fetchUserFromToken({ token }));

      // setLocalToken(token);

      return response.data.metadata
    } catch (err: any) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const authRecRegister = createAsyncThunk(
  'Auth/register',
  async (
    { companyName, name, position, phone, contactEmail, email, password, confirmPassword }: RecRegisterParamsInterface,
    thunkAPI
  ) => {
    try {
      const response = await AuthService.recRegister({
        companyName,
        name,
        position,
        phone,
        contactEmail,
        email,
        password,
        confirmPassword
      })

      return response.data.metadata
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const authLogin = createAsyncThunk(
  'Auth/login',
  async ({ email, password }: UserLoginParamsInterface, thunkAPI) => {
    thunkAPI.dispatch(setSignedInLoadingState(`pending`))
    try {
      const response = await AuthService.login({ email, password })

      if (response.status !== 200) {
        throw new Error(`There are some error when register: ${response.statusText}`)
      }

      const { metadata } = response.data
      const { permission } = metadata
      const { accessToken, refreshToken } = metadata.tokens
      // Set the token onto localStorage
      setLocalToken(accessToken)
      setRefreshToken(refreshToken)
      setPermission(permission)

      thunkAPI.dispatch(setSignedInLoadingState(`success`))
      thunkAPI.dispatch(setToken(accessToken))
      // Fetch the user from token
      // thunkAPI.dispatch(fetchUserFromToken(undefined))

      return response.data
    } catch (err: any) {
      // throw err;
      // console.log(err.response.data);
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const fetchUserFromToken = createAsyncThunk('Auth/fetch-user-from-token', async (_args: any, thunkAPI) => {
  try {
    console.debug(`Trying to fetch user from token ${getLocalToken()}`)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${getLocalToken()}`
    // Get the profile
    const profileResponse = await UserService.getRecFromToken()

    // thunkAPI.dispatch(setUser(profileResponse.data.metadata))
    return profileResponse.data.metadata
  } catch (err: any) {
    const { data, status } = err.response
    toast.error(`There was an error when fetch a profile from token.`)
    // clearLocalToken();
    throw err
    // return thunkAPI.rejectWithValue(data);
  }
})

export const fetchRecFromToken = createAsyncThunk('Auth/fetch-rec-from-token', async (_args: any, thunkAPI) => {
  try {
    console.debug(`Trying to fetch user from token ${getLocalToken()}`)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${getLocalToken()}`
    // Get the profile
    const profileResponse = await UserService.getRecFromToken()

    // thunkAPI.dispatch(setUser(profileResponse.data.metadata))
    return profileResponse.data.metadata
  } catch (err: any) {
    const { data, status } = err.response
    toast.error(`There was an error when fetch a profile from token.`)
    // clearLocalToken();
    throw err
    // return thunkAPI.rejectWithValue(data);
  }
})

export const fetchAdminFromToken = createAsyncThunk('Auth/fetch-admin-from-token', async (_args: any, thunkAPI) => {
  try {
    console.debug(`Trying to fetch user from token ${getLocalToken()}`)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${getLocalToken()}`
    // Get the profile
    const profileResponse = await UserService.getAdminFromToken()

    // thunkAPI.dispatch(setUser(profileResponse.data.metadata))
    return profileResponse.data.metadata
  } catch (err: any) {
    const { data, status } = err.response
    toast.error(`There was an error when fetch a profile from token.`)
    // clearLocalToken();
    throw err
    // return thunkAPI.rejectWithValue(data);
  }
})

export const authLogout = createAsyncThunk('Auth/logout', (_, thunkAPI) => {
  thunkAPI.dispatch(setUser(null))
  thunkAPI.dispatch(setAdmin(null))
  thunkAPI.dispatch(setRec(null))
  thunkAPI.dispatch(setToken(null))
  thunkAPI.dispatch(setUserLoggedIn(false))

  clearLocalToken()
  clearRefreshToken()
  clearPermission()
})

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUserLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setAdmin: (state, action) => {
      state.admin = action.payload
    },
    setRec: (state, action) => {
      state.recruiter = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setSignedInLoadingState: (state, action: { type: string; payload: LoadingState }) => {
      state.signInLoadingState = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(authRegister.pending, (state) => {
      state.registerLoadingState = 'pending'
    })
    builder.addCase(authRegister.fulfilled, (state) => {
      state.registerLoadingState = 'success'
    })

    builder.addCase(authRegister.rejected, (state) => {
      state.registerLoadingState = 'failed'
    })

    builder.addCase(authLogin.rejected, (state, _action) => {
      state.signInLoadingState = 'failed'
      state.isLoggedIn = false
    })

    builder.addCase(fetchRecFromToken.pending, (state, _action) => {
      state.recruiter = null
      state.isLoggedIn = false
      state.loading = `pending`
    })

    builder.addCase(fetchRecFromToken.fulfilled, (state, action) => {
      state.recruiter = action.payload
      state.isLoggedIn = true
      state.loading = `success`
    })
    builder.addCase(fetchRecFromToken.rejected, (state, action) => {
      state.recruiter = null
      state.isLoggedIn = false
      state.loading = `failed`
    })

    builder.addCase(fetchAdminFromToken.pending, (state, _action) => {
      state.admin = null
      state.isLoggedIn = false
      state.loading = `pending`
    })

    builder.addCase(fetchAdminFromToken.fulfilled, (state, action) => {
      state.admin = action.payload
      state.isLoggedIn = true
      state.loading = `success`
    })
    builder.addCase(fetchAdminFromToken.rejected, (state, action) => {
      state.admin = null
      state.isLoggedIn = false
      state.loading = `failed`
    })
    builder.addCase(authLogout.fulfilled, (state) => {
      state.isLoggedIn = false
      state.token = null
      state.user = null
      state.admin = null
      state.recruiter = null
    })
  }
})

export const { setUserLoggedIn, setUser, setToken, setSignedInLoadingState, setAdmin, setRec } = AuthSlice.actions

export default AuthSlice.reducer
