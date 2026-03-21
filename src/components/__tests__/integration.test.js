import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { GeistProvider } from '@geist-ui/react'

import UploadFiles from '../Upload'
import NavItem from '../Navbar/NavItem'
import Navbar from '../Navbar'
import QuickStart from '../../contents/QuickStart'
import DocumentGenerator from '../DocumentGenerator'
import { parseCollection } from '../../utils/postmanParser'
import sampleCollection from '../../test-data/sample-collection.json'

// Mock react-dropzone to avoid the attr-accept crash caused by
// react-dropzone v11 receiving a v12+ style accept prop (object instead of string).
jest.mock('react-dropzone', () => {
  const React = require('react')
  const Dropzone = ({ children, onDrop, multiple }) => {
    const inputRef = React.useRef(null)

    const handleChange = (event) => {
      const files = Array.from(event.target.files || [])
      if (onDrop) {
        onDrop(multiple === false ? files.slice(0, 1) : files)
      }
    }

    const getRootProps = (extra) => ({
      ...extra,
      onClick: () => inputRef.current && inputRef.current.click(),
    })

    const getInputProps = () => ({
      ref: inputRef,
      type: 'file',
      style: { display: 'none' },
      onChange: handleChange,
      'data-testid': 'file-input',
    })

    return children({ getRootProps, getInputProps, isDragActive: false })
  }

  Dropzone.displayName = 'Dropzone'
  return Dropzone
})

const Wrapper = ({ children }) => (
  <GeistProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </GeistProvider>
)

describe('Navbar', () => {
  test('renders all navigation items', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    )
    expect(screen.getByText('Nasıl Çalışır?')).toBeInTheDocument()
    expect(screen.getByText('Hızlı Başlangıç')).toBeInTheDocument()
  })

  test('marks the active route', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    )
    const activeItem = screen.getByText('Nasıl Çalışır?').closest('li')
    expect(activeItem).toHaveClass('active')
  })
})

describe('NavItem', () => {
  test('renders with correct text and link', () => {
    render(
      <Wrapper>
        <NavItem item="Test Link" tolink="/test-path" isActive={false} />
      </Wrapper>
    )
    const link = screen.getByText('Test Link')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/test-path')
  })

  test('applies active class when isActive is true', () => {
    render(
      <Wrapper>
        <NavItem item="Active" tolink="/active" isActive={true} />
      </Wrapper>
    )
    expect(screen.getByText('Active').closest('li')).toHaveClass('active')
  })

  test('does not apply active class when isActive is false', () => {
    render(
      <Wrapper>
        <NavItem item="Inactive" tolink="/x" isActive={false} />
      </Wrapper>
    )
    expect(screen.getByText('Inactive').closest('li')).not.toHaveClass('active')
  })
})

describe('Upload component', () => {
  test('renders dropzone text correctly', () => {
    render(
      <Wrapper>
        <UploadFiles onFileLoaded={jest.fn()} />
      </Wrapper>
    )
    expect(screen.getByText(/Postman JSON dosya/)).toBeInTheDocument()
  })

  test('renders file-input element', () => {
    render(
      <Wrapper>
        <UploadFiles onFileLoaded={jest.fn()} />
      </Wrapper>
    )
    expect(screen.getByTestId('file-input')).toBeInTheDocument()
  })

  test('calls onFileLoaded with valid JSON', async () => {
    const onFileLoaded = jest.fn()
    render(
      <Wrapper>
        <UploadFiles onFileLoaded={onFileLoaded} />
      </Wrapper>
    )

    const input = screen.getByTestId('file-input')
    const file = new File([JSON.stringify(sampleCollection)], 'col.json', {
      type: 'application/json',
    })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(
      () => {
        expect(onFileLoaded).toHaveBeenCalledWith(
          expect.objectContaining({
            info: expect.objectContaining({ name: 'Task Manager API' }),
          })
        )
      },
      { timeout: 3000 }
    )
  })

  test('shows error for invalid Postman JSON', async () => {
    const onFileLoaded = jest.fn()
    render(
      <Wrapper>
        <UploadFiles onFileLoaded={onFileLoaded} />
      </Wrapper>
    )

    const input = screen.getByTestId('file-input')
    const file = new File([JSON.stringify({ bad: true })], 'x.json', {
      type: 'application/json',
    })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(screen.getByText(/Hata/)).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(onFileLoaded).not.toHaveBeenCalled()
  })

  test('shows error for malformed JSON', async () => {
    const onFileLoaded = jest.fn()
    render(
      <Wrapper>
        <UploadFiles onFileLoaded={onFileLoaded} />
      </Wrapper>
    )

    const input = screen.getByTestId('file-input')
    const file = new File(['not json {{'], 'bad.json', {
      type: 'application/json',
    })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(screen.getByText(/Hata/)).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(onFileLoaded).not.toHaveBeenCalled()
  })
})

describe('QuickStart page', () => {
  test('renders upload area initially', () => {
    render(
      <Wrapper>
        <QuickStart />
      </Wrapper>
    )
    expect(screen.getByText(/Postman JSON dosya/)).toBeInTheDocument()
    expect(screen.getByText('Hızlı Başlangıç')).toBeInTheDocument()
  })
})

describe('Upload to DocumentGenerator flow', () => {
  test('uploading a valid file transitions to document generator', async () => {
    render(
      <Wrapper>
        <QuickStart />
      </Wrapper>
    )

    expect(screen.getByText(/Postman JSON dosya/)).toBeInTheDocument()

    const input = screen.getByTestId('file-input')
    const file = new File(
      [JSON.stringify(sampleCollection)],
      'collection.json',
      {
        type: 'application/json',
      }
    )
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(
      () => expect(screen.getByText(/Yeni dosya yükle/)).toBeInTheDocument(),
      { timeout: 3000 }
    )

    const { error, collection } = parseCollection(sampleCollection)
    expect(error).toBeNull()
    expect(collection.name).toBe('Task Manager API')
    expect(collection.items).toHaveLength(3)
  })
})

describe('DocumentGenerator', () => {
  let collection

  beforeAll(() => {
    const result = parseCollection(sampleCollection)
    collection = result.collection
  })

  test('renders tree viewer and readme panel', () => {
    render(
      <Wrapper>
        <DocumentGenerator collection={collection} />
      </Wrapper>
    )
    expect(screen.getByText('Ağaç Görünümü')).toBeInTheDocument()
    expect(screen.getByText('README Önizleme')).toBeInTheDocument()
  })

  test('shows collection info (folder and endpoint counts)', () => {
    render(
      <Wrapper>
        <DocumentGenerator collection={collection} />
      </Wrapper>
    )
    expect(screen.getByText(/3 klasör/)).toBeInTheDocument()
    expect(screen.getByText(/10 endpoint/)).toBeInTheDocument()
  })

  test('renders download button', () => {
    render(
      <Wrapper>
        <DocumentGenerator collection={collection} />
      </Wrapper>
    )
    expect(screen.getByTestId('download-btn')).toBeInTheDocument()
  })

  test('renders readme panel', () => {
    render(
      <Wrapper>
        <DocumentGenerator collection={collection} />
      </Wrapper>
    )
    expect(screen.getByTestId('readme-panel')).toBeInTheDocument()
  })
})
