const jwt = require('jsonwebtoken');

module.exports = (req,res, next) =>{
   const token = req.header('Authorization')?.replace('Bearer ', ''); 

   if(!token){
        return res.status(401).json({msg:'No hay token,permiso denegado'});
   }
   try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
          console.log(cifrado);
          req.usuario = cifrado.usuario;
          next(); 
   } catch (error) {
        console.error("Error de JWT:", error.message);
        res.status(401).json({msg:'Token no valido'});
   }

};
