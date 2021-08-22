import { useEffect, useState, Fragment } from 'react'
import classnames from 'classnames'
import * as Icon from 'react-feather'
import Avatar from '@components/avatar'
import { InputGroup, InputGroupAddon, Input, InputGroupText, Button, ButtonGroup } from 'reactstrap'

const CategoriesSidebar = (props) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const {handleSearch, handleCategoryFilterSelect} = props
  const categories = [
    { category: 'Fashion', icon: 'Watch' },
    { category: 'Food', icon: 'ShoppingCart' },
    { category: 'Gaming', icon: 'Command' },
    { category: 'Quote', icon: 'Hash' },
    { category: 'Video', icon: 'Video' }
  ]
  // useEffect(() => {
  //   axios.get('/blog/list/data/sidebar').then(res => setData(res.data))
  // }, [])

  const CategoryColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }

  const handleCategoryButtonSelect = (e, category) => {
    const tempSelectedCategories = [...selectedCategories]
    const categoryIndex = tempSelectedCategories.indexOf(category)
    if (categoryIndex === -1) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(tempSelectedCategories.filter(c => c !== category))
    }
  }

  useEffect(() => {
    handleCategoryFilterSelect(selectedCategories)
  }, [selectedCategories])


  // const renderRecentPosts = () => {
  //   return data.recentPosts.map((post, index) => {
  //     return (
  //       <Media
  //         key={index}
  //         className={classnames({
  //           'mb-2': index !== data.recentPosts.length - 1
  //         })}
  //       >
  //         <Link className='mr-2' to={`/pages/blog/detail/${post.id}`}>
  //           <img className='rounded' src={post.img} alt={post.title} width='100' height='70' />
  //         </Link>
  //         <Media body>
  //           <h6 className='blog-recent-post-title'>
  //             <Link className='text-body-heading' to={`/pages/blog/detail/${post.id}`}>
  //               {post.title}
  //             </Link>
  //           </h6>
  //           <div className='text-muted mb-0'>{post.createdTime}</div>
  //         </Media>
  //       </Media>
  //     )
  //   })
  // }

  const renderCategories = () => {
    return categories.map((item, index) => {
      const IconTag = Icon[item.icon]

      return (
        <Button 
          className='rounded mb-50' 
          color={`flat-${CategoryColorsArr[item.category].split('light-')[1]}`} 
          key={index} 
          onClick={(e) => handleCategoryButtonSelect(e, item.category)}
          onMouseDown={(e) => e.preventDefault()}
          active={selectedCategories.indexOf(item.category) !== -1} >
          <div
            className={classnames('d-flex justify-content-start align-items-center')}
          >
            <a className='mr-75' href='/' onClick={e => e.preventDefault()}>
              <Avatar className='rounded' color={CategoryColorsArr[item.category]} icon={<IconTag size={15} />} />
            </a>
            <a href='/' onClick={e => e.preventDefault()}>
              <div className='blog-category-title text-body'>{item.category}</div>
            </a>
          </div>
        </Button>
      )
    })
  }

  return (
    <div className='sidebar-detached sidebar-right'>
      <div className='sidebar'>
        <div className='blog-sidebar right-sidebar my-2 my-lg-0'>
          <div className='right-sidebar-content'>
            <div className='blog-search'>
              <InputGroup className='input-group-merge'>
                <Input placeholder='Search here' onChange={(e) => handleSearch(e.target.value)} />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>
                    <Icon.Search size={14} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            {categories !== null ? (
              <Fragment>
                {/* <div className='blog-recent-posts mt-3'>
                  <h6 className='section-label'>Recent Posts</h6>
                  <div className='mt-75'>{renderRecentPosts()}</div>
                </div> */}
                <div className='blog-categories mt-3'>
                  <h6 className='section-label'>Categories</h6>
                  <div className='mt-1'>
                    <ButtonGroup className='mb-1 d-flex flex-lg-column flex-row flex-lg-nowrap flex-wrap'>
                      {renderCategories()}
                    </ButtonGroup>
                  </div>
                </div>
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesSidebar
