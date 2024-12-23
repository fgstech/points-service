const APIKeyService = require("../services/apiKeyService");

class AuthMiddleware {
  async protect(req, res, next) {
    const { apikey, secretkey, orgid } = req.headers;

    if (!apikey || !secretkey || !orgid) {
      return res.status(400).json({ error: 'Faltan apiKey, secretKey o orgId en los headers' });
    }

    try {
      if (!APIKeyService.validateApiKey(orgid, apikey, secretkey)) {
        return res.status(401).json({ error: 'Clave API o Secret Key inválidas' });
      }

      req.tenantId = orgid;
      next();
    } catch (error) {
      console.error('Error validando las claves:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async adminProtect(req,res,next){
    const { apikey, secretkey, orgid } = req.headers;
    
    if (!apikey || !secretkey || !orgid) {
      return res.status(400).json({ error: 'Faltan apiKey, secretKey o orgId en los headers' });
    }

    if(apikey === process.env.ADMIN && secretkey === process.env.SECRE_ADMIN && orgid === process.env.ORGID ){
      next();
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

}

module.exports = new AuthMiddleware();