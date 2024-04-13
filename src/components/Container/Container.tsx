import classNames from 'classnames'

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {}

export default function Container({ children }: ContainerProps) {
  return (
    <div className={classNames(`container mx-auto max-w-full px-6 md:px-28 lg:px-24 xl:px-40 2xl:px-44`)}>
      <div className=''>{children}</div>
    </div>
  )
}
