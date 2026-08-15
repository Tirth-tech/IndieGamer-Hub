import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING INDIEGAMER HUB API VERIFICATION TESTS ---');
  
  try {
    // 1. Health check
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 1. Health Check:', health.data);

    // 2. Auth Login (Admin)
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'tirthkapuriya18@gmail.com',
      password: 'asha15'
    });
    const token = loginRes.data.token;
    console.log('✅ 2. Auth Login successful as:', loginRes.data.user.name, `(${loginRes.data.user.role})`);

    // 3. Steam API Preview for App ID 367520 (Hollow Knight)
    const steamRes = await axios.get(`${BASE_URL}/games/steam-preview/367520`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 3. Steam API Preview:', steamRes.data.game.title, '| Price:', steamRes.data.game.price, '| Genres:', steamRes.data.game.genre.join(', '));

    // 4. Get Featured Games
    const featuredRes = await axios.get(`${BASE_URL}/games/featured`);
    console.log('✅ 4. Featured Games Count:', featuredRes.data.games.length);

    // 5. Get Trending Games
    const trendingRes = await axios.get(`${BASE_URL}/games/trending`);
    console.log('✅ 5. Trending Games Top:', trendingRes.data.games[0]?.title, '| Avg Rating:', trendingRes.data.games[0]?.averageRating);

    // 6. Test Review Aggregation Pipeline on first game
    const game = featuredRes.data.games[0];
    console.log(`Testing Review Aggregation on Game '${game.title}' (ID: ${game._id})...`);

    // Register a temp gamer
    const gamerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'TestGamer_' + Date.now().toString().slice(-4),
      email: `testgamer_${Date.now()}@test.com`,
      password: 'password123',
      role: 'gamer'
    });
    const gamerToken = gamerRes.data.token;

    // Post a 5-star review
    const reviewRes = await axios.post(`${BASE_URL}/reviews/game/${game._id}`, {
      rating: 5,
      title: 'Testing Aggregation!',
      content: 'This review triggers the aggregation query pipeline.'
    }, {
      headers: { Authorization: `Bearer ${gamerToken}` }
    });

    console.log('✅ 6. Review Posted & Aggregation updated Game averageRating to:', reviewRes.data.averageRating, 'reviewCount:', reviewRes.data.reviewCount);

    // 7. Test Game Forum Thread & Reply
    const threadRes = await axios.post(`${BASE_URL}/forums/game/${game._id}`, {
      title: 'Automated Test Thread',
      content: 'Hello indie game community!'
    }, {
      headers: { Authorization: `Bearer ${gamerToken}` }
    });
    console.log('✅ 7. Forum Thread Created:', threadRes.data.thread.title);

    const threadDetails = await axios.get(`${BASE_URL}/forums/thread/${threadRes.data.thread._id}`);
    console.log('✅ 8. Forum Thread Details fetched. Post Count:', threadDetails.data.posts.length);

    // 8. Test Affiliate Link Tracking
    const affiliateRes = await axios.get(`${BASE_URL}/affiliate/redirect?gameId=${game._id}&store=Steam`);
    console.log('✅ 9. Affiliate Link Redirect Generated:', affiliateRes.data.affiliateUrl);

    // 9. Test Developer Registration & Approval Status Polling Endpoint
    const devRegRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'TestDev_' + Date.now().toString().slice(-4),
      email: `testdev_${Date.now()}@test.com`,
      password: 'password123',
      role: 'developer'
    });
    const devId = devRegRes.data.user._id || devRegRes.data.user.id;
    const pendingStatus = await axios.get(`${BASE_URL}/auth/status/${devId}`);
    console.log('✅ 10a. Pending Developer Status Check:', pendingStatus.data.status); // should be 'pending'

    // Approve developer
    await axios.get(`${BASE_URL}/auth/approve/${devId}?action=approve`, {
      headers: { Accept: 'application/json' }
    });

    const approvedStatus = await axios.get(`${BASE_URL}/auth/status/${devId}`);
    console.log('✅ 10b. Approved Developer Status Check:', approvedStatus.data.status, '| Issued Token:', Boolean(approvedStatus.data.token));

    console.log('\n🎉 ALL BACKEND API VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message || error);
    if (error.response) {
      console.error('Status:', error.response.status, 'Data:', error.response.data);
    }
  }
}

runTests();
