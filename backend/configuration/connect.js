const mongoose = require('mongoose')
// mongodb+srv://Imen:<azerty123>@cluster0.8v1o3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect('mongodb://127.0.0.1:27017/trivaw')
.then(
    ()=>{
        console.log('connected'); }
)
.catch(
    (err)=>{
        console.log(err); }
)

module.exports = mongoose;