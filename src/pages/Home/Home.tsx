import { useState } from 'react'
import classNames from 'classnames'
import FormSearch from './FormSearch'
import Banner from './Banner'
import Jobs from './Jobs'
import Events from './Events'
import Advertise from '../../components/Advertise/Advertise'

export default function Home() {
  return (
    <div className={classNames('h-full')}>
      {/* Hero */}
      <Banner />

      {/* SEARCH  */}
      <FormSearch />

      {/* Jobs  */}
      <Jobs />

      {/* Events  */}
      <Events />

      {/* Explore jobs now  */}
      <Advertise />
    </div>
  )
}
