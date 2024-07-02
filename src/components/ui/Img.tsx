import React, { useEffect } from 'react'

const Img = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    $errorComponent?: React.ReactNode
    href?: string
  },
) => {
  const [hasError, setHasError] = React.useState(false)
  const { $errorComponent, ...rest } = props

  const handleClick = () => {
    window.open(props.href, '_blank', 'noreferrer')
  }

  useEffect(() => {
    setHasError(false)
  }, [props.src])

  return hasError ? (
    <>{$errorComponent}</>
  ) : (
    <img
      {...rest}
      onClick={props.href ? handleClick : undefined}
      title={props.title}
      alt={props.alt || ''}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null // prevents looping
        setHasError(true)
      }}
    />
  )
}

export default Img
