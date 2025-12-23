import React from 'react'
import { useState } from 'react'

function MessageInput() {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
    
  return (
    <div>MessageInput</div>
  )
}

export default MessageInput