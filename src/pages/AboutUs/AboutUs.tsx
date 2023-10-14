import {
  AcademicCapIcon,
  BoltIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  PhoneIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import about_us_1 from '../../../images/about_us_1.png'
import about_us_2 from '../../../images/about_us_2.png'
import AboutUsCard from '../../components/AboutUsCard/AboutUsCard'
import Advertise from '../../components/Advertise/Advertise'
import QuestionsAnswers from '../../components/QuestionsAnswers/QuestionsAnswers'

const styleIcon = 'w-6 h-6 text-emerald-600 group-hover:text-white'
const aboutUsData = {
  jobStack: [
    {
      id: 1,
      title: '24/7 Support',
      icon: <PhoneIcon className={styleIcon} />
    },
    {
      id: 2,
      title: 'Tech & Startup Jobs',
      icon: <AcademicCapIcon className={styleIcon} />
    },
    {
      id: 3,
      title: 'Quick & Easy',
      icon: <BoltIcon className={styleIcon} />
    },
    {
      id: 4,
      title: 'Save Time',
      icon: <ClockIcon className={styleIcon} />
    },
    {
      id: 5,
      title: 'Apply with confidence',
      icon: <LightBulbIcon className={styleIcon} />
    },
    {
      id: 6,
      title: 'Reduce hiring bias',
      icon: <PhoneIcon className={styleIcon} />
    },
    {
      id: 7,
      title: 'proactive employers',
      icon: <BookOpenIcon className={styleIcon} />
    },
    {
      id: 8,
      title: 'no missed opportunities',
      icon: <SpeakerXMarkIcon className={styleIcon} />
    }
  ],
  questionsAnswers: [
    {
      id: 1,
      ques: 'How our Jobstack work ?',
      ans: 'Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts.'
    },
    {
      id: 2,
      ques: 'What is the main process open account ?',
      ans: "If the distribution of letters and 'words' is random, the reader will not be distracted from making a neutral judgement on the visual impact"
    },
    {
      id: 3,
      ques: 'How to make unlimited data entry ?',
      ans: 'Furthermore, it is advantageous when the dummy text is relatively realistic so that the layout impression of the final publication is not compromised.'
    },
    {
      id: 4,
      ques: 'Is Jobstack safer to use with my account ?',
      ans: "The most well-known dummy text is the 'Lorem Ipsum', which is said to have originated in the 16th century. Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin."
    }
  ]
}

export default function AboutUs() {
  return (
    <div>
      <div className={classNames('flex')}>
        <div className={classNames('w-1/2 pl-10')}>
          <div className={classNames('relative')}>
            <img src={about_us_1} alt='about_us_1' />
            <div>
              <img src={about_us_2} alt='about_us_2' className={classNames('absolute bottom-[-10%] right-[10%]')} />
            </div>
          </div>
        </div>
        <div className={classNames('w-1/2 flex items-start flex-col')}>
          <div className='flex flex-col gap-5'>
            <h3 className={classNames('text-[18px] md:text-[25px] lg:text-[48px] font-semibold')}>
              Millions of jobs.Find the one that's right for you.
            </h3>
            <p className={classNames('text-[12px] md:text-[18px] font-semibold text-gray-500')}>
              Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over
              30000+ companies worldwide.
            </p>
            <ul>
              <li className='flex items-center gap-1'>
                <CheckCircleIcon className='w-6 h-6 text-emerald-600' />
                <span>Digital Marketing Solutions for Tomorrow</span>
              </li>
              <li className='flex items-center gap-1'>
                <CheckCircleIcon className='w-6 h-6 text-emerald-600' />
                <span>Our Talented & Experienced Marketing Agency</span>
              </li>
              <li className='flex items-center gap-1'>
                <CheckCircleIcon className='w-6 h-6 text-emerald-600' />
                <span>Create your own skin to match your brand</span>
              </li>
            </ul>
          </div>
          <div className='mt-5'>
            <Link to='/jobs' className={classNames('bg-emerald-700 text-white p-3 px-5 rounded-md flex gap-2')}>
              <BriefcaseIcon className='w-6 h-6' />
              <span>Get Jobs</span>
            </Link>
          </div>
        </div>
      </div>
      <div className='mt-[40px] md:mt-[80px]'>
        <div className={classNames('text-center')}>
          <h3 className={classNames('text-black text-xl md:text-2xl font-medium leading-7 tracking-wider capitalize')}>
            Jobstack Features
          </h3>
          <p className={classNames('text-gray-400 text-center text-sm md:text-lg font-medium capitalize')}>
            Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over
            30000+ companies worldwide.
          </p>
        </div>
        <div className='flex flex-wrap items-center w-full'>
          {/* <!-- Card --> */}
          {aboutUsData.jobStack && aboutUsData.jobStack.map((item) => <AboutUsCard item={item} />)}
        </div>
      </div>
      <div className='mt-[40px] md:mt-[80px]'>
        <div className={classNames('text-center')}>
          <h3 className={classNames('text-black text-xl md:text-2xl font-medium leading-7 tracking-wider capitalize')}>
            Questions & Answers
          </h3>
          <p className={classNames('text-gray-400 text-center text-sm md:text-lg font-medium capitalize')}>
            Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over
            30000+ companies worldwide.
          </p>
        </div>
        <div className='flex items-start gap-5 px-5 mt-4'>
          <QuestionsAnswers questionsAnswers={aboutUsData.questionsAnswers} />
        </div>
      </div>

      <Advertise />
    </div>
  )
}
