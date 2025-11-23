import jwt from 'jsonwebtoken'

const authAdminGeneral = async (req, res, next) => {
    try {
        const {admingeneraltoken} = req.headers
        if(!admingeneraltoken){
            return res.json({success:false, message: 'No Estas Autorizado 1'})
        }
        const token_decode = jwt.verify(admingeneraltoken, process.env.JWT_SECRET)
        if(token_decode !== process.env.ADMIN_GENERAL_EMAIL + process.env.ADMIN_GENERAL_PASSWORD){
            return res.json({success:false, message: 'No Estas Autorizado 2'})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export default authAdminGeneral