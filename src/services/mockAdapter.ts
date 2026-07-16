import MockAdapter from 'axios-mock-adapter';
import api from './api';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(api, { delayResponse: 1500 }); // simulated network delay of 1.5 seconds

// Mock any POST request to /login
// arguments for reply are (status, data, headers)
mock.onPost('/login').reply((config) => {
  const { badgeId, password } = JSON.parse(config.data);

  console.log(`Mock Adapter intercept: Login attempt for ${badgeId}`);

  // Basic validation mock
  if (badgeId === '#123456' && password === 'admin') {
    return [
      200,
      {
        token: 'mock-jwt-token-7389271',
        user: {
          id: 1,
          badgeId: badgeId,
          name: 'Commander Jane Roe',
          role: 'ADMIN',
        },
      },
    ];
  } else if (badgeId === '#555555' && password === 'officer') {
    return [
      200,
      {
        token: 'mock-jwt-token-9843231',
        user: {
          id: 2,
          badgeId: badgeId,
          name: 'Officer John Doe',
          role: 'OFFICER',
        },
      },
    ];
  } else if (badgeId === 'citizen' && password === 'citizen') {
    return [
      200,
      {
        token: 'mock-jwt-token-1111111',
        user: {
          id: 3,
          badgeId: badgeId,
          name: 'Alex Smith',
          role: 'CITIZEN',
        },
      },
    ];
  } else {
    return [
      401,
      {
        message: 'Invalid badge ID or password',
      },
    ];
  }
});

mock.onGet('/api/cases').reply(200, [
  { id: 'FIR-2026-001', title: 'Theft at Downtown St', status: 'Active', date: '2026-04-01' },
  { id: 'FIR-2026-042', title: 'Vandalism near Park', status: 'Pending Investigation', date: '2026-04-02' },
]);

mock.onGet('/api/citizen/reports').reply(200, [
  { id: 'CR-2026-015', type: 'Noise Complaint', status: 'Resolved', date: '2026-03-25', description: 'Loud construction noise late at night.' },
  { id: 'CR-2026-088', type: 'Suspicious Activity', status: 'Pending Review', date: '2026-04-03', description: 'Unknown individual loitering behind the convenience store for hours.' },
]);

mock.onGet('/api/stats').reply(200, {
  totalCases: 142,
  activeCases: 38,
  pendingReview: 14,
  officersDeployed: 22,
});

export default mock;
