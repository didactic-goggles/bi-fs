import { useState, useEffect, useRef } from 'react'
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
  Media,
  Label,
  FormGroup,
  CustomInput,
  Button,
  Spinner
} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback
} from 'availity-reactstrap-validation-safe'
import Swal from 'sweetalert2'

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
    [image, setImage] = useState(''),
    [formPosting, setFormPosting] = useState(false),
    [formValidState, setFormValidState] = useState(false),
    formRef = useRef()

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
    if (!files[0]) {
      setImage(null)
      setImgPath('empty')
      setFeaturedImg(null)
      return
    }
    setImgPath(files[0].name)
    setImage(files[0])
    reader.onload = function () {
      setFeaturedImg(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  const refreshForm = () => {
    setTitle('')
    setImage(null)
    setImgPath('empty')
    setFeaturedImg(null)
    setPostCategories([])
    setEditorContent(null)
    setContent(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(''))))
    setFormPosting(false)
    setFormValidState(false)

    formRef.current.reset()
  }

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formValidState) throw new Error('Please fill all fields')
      setFormPosting(true)
      const createPostFormData = new FormData()
      createPostFormData.append('title', title)
      postCategories.forEach(pc => createPostFormData.append('categories', pc.label))
      createPostFormData.append('content', draftToHtml(editorContent))
      createPostFormData.append('image', image)
      const createPostResponse = await API.post('/posts', createPostFormData)
      Swal.fire({
        title: 'Success!',
        text: `${createPostResponse.title}(id: ${createPostResponse._id}) was created successfully `,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
      refreshForm()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
    }
    setFormPosting(false)
  }

  useEffect(() => {
    if (!title || !image || postCategories.length === 0 || !draftToHtml(editorContent)) setFormValidState(false)
    else setFormValidState(true)
  }, [title, image, postCategories, editorContent])

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
                <AvForm className='mt-2' onValidSubmit={handleCreatePostSubmit} ref={formRef}>
                  <Row>
                    <Col md='6'>
                    <AvGroup>
                      <Label for='name'>Title</Label>
                      <AvInput name='name' id='name' required value={title} onChange={e => setTitle(e.target.value)}/>
                      <AvFeedback>Please enter a valid title</AvFeedback>
                    </AvGroup>
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
                            <small className='text-muted'>Expected image resolution 900x600, image size less than 1mb.</small>

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
                      <Button.Ripple color='primary' className='mr-1' type='submit' disabled={!formValidState}>
                        {
                          formPosting ? <div className='d-flex align-items-center'>
                            <Spinner size="sm" /><span className='ml-1'>Creating</span>
                            </div> : 'Create'
                        }
                      </Button.Ripple>
                      <Button.Ripple color='secondary' outline type="reset" onClick={refreshForm}>
                        Cancel
                      </Button.Ripple>
                    </Col>
                  </Row>
                </AvForm>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default BlogEdit
