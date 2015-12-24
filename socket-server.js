/**
 * Created by longnc on 12/22/15.
 */
var server = require(appRoot+'/server');
module.exports = function(io){
    io.on("connection", function(socket){






        // disconnect socket =====================
        socket.on("disconnect", function(){
            console.log('Socket disconnect !');
        });
    });
};