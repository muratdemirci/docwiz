import { generateReadme, downloadReadme } from '../readmeGenerator'
import { parseCollection } from '../postmanParser'
import sampleCollection from '../../test-data/sample-collection.json'

describe('readmeGenerator', () => {
  let collection

  beforeAll(() => {
    const result = parseCollection(sampleCollection)
    collection = result.collection
  })

  describe('generateReadme', () => {
    it('returns empty string for null collection', () => {
      expect(generateReadme(null)).toBe('')
    })

    it('generates markdown with collection name as title', () => {
      const md = generateReadme(collection)
      expect(md).toContain('# Task Manager API')
    })

    it('includes collection description', () => {
      const md = generateReadme(collection)
      expect(md).toContain('Task Manager REST API')
    })

    it('includes table of contents', () => {
      const md = generateReadme(collection)
      expect(md).toContain('## Table of Contents')
      expect(md).toContain('Auth')
      expect(md).toContain('Tasks')
      expect(md).toContain('Users')
    })

    it('includes overview with endpoint counts', () => {
      const md = generateReadme(collection)
      expect(md).toContain('## Overview')
      expect(md).toContain('**Total Endpoints:** 10')
    })

    it('includes method counts in overview', () => {
      const md = generateReadme(collection)
      expect(md).toContain('**GET:**')
      expect(md).toContain('**POST:**')
      expect(md).toContain('**PUT:**')
      expect(md).toContain('**DELETE:**')
    })

    it('generates documentation for each endpoint', () => {
      const md = generateReadme(collection)
      expect(md).toContain('Register User')
      expect(md).toContain('Login')
      expect(md).toContain('Get All Tasks')
      expect(md).toContain('Create Task')
      expect(md).toContain('Delete Task')
    })

    it('includes HTTP methods', () => {
      const md = generateReadme(collection)
      expect(md).toContain('`POST`')
      expect(md).toContain('`GET`')
      expect(md).toContain('`PUT`')
      expect(md).toContain('`DELETE`')
    })

    it('includes URLs', () => {
      const md = generateReadme(collection)
      expect(md).toContain('https://api.taskmanager.com/auth/register')
      expect(md).toContain('https://api.taskmanager.com/tasks')
    })

    it('includes request bodies in code blocks', () => {
      const md = generateReadme(collection)
      expect(md).toContain('```json')
      expect(md).toContain('"username"')
    })

    it('includes query parameters as tables', () => {
      const md = generateReadme(collection)
      expect(md).toContain('**Query Parameters:**')
      expect(md).toContain('status')
      expect(md).toContain('page')
      expect(md).toContain('limit')
    })

    it('includes headers as tables', () => {
      const md = generateReadme(collection)
      expect(md).toContain('**Headers:**')
      expect(md).toContain('Authorization')
      expect(md).toContain('Content-Type')
    })

    it('includes response examples', () => {
      const md = generateReadme(collection)
      expect(md).toContain('**Responses:**')
      expect(md).toContain('201 Created')
    })

    it('includes DocWiz footer', () => {
      const md = generateReadme(collection)
      expect(md).toContain('DocWiz')
    })

    it('handles minimal collection', () => {
      const minimal = {
        name: 'Minimal API',
        description: '',
        items: [
          {
            type: 'request',
            name: 'Health',
            method: 'GET',
            url: '/health',
            headers: [],
            queryParams: [],
            body: null,
            responses: [],
          },
        ],
      }
      const md = generateReadme(minimal)
      expect(md).toContain('# Minimal API')
      expect(md).toContain('Health')
      expect(md).toContain('`GET`')
    })
  })

  describe('downloadReadme', () => {
    it('creates and triggers a download link', () => {
      const createObjectURL = jest.fn(() => 'blob:test')
      const revokeObjectURL = jest.fn()
      const click = jest.fn()
      const appendChild = jest.fn()
      const removeChild = jest.fn()
      const createElement = jest.fn(() => ({
        click,
        set href(v) {},
        set download(v) {},
      }))

      global.URL.createObjectURL = createObjectURL
      global.URL.revokeObjectURL = revokeObjectURL
      document.createElement = createElement
      document.body.appendChild = appendChild
      document.body.removeChild = removeChild

      downloadReadme('# Test', 'test.md')

      expect(createObjectURL).toHaveBeenCalled()
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalled()
    })
  })
})
