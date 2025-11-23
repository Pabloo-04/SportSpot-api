import canchaModel  from '../models/canchaModel.js'

const canchaList = async (req, res) => {
    try {
        const canchas = await canchaModel.find({})
        res.json({success:true, canchas})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export {canchaList}
