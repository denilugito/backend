const adminModel = require('../models/adminModel')
const { responseReturn } = require('../utilities/response')
const { createToken } = require('../utilities/tokenCreate')
const bcrypty = require('bcrypt')

class authControllers {
    admin_login = async(req,res) => {
        const {email, password} = req.body
        try {
            const admin = await adminModel.findOne({email: email}).select('+password')
            // console.log(admin)
            if (admin) {
                const match = await bcrypty.compare(password, admin.password)
                // console.log(match)
                if (match) {
                    const token =  await createToken({
                        id : admin.id,
                        role : admin.role
                    })
                    res.cookie('accessToken',token,{
                        expires : new Date(Date.now() + 7*24*60*60*1000)
                    })
                    responseReturn(res,200,{token, message: "Login Success"})    
                } else {
                    responseReturn(res,404,{error: "Password Wrong"})    
                }
            } else {
                responseReturn(res,404,{error: "Email not found"})    
            }
        } catch (error) {
            responseReturn(res,500,{error: error.message})
        }
    }
    // End admin_login Method

    getUser = async(req, res) => {
        const {id, role} = req

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)    
                responseReturn(res, 200, {userInfo : user})
            } else {
                console.log('Seller Info In Progress')
            }
        } catch (error) {
            console.log(error.message)
        }

    } // end getUser method

}

module.exports = new authControllers()