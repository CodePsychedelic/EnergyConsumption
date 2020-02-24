function help(){
    console.log('Usage: node energy_group035 SCOPE <arg> <options>');
    console.log('<arg>: ActualTotalLoad | DayAheadTotalLoadForecast | AggregatedGenerationPerType | ActualvsForecast | Admin | Login | Logout | Reset | Healthcheck');
    console.log('<options>(sets): timeres, area, date, prodtype(aggregated),format{optional}');
    console.log('<options>(Admin): userstatus, newuser (email, passw, quota), moduser (email, passw, quota *), newdata (source)}');
    console.log('<options>(Login): username, passw');
    console.log('<options>(Reset): pop (optional)');
    console.log('*: at least one');
}
    //process.env.RUN = 'TEST';

    const cli = require('commander');

    // administration handlers
    const {user_status} = require('./Administration/UserStatus');
    const {new_user} = require('./Administration/NewUser');
    const {mod_user} = require('./Administration/ModUser');

    const {load_query} = require('./Data/Load');
    const {gen_query} = require('./Data/AggregatedGenerationPerType');

    const {hcheck} = require('./Help/HelpEndpoints');
    const {reset} = require('./Help/HelpEndpoints');

    const {login} = require('./Auth/AuthEndpoints');
    const {logout} = require('./Auth/AuthEndpoints');
    const {upload} = require('./Administration/Upload');

    cli 
        .version('1.1.0')
        .description('Command Line Interface for softeng');

    cli
        .command('SCOPE <arg>')
        .action(async arg => {
            
            if(arg === 'Admin') {
                // admin option handlers, if SCOPE === 'Admin'
                // ------------------------------------------------------------------------------------------------------
                if(cli.userstatus) (process.env.RUN === 'TEST')? console.log('userstatus'):user_status(cli);            // --user status handler
                else if(cli.newuser) (process.env.RUN === 'TEST')? console.log('newuser'):new_user(cli);             // --newuser handler
                else if(cli.moduser) (process.env.RUN === 'TEST')? console.log('moduser'):mod_user(cli);             // --moduser handler
                else if(cli.newdata) (process.env.RUN === 'TEST')? console.log('upload'):upload(cli);               // --newdata handler
                
                // ------------------------------------------------------------------------------------------------------
            }
            else if(arg === 'ActualTotalLoad' || arg === 'DayAheadTotalLoadForecast' || arg === 'AggregatedGenerationPerType' || arg === 'ActualvsForecast'){
                
                // data option handlers if scope === ...(file)
                // ------------------------------------------------------------------------------------------------------
                switch(arg){
                    case 'ActualTotalLoad':
                        (process.env.RUN === 'TEST')? console.log('Actual'):load_query(cli,'ActualTotalLoad');
                        break;
                    case 'AggregatedGenerationPerType':
                        (process.env.RUN === 'TEST')? console.log('Aggregated'):gen_query(cli);
                        break;
                    case 'DayAheadTotalLoadForecast':
                        (process.env.RUN === 'TEST')? console.log('DayAhead'):load_query(cli,'DayAheadTotalLoadForecast');
                        break;
                    case 'ActualvsForecast':
                        (process.env.RUN === 'TEST')? console.log('ActualvsForecast'):load_query(cli,'ActualvsForecast');
                        break;
                }
                // ------------------------------------------------------------------------------------------------------
                
            }
            else if(arg === 'HealthCheck'){
                await hcheck(cli);
                console.log('test');
            }else if(arg === 'Reset'){
                reset(cli);
            }
            else if(arg === 'Login'){
                (process.env.RUN === 'TEST')? console.log('login'):login(cli);
            }
            else if(arg === 'Logout'){
                (process.env.RUN === 'TEST')? console.log('logout'):logout(cli);
            }
            else {
                // scope bad format --> exit(1)
                (process.env.RUN === 'TEST')? console.log('USAGE MESSAGE'):help();
            }
        });

    cli
        .command('*')
        .action(() => {
            (process.env.RUN === 'TEST')? console.log('USAGE MESSAGE'):help();
        });

    // administration options
    // ----------------------------------------------------------------------------
    cli.option('-s, --userstatus <username>', 'Returns user status using <username>')

    .option('-a, --newuser <username>', 'adds a new user')
    .option('-m, --moduser <username>', 'modify an existing user')
    .option('-d, --newdata <dataset>', 'add new data to the dataset')


    .option('-p, --passw <passwd>', 'password required for new user, mod user')
    .option('-e, --email <email>', 'email required for new user, mod user')
    .option('-q, --quota <quota>', 'quota required for new user, mod user')
    .option('-g, --source <src>', 'source file name required for data import')

    // ----------------------------------------------------------------------------


    // data options
    // ----------------------------------------------------------------------------
    //.option('-d, --scope <dataset>', 'select dataset between ActualTotalLoad, AggregatedGenerationPerType, DayAheadTotalLoadForecast, ActualvsForecast')
    .option('-f, --format <format>', 'format to download (json or csv)')
    .option('-c, --area <area>', 'distinct area for dataset (required)')
    .option('-t, --timeres <timere>', 'time resolution codes for dataset (required')
    .option('-w, --date <date>', 'full date YYYY-MM-DD for dataset')
    .option('-n, --month <month_date>', 'YYYY-MM for dataset')
    .option('-y, --year <year>', 'YYYY for dataset')
    .option('-r, --prodtype <prodtype>', 'distinct values for ProductionTypeText (required for AggGen)')
    // ----------------------------------------------------------------------------

    .option('-l, --pop <lvl>', 'optional parameter for population. if 1, ref tables, if 2 data tables too')
    .option('-u, --username <username>', 'required parameter for Login')
    .option('-z, --passw <password>', 'required parameter for Login')
    ;
    




module.exports = cli;

