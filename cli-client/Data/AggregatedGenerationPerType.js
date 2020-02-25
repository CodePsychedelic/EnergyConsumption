const axios = require('axios');
const fs = require('fs');
const messages = require('../messages');
//const apilogin = require('../Auth/ApiLogin');


// http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/2018/1/4
exports.gen_query = async (cli) => {
    // --area and --timeres are required
    if(cli.area === undefined || cli.prodtype === undefined || cli.timeres === undefined || (cli.date === undefined && cli.month === undefined && cli.year === undefined)) return messages.AGGR_REQ_ARGS;
    else{
        const areaname = cli.area;
        const prodtype = cli.prodtype;
        const rescode = cli.timeres;
        const date_str = cli.date || cli.month || cli.year || '';
        const date_selector = (cli.date !== undefined)? 'date':'' || (cli.month !== undefined)? 'month':'' || (cli.year !== undefined)? 'year':'';
        
        // validation
        // -------------------------------------------------------------------------------
        
        if(areaname.includes('/')){
            return messages.INVALID_CHARACTERS;
        }
        if(prodtype.includes('/')){
            return messages.INVALID_CHARACTERS;
        }
        
        // rescode validation
        if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M'){
            return messages.TIMERES_ERROR;
        }
        
        
        
        // date validation
        if(cli.date !== undefined && (date_str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null || date_str.length !== 10) ){
            // if date was given, it should match a pattern and have spessific len
            return messages.DATE_ERROR;
            
        }else if(cli.month !== undefined && (date_str.match(/([12]\d{3}-(0[1-9]|1[0-2]))/) === null || date_str.length !== 7)){
            return messages.MONTH_ERROR;
        }else if(cli.year !== undefined && (date_str.match(/([12]\d{3})/) === null || date_str.length !== 4)){
            return messages.YEAR_ERROR;
        }


        if(cli.format !== undefined && cli.format !== 'json' && cli.format !=='csv'){
            return messages.FORMAT_ERROR;
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
        
         // finally the request
        // -------------------------------------------------------------------------------
        try{
            let response = await axios.get(url,{headers: headers});
            return response.data;
        }catch(err){
            if(err.response !== undefined) return err.response.data;
            else {
                return {
                    code: err.code,
                    no: err.errno,
                    address: err.address
                };
            }
        }
        
        

        
    }

}