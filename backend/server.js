const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/api/message',(req,res)=>{
    res.json({message: "Hello from Uniconnect Backend!"});
});


app.listen(port, () => {
    console.log(`Uniconnect Backend at http://localhost:${port}`);
});