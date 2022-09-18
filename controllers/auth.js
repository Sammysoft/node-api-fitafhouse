
import User from "../config/user.model.schema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const auth = {
    _authUser: async(req,res,next)=>{
        const { username,password } = req.body;
        const user = await User.findOne({username: username})
        if(user === null){
            console.log('error')
             res.status(400).json({msg: 'Unregistered Account'})
        }else{
        user
             try {
                  bcrypt.compare( password, user.password, (err, isMatch)=>{
                      if(isMatch){
                          const payload =  {
                            id: user._id,
                           username: user.username
                       }
                           const accesstoken = jwt.sign(
                              payload, 'secret token', { expiresIn: "1d" }
                           )
                        //    const { password, ...others } = user._doc
                          res.status(200).json( {token: "Bearer " + accesstoken} )
                      }else{
                          res.status(400).json({msg: 'Wrong Password'})
                      }
                  })

             } catch (error) {
                  res.status(400).json( error)
             }
         }
    },


    _authAdmin: async()=>{
        const { email } = req.body;

    }
}