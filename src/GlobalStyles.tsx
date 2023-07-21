import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  .ant-select-dropdown {
    padding: 0px !important;
  }

  textarea::-webkit-input-placeholder { /* WebKit browsers */
    color: #848484;
  }

  textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #848484;
    opacity:  1;
  }

  textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #848484;
    opacity:  1;
  }

  textarea:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #848484;
  }
`
