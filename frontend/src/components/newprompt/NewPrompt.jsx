import React, { useRef, useState } from 'react'
import './NewPrompt.css'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react'
import model from '../../lib/gemini'
import Markdown from 'react-markdown'

const NewPrompt = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [img, setImg] = useState({
    isLoading: false,
    dbData: {},
  })
  const endRef = useRef(null)

  const add = async (text) => {
    setQuestion(text)

    const result = await model.generateContent(text)
    const data = await result.response
    setAnswer(data.text())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = e.target.text.value
    add(text)
  }

  return (
    <>
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT_URL}
          path={img.dbData?.filePath}
          width='380'
        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && (
        <div className='message'>
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className='endChat' ref={endRef}></div>
      <form className='newForm' onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id='file' type='file' multiple={false} hidden />
        <input type='text' name='text' placeholder='Ask anything...' />
        <button>
          <img src='/arrow.png' alt='' />
        </button>
      </form>
    </>
  )
}

export default NewPrompt
