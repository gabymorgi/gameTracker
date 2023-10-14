import React, { useEffect } from 'react'

const Img = (props: React.ImgHTMLAttributes<HTMLImageElement> & { $errorComponent?: React.ReactNode}) => {
  const [hasError, setHasError] = React.useState(false)
  const { $errorComponent, ...rest } = props

  useEffect(() => {
    setHasError(false)
  }, [props.src])

  return hasError ? (
    <>{$errorComponent}</>
  ) : (
    <img
      {...rest}
      alt={props.alt || ''}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null // prevents looping
        setHasError(true)
      }}
    />
  )
}

export default Img
