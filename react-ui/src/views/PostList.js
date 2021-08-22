import { Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import CategoriesSidebar from './CategoriesSidebar'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge,
  Spinner
} from 'reactstrap'
import moment from 'moment'
import parser from 'html-react-parser'
import API from '../api'

import '@styles/base/pages/page-blog.scss'

const PostList = () => {
  const placeholderImage = 'https://via.placeholder.com/450X300'
  const [allPosts, setAllPosts] = useState(null)
  const [filteredPosts, setFilteredPosts] = useState(null)
  const [search, setSearch] = useState('')

  const getPosts = async () => {
    const getPostsResponse = await API.get('/posts')
    if (getPostsResponse) {
      setAllPosts(getPostsResponse)
      setFilteredPosts(getPostsResponse)
      return
    }
    setAllPosts([])
    setFilteredPosts([])
  }

  useEffect(() => {
    getPosts()
  }, [])

  const handleSearch = (searchValue) => {
    setSearch(searchValue)
    if (searchValue !== '') {
      setFilteredPosts(allPosts.filter(p => p.title.toLocaleLowerCase().includes((searchValue.toLocaleLowerCase()))))
    } else setFilteredPosts(allPosts)
  }

  const handleCategoryFilterSelect = (filterCategories) => {
    if (!allPosts) return
    if (filterCategories.length === 0) {
      handleSearch(search)
      return
    }
    setFilteredPosts(allPosts.filter(p => p.categories.filter(pc => filterCategories.indexOf(pc) !== -1).length !== 0))
  }

  // const handleImageError = (e) => {
  //   e.target.onerror = null
  //   e.target.src = placeholderImage
  // }

  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }
  const renderRenderList = () => {
    if (!filteredPosts || filteredPosts.length === 0) return <h3 className="text-center ml-1">No posts</h3>
    return filteredPosts.map(item => {
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
        <Col key={item._id} md='6'>
          <Card>
            {/* <Link to={`/pages/blog/detail/${item._id}`}> */}
              <picture>
                <source media="(min-width:650px)" srcSet={`/uploads/${item.image}`} />
                <source media="(min-width:465px)" srcSet={`/uploads/rs-${item.image}`} />
                {/* <img src={`/uploads/${item.image}`} alt={product.title} className="product-image" onError={handleImageError}/> */}
                <CardImg 
                  className='img-fluid' 
                  src={`/uploads/${item.image}`} 
                  alt={item.title} 
                  top 
                   />
              </picture>
            {/* </Link> */}
            <CardBody className='d-flex flex-column'>
              <CardTitle tag='h4'>
                <span className='blog-title-truncate text-body-heading' >
                  {item.title}
                </span>
              </CardTitle>
              <div className='my-1 py-25'>{renderCategories()}</div>
              <CardText className='blog-content-truncate'>{parser(item.content)[0]}</CardText>
              <hr className='w-100 mt-auto'/>
              <div className='d-flex justify-content-between align-items-center'>
                <Link to={`/pages/blog/detail/${item.id}`}>
                  <span className='text-body font-weight-bold'>
                    <small className='text-muted'>{item.created && moment(item.created).format('MMM D, YYYY')}</small>
                </span>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  const Loading = () => (
    <div className='d-flex align-items-center'>
      <Spinner color='primary' size='lg' className='mr-1'/>
      <h4 className='mb-0'>Posts are loading</h4>
    </div>
  )

  return (
    <Fragment>
      <div className="container-sm py-2">
        <div className="d-flex justify-content-between">
          <h1 className="text-center mb-5">Bi-Fs Feed</h1>
          <Link to='/admin/create'>Admin</Link>
        </div>
      <div className='blog-wrapper d-flex d-lg-block flex-column-reverse'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            <div className='blog-list-wrapper'>
              {
                allPosts ?  <Row className='match-height'>{renderRenderList()}</Row> : <Loading />
              }
            </div>
          </div>
        </div>
        <CategoriesSidebar handleSearch={handleSearch} handleCategoryFilterSelect={handleCategoryFilterSelect} />
      </div>

      </div>
    </Fragment>
  )
}

export default PostList
