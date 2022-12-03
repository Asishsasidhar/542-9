import React from 'react';
import { InMemoryCache } from '@apollo/client';

import { renderApollo, cleanup, waitFor } from '../../test-utils';
import Launches, { GET_LAUNCHES } from '../launches';

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 1,
    name: 'tester',
    type: 'test',
  },
  mission: {
    __typename: 'Mission',
    id: 1,
    name: 'test mission',
    missionPatch: '/',
  },
  site: 'earth',
  isInCart: false,
};
const mockLaunch_2 = {
  __typename: 'Launch',
  id: 2,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 2,
    name: 't2',
    type: 'test',
  },
  mission: {
    __typename: 'Mission',
    id: 2,
    name: 'test 2',
    missionPatch: '/',
  },
  site: 'earth',
  isInCart: true,
};
describe('Launches Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders launches', async () => {
    const cache = new InMemoryCache({ addTypename: false });
    const mocks = [
      {
        request: { query: GET_LAUNCHES },
        result: {
          data: {
            launches: {
              cursor: '123',
              hasMore: true,
              launches: [mockLaunch],
            },
          },
        },
      },
    ];
    const { getByText } = await renderApollo(<Launches />, {
      mocks,
      cache,
    });
    await waitFor(() => getByText(/test mission/i));
  });
  it('renders multiple launches', async () => {
    const cache = new InMemoryCache({ addTypename: false });
    const mocks = [
      {
        request: { query: GET_LAUNCHES },
        result: {
          data: {
            launches: {
              cursor: '123',
              hasMore: true,
              launches: [mockLaunch, mockLaunch_2],
            },
          },
        },
      },
    ];
    const { getByText } = await renderApollo(<Launches />, {
      mocks,
      cache,
    });
    await waitFor(() => expect(getByText(/test mission/i)).toBeInTheDocument);
    await waitFor(()=>  expect(getByText(/test 2/i)).toBeInTheDocument)
  });

  it('ERROR component renders', async () => {
    const cache = new InMemoryCache({ addTypename: false });
    const mocks = [
      {
        request: { query: GET_LAUNCHES },
        result: {
          data: null,
        },
      },
    ];
    const { getByText } = await renderApollo(<Launches />, {
      mocks,
      cache,
    });
    await waitFor(() => expect(getByText(/error/i)).toBeInTheDocument);
  });

});
