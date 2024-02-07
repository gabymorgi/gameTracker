import { Modal as AntModal, ModalProps } from 'antd'
import styled from 'styled-components'

const StyledModal = styled(AntModal)`
  top: 16px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  margin: 0;
  width: unset !important;
  .ant-modal-body {
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }
`

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <StyledModal
      styles={{
        mask: {
          backgroundColor: '#000a',
        },
      }}
      {...props}
    />
  )
}

export default Modal
