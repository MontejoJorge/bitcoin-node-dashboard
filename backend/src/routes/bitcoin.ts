import express from 'express';
import bitcoinRPC from 'bitcoin-core';

const client = new bitcoinRPC({
   host: process.env.BTC_HOST,
   port: process.env.BTC_PORT,
   username: process.env.BTC_USERNAME,
   password: process.env.BTC_PASSWORD,
});

const router = express.Router();

router.get('/main', async function (req, res, next) {
   const batch = [
      { method: 'getnettotals', parameters: [] },
      { method: 'getnetworkinfo', parameters: [] },
      { method: 'listbanned', parameters: [] },
      { method: 'getmempoolinfo', parameters: [] },
      { method: 'getblockcount', parameters: [] },
   ];

   const [netTotals, networkInfo, listBanned, mempoolInfo, blockCount] =
      await client.command(batch);

   res.json([
      { name: 'sent', value: netTotals.totalbytessent },
      { name: 'received', value: netTotals.totalbytesrecv },
      { name: 'connections', value: networkInfo.connections },
      { name: 'banned', value: listBanned.length },
      { name: 'mempool', value: mempoolInfo.size },
      { name: 'blocks', value: blockCount },
   ]);
});

router.get('/node', async function (req, res, next) {
   const batch = [
      { method: 'uptime', parameters: [] },
      { method: 'getnetworkinfo', parameters: [] },
   ];

   const [uptime, networkInfo] = await client.command(batch);

   res.json([
      { name: 'client', value: networkInfo.subversion.replaceAll('/', '') },
      { name: 'protocol', value: networkInfo.protocolversion },
      { name: 'services', value: networkInfo.localservices },
      { name: 'uptime', value: uptime },
   ]);
});

export default router;
