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
    .action(arg => {
        
        if(arg === 'Admin') {
            // admin option handlers, if SCOPE === 'Admin'
            // ------------------------------------------------------------------------------------------------------
            if(cli.userstatus) user_status(cli);    // --user status handler
            else if(cli.newuser) new_user(cli);             // --newuser handler
            else if(cli.moduser) mod_user(cli);             // --moduser handler
            else if(cli.newdata) {
                upload(cli);
            }
            // ------------------------------------------------------------------------------------------------------
        }
        else if(arg === 'ActualTotalLoad' || arg === 'DayAheadTotalLoadForecast' || arg === 'AggregatedGenerationPerType' || arg === 'ActualvsForecast'){
            
            // data option handlers if scope === ...(file)
            // ------------------------------------------------------------------------------------------------------
            switch(arg){
                case 'ActualTotalLoad':
                    load_query(cli,'ActualTotalLoad');
                    break;
                case 'AggregatedGenerationPerType':
                    gen_query(cli);
                    break;
                case 'DayAheadTotalLoadForecast':
                    load_query(cli,'DayAheadTotalLoadForecast');
                    break;
                case 'ActualvsForecast':
                    load_query(cli,'ActualvsForecast');
                    break;
            }
            // ------------------------------------------------------------------------------------------------------
            
        }
        else if(arg === 'HealthCheck'){
            hcheck(cli);
        }else if(arg === 'Reset'){
            reset(cli);
        }
        else if(arg === 'Login'){
            login(cli);
        }
        else if(arg === 'Logout'){
            logout(cli);
        }
        else {
            // scope bad format --> exit(1)
            console.log('Acceptable values for scope: ActualTotalLoad, AggregatedGenerationPerType, DayAheadTotalLoadForecast, ActualvsForecast');
            return process.exit(1);
        }
    });

cli
    .command('*')
    .action(() => {
        // acceptable commands -> exit(2)
        console.log("Acceptable commands: SCOPE <dataset|Admin>");
        return process.exit(2);
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
.option('-k, --apikey <key>', 'the api key needed to access data (required to view data)')

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


cli.parse(process.argv);
