const mongoose = require ("mongoose");

mongoose.connect(process.env.URL).then(() => 
    {
        console.log("Connecté à la base de données");
    }
);
