function cors (req, res, next) 
{
    res.setHeader("Access-Control-Allow-Origin", `http://localhost:${process.env.PORT_FRONT}`);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Origin, X-Requested-With, Accept"
    );
    if(req.method === "OPTIONS") 
    {
      return res.sendStatus(200);
    }
    next();
  }
  
  module.exports = cors;  