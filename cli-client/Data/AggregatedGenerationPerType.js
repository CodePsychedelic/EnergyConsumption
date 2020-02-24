const axios = require('axios');
const fs = require('fs');
const messages = require('../messages');
//const apilogin = require('../Auth/ApiLogin');


// http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/2018/1/4
exports.gen_query = async (cli) => {
    // --area and --timeres are required
    if(cli.area === undefined || cli.prodtype === undefined || cli.timeres === undefined || (cli.date === undefined && cli.month === undefined && cli.year === undefined)) console.log(messages.AGGR_REQ_ARGS);
    else{
        const areaname = cli.area;
        const prodtype = cli.prodtype;
        const rescode = cli.timeres;
        const date_str = cli.date || cli.month || cli.year || '';
        const date_selector = (cli.date !== undefined)? 'date':'' || (cli.month !== undefined)? 'month':'' || (cli.year !== undefined)? 'year':'';
        
        // validation
        // -------------------------------------------------------------------------------
        
        if(areaname.includes('/')){
            console.log(messages.INVALID_CHARACTERS);
            return;
        }
        if(prodtype.includes('/')){
            console.log(messages.INVALID_CHARACTERS);
            return;
        }
        
        // rescode validation
        if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M'){
            console.log(messages.TIMERES_ERROR);
            return;
        }
        
        
        
        // date validation
        if(cli.date !== undefined && (date_str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null || date_str.length !== 10) ){
            // if date was given, it should match a pattern and have spessific len
            console.log(messages.DATE_ERROR);
            return;
        }else if(cli.month !== undefined && (date_str.match(/([12]\d{3}-(0[1-9]|1[0-2]))/) === null || date_str.length !== 7)){
            console.log(messages.MONTH_ERROR);
            return;
        }else if(cli.year !== undefined && (date_str.match(/([12]\d{3})/) === null || date_str.length !== 4)){
            console.log(messages.YEAR_ERROR);
            return;
        }


        if(cli.format !== undefined && cli.format !== 'json' && cli.format !=='csv'){
            console.log(messages.FORMAT_ERROR);
            return;
        }
        // -------------------------------------------------------------------------------
        
        // url creation
        // -------------------------------------------------------------------------------
        
        // date parse
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/' + areaname + '/' + prodtype + '/' + rescode + '/' + date_selector + '/' + date_str;
        
        
         // check auth
         let headers = {};
         let token = null;
         try{
             token = fs.readFileSync('./softeng19bAPI.token');
             headers.x_observatory_auth = token.toString();
         }catch(err){
             console.log("Waring: Requesting data, without being authenticated");
         }
 
        
        // check format
        if(cli.format !== undefined){
            url +='?format=' + cli.format;
        }
        // -------------------------------------------------------------------------------
        
        axios({
            method: 'get',
            url: url,
            headers: headers, 
            data: {}
        })
        .then(response => console.log(response.data))
        .catch(err => {
            if(err.response !== undefined) console.log(err.response.data)
            else {
                console.log(err.code);
                console.log(err.errno);
                console.log(err.address);
            }
        });
        

        
    }

}