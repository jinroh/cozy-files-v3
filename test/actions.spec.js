import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ROOT_DIR_ID } from '../src/constants/config'
import { OPEN_FOLDER, OPEN_FOLDER_SUCCESS, openFolder } from '../src/actions'

import cozy from 'cozy-client-js'

jest.mock('cozy-client-js', () => {
  return {
    files: {
      statById: jest.fn(() => ({
        _id: 'io.cozy.files.root-dir',
        attributes: {
          created_at: '0001-01-01T00:00:00Z',
          dir_id: '',
          name: '',
          path: '/',
          tags: null,
          type: 'directory',
          updated_at: '0001-01-01T00:00:00Z'
        },
        relations: () => {
          return [
            {
              _id: '33dda00f0eec15bc3b3c59a615001ac8',
              attributes: {
                created_at: '2017-01-03T08:52:37.093020313Z',
                dir_id: 'io.cozy.files.root-dir',
                name: 'foo',
                path: '/foo',
                tags: [],
                type: 'directory',
                updated_at: '2017-01-03T08:52:37.093020313Z'
              }
            }
          ]
        }
      }))
    }
  }
})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('fetchFiles', () => {
  it('should call cozy.files.statById', () => {
    const expectedActions = [
      {
        type: OPEN_FOLDER,
        folderId: 'io.cozy.files.root-dir'
      },
      {
        type: OPEN_FOLDER_SUCCESS,
        folder: {
          id: 'io.cozy.files.root-dir',
          created_at: '0001-01-01T00:00:00Z',
          dir_id: '',
          name: '',
          parent: {
            id: undefined
          },
          path: '/',
          tags: null,
          type: 'directory',
          updated_at: '0001-01-01T00:00:00Z'
        },
        files: [
          {
            id: '33dda00f0eec15bc3b3c59a615001ac8',
            created_at: '2017-01-03T08:52:37.093020313Z',
            dir_id: 'io.cozy.files.root-dir',
            name: 'foo',
            path: '/foo',
            tags: [],
            type: 'directory',
            updated_at: '2017-01-03T08:52:37.093020313Z'
          }
        ]
      }
    ]
    const store = mockStore({ })
    return store.dispatch(openFolder())
      .then(() => {
        expect(cozy.files.statById.mock.calls.length).toBe(1)
        expect(cozy.files.statById.mock.calls[0][0]).toBe(ROOT_DIR_ID)
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
