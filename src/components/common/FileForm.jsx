import React, { useRef, useState, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import BackupIcon from '@mui/icons-material/Backup'
import DownloadIcon from '@mui/icons-material/CloudDownload'
import { ReactComponent as PdfIcon } from '../../media/icons/pdf.svg'
import { LoadingSpinner, CloseButton } from './'

export default function FileForm({ onChange, maxSize, allowedExtensions, error, display = 0, defaultUrl = '', label = '', text = '' }) {
  const inputFileButton = useRef(null)
  const [inputFile, setInputFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const { current: extensions } = useRef(allowedExtensions)

  const shouldShowInvalid = () => error !== undefined && error.length > 0
  const shouldShowValid = () => (error !== undefined && error === '' && display !== 1) || (error === undefined && display === 2)

  useEffect(() => {
    if (inputFile) {
      if (inputFile.size > maxSize || !extensions.includes('.'.concat(inputFile.type.substring(inputFile.type.indexOf('/') + 1)))) {
        setInputFile(null)
        setHighlight(true)
      } else {
        setUploading(true)
        onChange(inputFile, (r, pR) => {
          if (r.status !== 200) setInputFile(null)
          setHighlight(false)
          setUploading(false)
        })
      }
    }
  }, [extensions, inputFile, maxSize, onChange])

  // Click on cross
  const onClose = () => {
    setHighlight(false)
    setInputFile(null)
    onChange(null)
  }

  // Drag&Drop feature
  const onDrop = e => {
    e.preventDefault()
    setDragging(false)
    setInputFile(e.dataTransfer.files[0])
  }

  return (
    <Form.Group className='input-file'>
      <Form.Label>{label}</Form.Label>
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        className={`droppable-area ${display === 1 ? 'disabled' : dragging ? 'dragging' : display === 2 ? 'disabled valid' : ''}`}
        onClick={() => inputFileButton && inputFileButton.current && inputFileButton.current.click()}
      >
        {inputFile || (defaultUrl && defaultUrl !== '') ? (
          <>
            {display === 2 && (defaultUrl !== '' || inputFile) ? <div className='valid-icon' /> : <CloseButton onClick={onClose} />}
            {uploading ? <LoadingSpinner overlay={true} /> : null}
            {(inputFile && inputFile.name.slice(-4).toLowerCase() === '.pdf') ||
            (defaultUrl && defaultUrl.slice(-4).toLowerCase() === '.pdf') ? (
              <PdfIcon />
            ) : (
              <img alt='Government ID' src={inputFile ? URL.createObjectURL(inputFile) : defaultUrl} />
            )}
          </>
        ) : (
          <>
            {display === 2 ? <div className='valid-icon' /> : highlight ? <div className='invalid-icon' /> : null}
            <div className='zone-info'>
              {dragging ? (
                <>
                  <DownloadIcon className='icon' />
                  <div className='label'>
                    <span className='bold'>Drop</span> me here
                  </div>
                </>
              ) : (
                <>
                  <BackupIcon className='icon' />
                  <div className='label'>
                    <span className='bold'>Drop a file</span> or click to upload
                  </div>
                </>
              )}
              <div className={`file-info ${highlight && display !== 2 ? 'error' : ''}`}>
                Max file size {maxSize / 1048576}MB - Format {allowedExtensions.join(' ')}
              </div>
            </div>
          </>
        )}
        <input ref={inputFileButton} className='file-upload' type='file' onChange={e => setInputFile(e.target.files[0])} />
      </div>
      <Form.Text className={shouldShowInvalid() ? 'invalid' : shouldShowValid() ? 'valid' : ''}>
        {shouldShowInvalid() ? error : text}
      </Form.Text>
    </Form.Group>
  )
}
