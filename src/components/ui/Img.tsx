import React from 'react'

const Img = (props: React.ImgHTMLAttributes<HTMLImageElement> & { $errorComponent?: React.ReactNode}) => {
  const [hasError, setHasError] = React.useState(false)
  const { $errorComponent, ...rest } = props
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
