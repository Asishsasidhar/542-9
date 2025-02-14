import React from 'react';

import { renderApollo, cleanup, fireEvent, waitFor } from '../../test-utils';
import BookTrips, { BOOK_TRIPS } from '../book-trips';
import { GET_LAUNCH } from '../cart-item';
import {cartItemsVar, cache} from "../../cache"
const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    id: 1,
    name: 'tester',
  },
  mission: {
    name: 'test mission',
    missionPatch: '/',
  },
};

describe('book trips', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    const { getByTestId } = renderApollo(<BookTrips cartItems={[]} />);
    expect(getByTestId('book-button')).toBeTruthy();
  });

  it('completes mutation and shows message', async () => {
    let mocks = [
      {
        request: { query: BOOK_TRIPS, variables: { launchIds: ['1'] } },
        result: {
          data: {
            bookTrips: [{ success: true, message: 'success!', launches: [] }],
          },
        },
      },
      {
        // we need this query for refetchQueries
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];
    const { getByTestId } = renderApollo(<BookTrips cartItems={['1']} />, { mocks, addTypename: false });

    fireEvent.click(getByTestId('book-button'));

    // Let's wait until our mocked mutation resolves and
    // the component re-renders.
    // getByTestId throws an error if it cannot find an element with the given ID
    // and waitFor will wait until the callback doesn't throw an error
    await waitFor(() => getByTestId('message'));
  });

  // >>>> TODO
  it('correctly updates cache', async () => {
    let mocks = [
      {
        request: { query: BOOK_TRIPS, variables: { launchIds: ['1'] } },
        result: {
          data: {
            bookTrips: [{ success: true, message: 'success!', launches: [] }],
          },
        },
      },
      {
        // we need this query for refetchQueries
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];
    const { getByTestId } = renderApollo(
      <BookTrips cartItems={['1']} />,
      { mocks, addTypename: false ,cache},
    );
    fireEvent.click(getByTestId('book-button'));

    // checking whether cartItems in cache is empty after booking all trips in cart
    expect(cartItemsVar()).toEqual([]);

  });
});
