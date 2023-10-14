import { useForm } from 'react-hook-form'

export default function Contact() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className='flex flex-col gap-6 mb-12'>
      <div className='flex flex-col items-center justify-center'>
        <h3 className='text-4xl font-semibold'>We'd Love to Hear From You</h3>
        <p className='text-lg text-gray-500'>
          Whether you're curious about features, a free trial, or even press -we're ready to answer any and all
          questions.
        </p>
      </div>
      <div className='flex flex-col md:flex-row gap-7'>
        <div className='w-full md:w-1/2'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485398611088!2d106.76933817486974!3d10.85063765782083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2sHCMC%20University%20of%20Technology%20and%20Education!5e0!3m2!1sen!2s!4v1692593798248!5m2!1sen!2s'
            width='100%'
            height='450'
            loading='lazy'
            title='Map'
          ></iframe>
        </div>
        <div className='w-full md:w-1/2'>
          <div className='w-full p-3 border border-gray-300 rounded-lg'>
            <h4 className='text-2xl font-semibold text-center'>Get in touch</h4>
            <form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex items-center gap-3'>
                <div className='flex flex-col w-1/2 mb-4'>
                  <label className='mb-1'>Your Name:</label>
                  <input
                    type='text'
                    className='p-2 border border-gray-300 focus:border-emerald-400'
                    placeholder='Enter your name'
                    {...register('name')}
                  />
                </div>
                <div className='flex flex-col w-1/2 mb-4'>
                  <label className='mb-1'>Your Email:</label>
                  <input
                    type='text'
                    className='p-2 border border-gray-300'
                    placeholder='Enter your email'
                    {...register('email')}
                  />
                </div>
              </div>
              <div className='flex flex-col mb-4'>
                <label className='mb-1'>Your Question:</label>
                <textarea
                  className='h-20 p-2 border border-gray-300'
                  placeholder='Enter your question'
                  {...register('question')}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label className='mb-1'>Your Message:</label>
                <textarea
                  className='h-20 p-2 border border-gray-300'
                  placeholder='Enter your message'
                  {...register('message')}
                />
              </div>
              <div className='flex justify-center'>
                <button className='p-3 text-white rounded-md bg-emerald-700'>Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
