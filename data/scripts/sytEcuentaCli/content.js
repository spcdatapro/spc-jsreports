var postURL = "http://localhost/sayet/php/rptecuentacli.php/rptecuentacli";
var postURLHist = "http://localhost/sayet/php/rptecuentaclihisto.php/rptecuentacli";

function padZero(num){ return num < 10 ? ("0" + num) : num; }

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = padZero(hours) + ':' + padZero(minutes) + ' ' + ampm;
    return padZero(date.getDate()) + "/" + padZero((date.getMonth()+1)) + "/" + date.getFullYear() + "  " + strTime;
}

function beforeRender(req, res, done) {
    
    if (req.options.isChildRequest){
      return done();
    }
    
    var params = req.data;
    var periodo = {al: params.falstr};
    request.data = {
        fechas: formatDate(new Date()),
        fecha: new Date(), 
        al: periodo.al,
        anti: []
    };
       
    if (params.detalle == 1){
        postURL = postURLHist;
    }
        
    require("request")({
        method:"POST",
        body: params,
        //body: {"idempresa":4, "detalle":0, "cliente":{"id":0}, "falstr":"2017-08-31","clistr":0},
        json: true,
        url: postURL
    }, function(err, response, body){
        //request.template.content = typeof body;
        //request.template.content = JSON.stringify(body);
        
        if(typeof body == 'string'){
            request.data.anti = JSON.parse(body.substring(1));
        }else{
            request.data.anti = body;
        }
        
        done();
    });
}