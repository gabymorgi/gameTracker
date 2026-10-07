import { Icon as MdiIcon } from '@mdi/react'
import type { ComponentProps } from 'react'

type IconSize = 'small' | 'medium' | 'large'

type IconProps = Omit<ComponentProps<typeof MdiIcon>, 'size'> & {
  size?: IconSize
}

const sizes: Record<IconSize, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
} as const

export function Icon({ size = 'medium', ...props }: IconProps) {
  const resolvedSize = sizes[size] || size

  return <MdiIcon {...props} size={resolvedSize} />
}
