import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import {
  clearLocalToken,
  clearRefreshToken,
  getLocalToken,
  hasLocalToken,
  setLocalToken,
  setRefreshToken
} from '../../utils/localToken'
import {
  LoadingState,
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
  async ({ fullName, email, phone, password, confirmPassword }: UserRegisterParamsInterface, thunkAPI) => {
    // thunkAPI.dispatch()
    try {
      const response = await AuthService.register({
        fullName,
        email,
        phone,
        password,
        confirmPassword
      })

      if (response.status !== 200) {
        throw new Error(`There are some error when register: ${response.statusText}`)
      }

      // const { result: token, message } = response.data;
      // thunkAPI.dispatch(setToken(token));
      // Fetch the user from token
      // thunkAPI.dispatch(fetchUserFromToken({ token }));

      // setLocalToken(token);

      return response.data
    } catch (err: any) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const authLogin = createAsyncThunk(
  'Auth/login',
  async ({ credentialId, password }: UserLoginParamsInterface, thunkAPI) => {
    thunkAPI.dispatch(setSignedInLoadingState(`pending`))
    try {
      const response = await AuthService.login({ credentialId, password })

      if (response.status !== 200) {
        throw new Error(`There are some error when register: ${response.statusText}`)
      }

      const { result } = response.data
      const { accessToken, refreshToken } = result
      // Set the token onto localStorage
      setLocalToken(accessToken)
      setRefreshToken(refreshToken)

      thunkAPI.dispatch(setSignedInLoadingState(`success`))
      thunkAPI.dispatch(setToken(accessToken))
      // Fetch the user from token
      thunkAPI.dispatch(fetchUserFromToken(undefined))

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
    const profileResponse = await UserService.getUserFromToken()
    if (profileResponse.status !== 200) {
      throw new Error(`Error when using authorize token ${getLocalToken()}`)
    }

    thunkAPI.dispatch(setUser(profileResponse.data.result))
    return profileResponse.data.result
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
  thunkAPI.dispatch(setToken(null))
  thunkAPI.dispatch(setUserLoggedIn(false))

  clearLocalToken()
  clearRefreshToken()
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
    builder.addCase(fetchUserFromToken.pending, (state, _action) => {
      state.user = null
      state.isLoggedIn = false
      state.loading = `pending`
    })

    builder.addCase(fetchUserFromToken.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
      state.loading = `success`
    })
    builder.addCase(fetchUserFromToken.rejected, (state, action) => {
      state.user = null
      state.isLoggedIn = false
      state.loading = `failed`
    })
    builder.addCase(authLogout.fulfilled, (state) => {
      state.isLoggedIn = false
      state.token = null
      state.user = null
    })
  }
})

export const { setUserLoggedIn, setUser, setToken, setSignedInLoadingState } = AuthSlice.actions

export default AuthSlice.reducer
