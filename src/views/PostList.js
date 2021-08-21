import { Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import Sidebar from './BlogSidebar'
// import Avatar from '@components/avatar'
import { Link } from 'react-router-dom'
// import { MessageSquare } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge
//   Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink
} from 'reactstrap'
import moment from 'moment'
import API from '../api'

import '@styles/base/pages/page-blog.scss'

const PostList = () => {
    const placeholderImage = 'https://via.placeholder.com/450X300'
  const [data, setData] = useState(null)

  const getPosts = async () => {
    const getPostsResponse = await API.get('/posts')
    setData(getPostsResponse)
  }

  useEffect(() => {
    getPosts()
  }, [])

  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }
  const renderRenderList = () => {
    console.log(data)
    return data.map(item => {
      const renderCategories = () => {
        return item.categories && item.categories.map((category, index) => {
          return (
            <a key={index} href='/' onClick={e => e.preventDefault()}>
              <Badge
                className={classnames({
                  'mr-50': index !== item.categories.length - 1
                })}
                color={badgeColorsArr[category]}
                pill
              >
                {category}
              </Badge>
            </a>
          )
        })
      }

      return (
        <Col key={item.title} md='6'>
          <Card>
            <Link to={`/pages/blog/detail/${item.id}`}>
              <CardImg className='img-fluid' src={(item.image && `/uploads/${item.image}`) || placeholderImage} alt={item.title} top onError={`this.src=${placeholderImage}`} />
            </Link>
            <CardBody>
              <CardTitle tag='h4'>
                <Link className='blog-title-truncate text-body-heading' to={`/pages/blog/detail/${item.id}`}>
                  {item.title}
                </Link>
              </CardTitle>
              <div className='my-1 py-25'>{renderCategories()}</div>
              <CardText className='blog-content-truncate'>{item.content}</CardText>
              <hr />
              <div className='d-flex justify-content-between align-items-center'>
                <Link to={`/pages/blog/detail/${item.id}`}>
                  <span className='text-body font-weight-bold'>
                    <small className='text-muted'>{item.created && moment(item.created).format('MMM D, YYYY')}</small>
                </span>
                </Link>
                <Link className='font-weight-bold' to={`/pages/blog/detail/${item.id}`}>
                  Read More
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  return (
    <Fragment>
      <div className="container-sm py-2">
        <div className="d-flex justify-content-between">
          <h1 className="text-center mb-5">Post List</h1>
          <Link to='/admin/create'>Admin</Link>
        </div>
      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data && data.length !== 0 ? (
              <div className='blog-list-wrapper'>
                <Row>{renderRenderList()}</Row>
              </div>
            ) : <h3 className="text-center">No post</h3>}
          </div>
        </div>
        <Sidebar />
      </div>

      </div>
    </Fragment>
  )
}

export default PostList
