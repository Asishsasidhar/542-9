import React from 'react';

import { renderApollo, cleanup, waitFor, fireEvent } from '../../test-utils';
import Launch, { GET_LAUNCH_DETAILS } from '../launch';
import { Route, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: false,
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

describe('Launch Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders launch and add to cart button', async () => {
    const mocks = [
      {
        request: { query: GET_LAUNCH_DETAILS, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];

    const history = ['/launch/1'];

    const { getByText } = await renderApollo(
      <Routes>
        <Route path="launch/:launchId" element={<Launch />} />
      </Routes>,
      {
        mocks,
        history,
        resolvers: {},
      },
    );

    await waitFor(() => getByText(/test mission/i));
    await waitFor(() => getByText(/add to cart/i))
  });
  it("toggling add to cart button to remove from cart and vice versa", async() => {
    const mocks = [
      {
        request: { query: GET_LAUNCH_DETAILS, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];

    const history = ['/launch/1'];

    const { getByText } = await renderApollo(
      <Routes>
        <Route path="launch/:launchId" element={<Launch />} />
      </Routes>,
      {
        mocks,
        history,
        resolvers: {},
      },
    );
    await waitFor(() => getByText(/add to cart/i))
    fireEvent.click(getByText(/add to cart/i));
    await waitFor(() => getByText(/remove from cart/i))
    fireEvent.click(getByText(/remove from cart/i));
    await waitFor(() => getByText(/add to cart/i))

    
    
  })

});
