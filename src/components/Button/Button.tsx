import classnames from 'classnames'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  className?: React.ComponentProps<'div'>['className']

  size?: 'sm' | 'md' | 'base' | 'xl'
}

export default function Button({ text, className, size, ...children }: ButtonProps) {
  let _size = size || 'base'
  return (
    <button
      className={classnames(
        `button`,
        `border`,
        `transition-colors ease-in-out duration-100`,
        `rounded-lg flex-col justify-center items-center inline-flex`,
        {
          'text-xs px-4 py-1': _size === 'sm',
          'text-sm px-6 py-2': _size === 'md',
          'text-base px-8 py-2': _size === 'base',
          'text-xl px-8 py-3': _size === 'xl'
        },
        `bg-zinc-100 hover:bg-zinc-300 hover:text-black`,
        `disabled:bg-zinc-600 disabled:text-zinc-300 disabled:cursor-no-drop`,
        className
      )}
      {...children}
    >
      {text}
    </button>
  )
}
