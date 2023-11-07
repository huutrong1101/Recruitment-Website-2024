import classnames from 'classnames'
import { useState } from 'react'

import { BiLogoFacebook, BiLogoGitlab, BiLogoInstagram, BiLogoLinkedin, BiLogoTwitter } from 'react-icons/bi'
import axiosInstance from '../../../../utils/AxiosInstance'
export default function Contact() {
  // Contact
  const [linkFacebook, setFacebook] = useState('')
  const [linkInstagram, setInstagram] = useState('')
  const [linkLinkedin, setLinkedin] = useState('')
  const [linkGitlab, setGitlab] = useState('')
  const [linkTwitter, setTwitter] = useState('')
  // SubmitButon
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const data = {
      linkContacts: {
        Facebook: linkFacebook,
        Instagram: linkInstagram,
        LinkedIn: linkLinkedin,
        Gitlab: linkGitlab,
        Twitter: linkTwitter
      }
    }
    console.log(data)
    try {
      const response = await axiosInstance.post('recruiter/profile/link-contact/add', data)
      console.log(response.data)
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error(error)
      // Handle error, e.g., show an error message
    }
  }
  return (
    <>
      {/* Lien he */}
      <form className='' onSubmit={handleSubmit}>
        {/* Link */}
        <div className={classnames('gap-10')}>
          {/* FB */}
          <div className={classnames('mt-5 flex items-center justify-center gap-3')}>
            <div className='p-1 border border-gray-500 cursor-pointer rounded-xl hover:bg-emerald-300 hover:text-white'>
              <BiLogoFacebook size={20} />
            </div>
            <div>
              <input
                type='text'
                value={linkFacebook}
                className='border rounded-xl'
                onChange={(event) => setFacebook(event.target.value)}
                placeholder=''
              />
            </div>
          </div>

          {/* IN */}
          <div className={classnames('flex items-center justify-center gap-3')}>
            <div className='p-1 border border-gray-500 cursor-pointer rounded-xl hover:bg-emerald-300 hover:text-white'>
              <BiLogoInstagram size={20} />
            </div>
            <div>
              <input
                type='text'
                value={linkInstagram}
                className='border rounded-xl'
                onChange={(event) => setInstagram(event.target.value)}
                placeholder=''
              />
            </div>
          </div>

          {/* LK */}
          <div className={classnames('flex items-center justify-center gap-3')}>
            <div className='p-1 border border-gray-500 cursor-pointer rounded-xl hover:bg-emerald-300 hover:text-white'>
              <BiLogoLinkedin size={20} />
            </div>
            <div>
              <input
                type='text'
                value={linkLinkedin}
                className='border rounded-xl'
                onChange={(event) => setLinkedin(event.target.value)}
                placeholder=''
              />
            </div>
          </div>

          {/* GitlLap */}
          <div className={classnames('flex items-center justify-center gap-3')}>
            <div className='p-1 border border-gray-500 cursor-pointer rounded-xl hover:bg-emerald-300 hover:text-white'>
              <BiLogoGitlab size={20} />
            </div>
            <div>
              <input
                type='text'
                value={linkGitlab}
                className='border rounded-xl'
                onChange={(event) => setGitlab(event.target.value)}
                placeholder=''
              />
            </div>
          </div>

          {/*Twitter*/}
          <div className={classnames('mb-2 flex items-center justify-center gap-3')}>
            <div className='p-1 border border-gray-500 cursor-pointer rounded-xl hover:bg-emerald-300 hover:text-white'>
              <BiLogoTwitter size={20} />
            </div>
            <div>
              <input
                type='text'
                value={linkTwitter}
                className='border rounded-xl'
                onChange={(event) => setTwitter(event.target.value)}
                placeholder=''
              />
            </div>
          </div>

          {/*Summit*/}
          <div className={classnames('mb-5 flex items-center justify-center gap-3 ')}>
            <button
              onClick={handleSubmit}
              type='submit'
              className='px-4 py-2 text-white border rounded-xl bg-emerald-600'
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
