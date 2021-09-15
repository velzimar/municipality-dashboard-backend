const express = require('express');
const app = express();
//importing morgan
const morgan = require('morgan');
//importing bodyparser 
const bodyParser= require('body-parser');

//connecting to data base
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://espacecitoyen:espacecitoyen@espacecitoyen.ay5n0.mongodb.net/<espacecitoyen>?retryWrites=true&w=majority',
{
   useUnifiedTopology: true,
   useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);


//importing routes
const adminsRoutes = require ('./api/routes/admins.js');
const agentRoutes = require ('./api/routes/agents');
const municipalityRoutes = require ('./api/routes/municipalities.js');
const conditionRoutes = require('./api/routes/conditions.js');
const pieceRoutes = require('./api/routes/pieces.js');
const stepRoutes = require('./api/routes/steps.js');
const workflowRoutes = require('./api/routes/workflows.js');
const fileRoutes = require('./api/routes/files.js');
const filepiecesRoutes = require('./api/routes/filepieces.js');
const fileconditionsRoutes = require('./api/routes/fileconditions.js')


//handling CORS erros
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-headers','*');
    if (req.method === 'OPTIONS')
    {
        res.header("Access-ControL-Allow-Methods", 'PUT , POST , PATCH , DELETE, GET');
        return res.status(200).json({})
    }
next();
})

// using morgan for logging
app.use(morgan('dev'))

//using body parser to parse incoming requests 
app.use(bodyParser.urlencoded({extended: 'false'}))
app.use(bodyParser.json());





//specifying routes which handle requests (app.use)
app.use('/admins', adminsRoutes);
app.use('/municipalities', municipalityRoutes);
app.use('/conditions', conditionRoutes);
app.use('/pieces', pieceRoutes);
app.use('/steps', stepRoutes);
app.use('/workflows', workflowRoutes);
app.use('/agents',agentRoutes);
app.use('/files', fileRoutes);
app.use('/filepieces', filepiecesRoutes);
app.use('/fileconditions', fileconditionsRoutes);




//404 not found error if the route dosen t exist 
app.use((req,res,next) => {
const error = new Error('Not found');
error.status=404;
next(error);
})
//handling potential database errors 
app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;



