exports.PowerSupply = function(mongoose, mongooseValidator) {
    var powerSupplySchema = new mongoose.Schema({
        model:          {type: String},
        series:         {type: String},
        manufacturer:   {type: String},
        manPage:        {type: String},
        price:          {type: Number},
        psuType:        {type: String},
        maxPower:       {type: Number},
        energyCert:     {type: String},
        fanSize:        {type: Number},
        mainConnector:  {type: Number},
        sataConn:       {type: Number},
        peripheralConn: {type: Number},
        floppyConn:     {type: Number},
        gpu8PinConn:    {type: Number},
        gpu6PinConn:    {type: Number},
        gpu6_2PinConn:  {type: Number},
        multiGpu:       {type: Boolean},
        cpuPinConn: {
            cpu8Pin:   {type: Number},
            cpu4Pin:   {type: Number},
            cpu4_4Pin: {type: Number}
        }
    });
};