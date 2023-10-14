import classNames from 'classnames'

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {}

export default function Container({ children }: ContainerProps) {
  return (
    <div className={classNames(`container mx-auto max-w-full px-6 md:px-28 lg:px-36 xl:px-52 2xl:px-64`)}>
      <div className=''>{children}</div>
    </div>
  )
}
