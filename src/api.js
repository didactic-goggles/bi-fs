import { Fragment } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Avatar from '@components/avatar'
import { X } from 'react-feather'

const ErrorToast = (props) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="danger" icon={<X size={12} />} />
        <h6 className="toast-title">Error!</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        {props.content}
      </span>
    </div>
  </Fragment>
)

const showError = (content) => toast.error(<ErrorToast content={content} />, { hideProgressBar: true })

const API = axios.create({
    baseURL: 'http://localhost:3001'
})

API.interceptors.response.use(
  (response) => {
    return response.data.data || response.data
  },
  (err) => {
    showError('Something went wrong')
    Promise.reject('Something went wrong')
  }
)

export default API
