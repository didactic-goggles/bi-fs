import { useState, useEffect } from 'react'
import Select from 'react-select'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import { selectThemeColors } from '@utils'
import { Editor } from 'react-draft-wysiwyg'
import Breadcrumbs from '@components/breadcrumbs'
import { EditorState, ContentState } from 'draft-js'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Media,
  Form,
  Label,
  Input,
  FormGroup,
  CustomInput,
  Button,
  Spinner
} from 'reactstrap'

import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/pages/page-blog.scss'
import API from '../api'

const BlogEdit = () => {
  const initialContent = ``

  const contentBlock = htmlToDraft(initialContent)
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  const editorState = EditorState.createWithContent(contentState)

  const [title, setTitle] = useState(''),
    [content, setContent] = useState(editorState),
    [editorContent, setEditorContent] = useState(editorState),
    [postCategories, setPostCategories] = useState([]),
    [featuredImg, setFeaturedImg] = useState(null),
    [imgPath, setImgPath] = useState('empty'),
    [image, setImage] = useState(null),
    [formPosting, setFormPosting] = useState(false)

  // useEffect(() => {
  //   axios.get('/blog/list/data/edit').then(res => {
  //     setData(res.data)
  //     setTitle(res.data.blogTitle)
  //     setSlug(res.data.slug)
  //     setPostCategories(res.data.postCategories)
  //     setFeaturedImg(res.data.featuredImage)
  //     setStatus(res.data.status)
  //   })
  // }, [])

  const categories = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'quote', label: 'Quote' },
    { value: 'video', label: 'Video' },
    { value: 'food', label: 'Food' }
  ]

  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    setImgPath(files[0].name)
    setImage(files[0])
    reader.onload = function () {
      setFeaturedImg(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault()
    console.log(e)
    try {
      setFormPosting(true)
      const createPostFormData = new FormData()
      createPostFormData.append('title', title)
      postCategories.forEach(pc => createPostFormData.append('categories', pc.label))
      // createPostFormData.append('categories', postCategories.map(pc => pc.label))
      createPostFormData.append('content', draftToHtml(editorContent))
      createPostFormData.append('image', image)
      const createPostResponse = await API.post('/posts', createPostFormData)
      console.log(createPostResponse)
    } catch (error) {
      
    }
    setFormPosting(false)
  }

  return (
    <div className='blog-edit-wrapper'>
      <Breadcrumbs
        breadCrumbTitle='Home'
        breadCrumbParent='Post'
        breadCrumbActive='Create'
      />
      
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                {/* <Media>
                  <Avatar className='mr-75' img={data.avatar} width='38' height='38' />
                  <Media body>
                    <h6 className='mb-25'>{data.userFullName}</h6>
                    <CardText>{data.createdTime}</CardText>
                  </Media>
                </Media> */}
                <Form className='mt-2' onSubmit={handleCreatePostSubmit}>
                  <Row>
                    <Col md='6'>
                      <FormGroup className='mb-2'>
                        <Label for='blog-edit-title'>Title</Label>
                        <Input id='blog-edit-title' value={title} onChange={e => setTitle(e.target.value)} />
                      </FormGroup>
                    </Col>
                    <Col md='6'>
                      <FormGroup className='mb-2'>
                        <Label for='blog-edit-category'>Category</Label>
                        <Select
                          id='blog-edit-category'
                          isClearable={false}
                          theme={selectThemeColors}
                          value={postCategories}
                          isMulti
                          name='colors'
                          options={categories}
                          className='react-select'
                          classNamePrefix='select'
                          onChange={data => setPostCategories(data)}
                        />
                      </FormGroup>
                    </Col>
                    {/* <Col md='6'>
                      <FormGroup className='mb-2'>
                        <Label for='blog-edit-slug'>Slug</Label>
                        <Input id='blog-edit-slug' value={slug} onChange={e => setSlug(e.target.value)} />
                      </FormGroup>
                    </Col>
                    <Col md='6'>
                      <FormGroup className='mb-2'>
                        <Label for='blog-edit-status'>Status</Label>
                        <Input
                          type='select'
                          id='blog-edit-status'
                          value={status}
                          onChange={e => setStatus(e.target.value)}
                        >
                          <option value='Published'>Published</option>
                          <option value='Pending'>Pending</option>
                          <option value='Draft'>Draft</option>
                        </Input>
                      </FormGroup>
                    </Col> */}
                    <Col sm='12'>
                      <FormGroup className='mb-2'>
                        <Label>Content</Label>
                        <Editor editorState={content} onEditorStateChange={data => setContent(data) } onContentStateChange={data => setEditorContent(data)}/>
                      </FormGroup>
                    </Col>
                    <Col className='mb-2' sm='12'>
                      <div className='border rounded p-2'>
                        <h4 className='mb-1'>Featured Image</h4>
                        <Media className='flex-column flex-md-row'>
                          {
                            featuredImg && <img
                            className='rounded mr-2 mb-1 mb-md-0'
                            src={featuredImg}
                            alt='featured img'
                            width='170'
                            height='110'
                          />
                          }

                          <Media body>
                            <small className='text-muted'>Required image resolution 800x400, image size 10mb.</small>

                            <p className='my-50'>
                              <a href='/' onClick={e => e.preventDefault()}>
                                {imgPath}
                              </a>
                            </p>
                            <div className='d-inline-block'>
                              <FormGroup className='mb-0'>
                                <CustomInput
                                  type='file'
                                  id='exampleCustomFileBrowser'
                                  name='customFile'
                                  onChange={onChange}
                                  accept='.jpg, .png, .gif'
                                />
                              </FormGroup>
                            </div>
                          </Media>
                        </Media>
                      </div>
                    </Col>
                    <Col className='mt-50'>
                      <Button.Ripple color='primary' className='mr-1' type='submit' disabled={formPosting}>
                        {
                          formPosting ? <div className='d-flex align-items-center'>
                            <Spinner size="sm" /><span className='ml-1'>Creating</span>
                            </div> : 'Create'
                        }
                      </Button.Ripple>
                      <Button.Ripple color='secondary' outline>
                        Cancel
                      </Button.Ripple>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default BlogEdit
