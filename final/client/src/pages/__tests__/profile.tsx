import React from 'react';

import { renderApollo, cleanup, waitFor } from '../../test-utils';
import Profile, { GET_MY_TRIPS } from '../profile';

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 1,
    name: 'tester',
  },
  mission: {
    __typename: 'Mission',
    id: 1,
    name: 'test mission',
    missionPatch: '/',
  },
};

const mockMe = {
  __typename: 'User',
  id: 1,
  email: 'a@a.a',
  trips: [mockLaunch],
};

const emptyCartMock = {
  __typename: 'User',
  id: 1,
  email: 'a@a.a',
  trips: [],
}

describe('Profile Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders profile page', async () => {
    const mocks = [
      {
        request: { query: GET_MY_TRIPS },
        result: { data: { me: mockMe } },
      },
    ];

    const { getByText } = renderApollo(<Profile />, { mocks });

    // if the profile renders, it will have the list of missions booked
    await waitFor(() => getByText(/test mission/i));
  });

  it('empty profile page', async()=> {
    const mocks = [
      {
        request: { query: GET_MY_TRIPS },
        result: { data: { me: emptyCartMock } },
      },
    ]
    const { getByTestId } = renderApollo(<Profile />, { mocks });

    await waitFor(()=> getByTestId('no-trps-msg'))
  })
});
