import classNames from 'classnames'
import React from 'react'

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className={classNames('container mx-auto max-w-full px-6 md:px-28 lg:px-24 xl:px-40 2xl:px-44')}>
      <div>{children}</div>
    </div>
  )
}

export default Container
