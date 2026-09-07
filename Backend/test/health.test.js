process.env.JWT_ACCESS_SECRET = '12345678901234567890123456789012';
process.env.JWT_REFRESH_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';

const { app } = await import('../src/app.js');
import test from 'node:test';
import assert from 'node:assert/strict';

 test('health endpoint returns service status', async () => {
  const server = app.listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data.status, 'ok');
  } finally {
    server.close();
  }
});
