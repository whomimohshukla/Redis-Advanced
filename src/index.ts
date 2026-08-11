import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function main() {
  await client.connect();

  await client.set('hello', 'world');
  const value = await client.get('hello');

  console.log('Redis value:', value);

  await client.hSet('user:1', {
    name: 'Alice',
    role: 'developer',
  });

  const user = await client.hGetAll('user:1');
  console.log('User hash:', user);

  await client.zAdd('leaderboard', [
    { score: 100, value: 'alice' },
    { score: 90, value: 'bob' },
  ]);

  const leaderboard = await client.zRangeWithScores('leaderboard', 0, -1);
  console.log('Leaderboard:', leaderboard);

  await client.quit();
}

main().catch((err) => {
  console.error('App failed:', err);
  process.exit(1);
});
