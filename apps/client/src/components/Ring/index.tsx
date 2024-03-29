import { cva } from 'class-variance-authority'

const outerRingStyling = cva('relative rounded-full grid place-items-center shrink-0', {
  variants: {
    size: {
      lg: 'w-9 h-9',
      md: 'w-7 h-7',
      sm: 'w-[21px] h-[21px]',
      xs: 'w-4 h-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const innerRingStyling = cva('absolute rounded-full bg-white shrink-0', {
  variants: {
    size: {
      lg: 'w-5 h-5',
      md: 'w-4 h-4',
      sm: 'w-[11px] h-[11px]',
      xs: 'w-2 h-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type ColourRingProps = {
  colour: string
  size?: 'lg' | 'md' | 'sm' | 'xs'
}

// TODO: Add optional tooltip w/ prop "tip"
export const ColourRing = ({ colour, size }: ColourRingProps): JSX.Element => {
  return (
    <div className={outerRingStyling({ size })} style={{ backgroundColor: colour }}>
      <div className={innerRingStyling({ size })}></div>
    </div>
  )
}
