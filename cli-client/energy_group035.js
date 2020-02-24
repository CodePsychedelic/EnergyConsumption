const cli = require('./cli');
const {setup} = require('./variables');


function help(){
    console.log('Usage: node energy_group035 SCOPE <arg> <options>');
    console.log('<arg>: ActualTotalLoad | DayAheadTotalLoadForecast | AggregatedGenerationPerType | ActualvsForecast | Admin | Login | Logout | Reset | Healthcheck');
    console.log('<options>(sets): timeres, area, date, prodtype(aggregated),format{optional}');
    console.log('<options>(Admin): userstatus, newuser (email, passw, quota), moduser (email, passw, quota *), newdata (source)}');
    console.log('<options>(Login): username, passw');
    console.log('<options>(Reset): pop (optional)');
    console.log('*: at least one');
}


setup();

let parse = cli.parse(process.argv);
if(parse.args.length === 0) help();