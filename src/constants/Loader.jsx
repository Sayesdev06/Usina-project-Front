import React from 'react'
import { Oval } from 'react-loader-spinner'

const Loader = () => {
  return (
    <Oval
        height="80"
        width="80"
        radius="9"
        color="green"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
  )
}

export default Loader