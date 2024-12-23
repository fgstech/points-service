require('dotenv').config();
const app = require('./src/app');
const run = require('./src/utils/cluster');
const pointsService = require('./src/services/pointsService');
const apiKeyService = require('./src/services/apiKeyService');
const PORT = process.env.PORT || 7773;

run(async () => {
  await apiKeyService.initializeDefaultApiKey();
  await pointsService.createSystemWallet();
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
}, false)



/*
{
  apiKey: 'e2d9d596432971c98a1ae90737b9c777',
  secretKey: 'ccd965992aa939cb4d1dec861c85673b4d8ebaf612dfdf280ef314a665d94774'
}
*/