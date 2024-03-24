import { useState } from 'react'
import classNames from 'classnames'
import FormSearch from './FormSearch'
import Banner from './Banner'
import Jobs from './Jobs'
import Events from './Events'
import Advertise from '../../components/Advertise/Advertise'
import Container from '../../components/Container/Container'

export default function Home() {
  return (
    <div className={classNames('h-full')}>
      {/* Banner không bị bao bởi Container khi hiển thị */}
      <Banner />

      {/* Các phần còn lại được bao bởi Container */}
      <Container>
        <FormSearch />
        <Jobs />
        <Events />
        <Advertise />
      </Container>
    </div>
  )
}
