import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import './index.css'
import { ApplicationStore } from './redux/Store'

const appElement = document.getElementById('app')
if (appElement === null) {
  throw new Error(`Unable to find #app element.`)
}

const contextClass: any = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-yellow-500 text-yellow-100',
  warning: 'bg-orange-400',
  default: 'bg-zinc-800 font-zinc-200',
  dark: 'bg-white-600 font-gray-300'
}

createRoot(appElement).render(
  <React.StrictMode>
    <Provider store={ApplicationStore}>
      <App />
      <ToastContainer
        className={`rounded-xl`}
        toastClassName={({ type }: any) =>
          contextClass[type || 'default'] +
          ' relative flex flex-row p-1 min-h-10 rounded-xl overflow-hidden cursor-pointer items-center shadow-sm mb-4 transform-gpu'
        }
        closeButton={false}
        position='top-center'
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // pauseOnHover
        limit={3}
        theme='colored'
        transition={Slide}
      />
    </Provider>
  </React.StrictMode>
)
