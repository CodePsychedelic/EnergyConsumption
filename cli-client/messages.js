module.exports = {
    TIMERES_ERROR: "Acceptable values for timeres: PT60M, PT30M, PT15M",
    DATE_ERROR: 'Please enter a valid date YYYY-MM-DD',
    MONTH_ERROR: 'Please enter a valid date-month YYYY-MM',
    YEAR_ERROR: 'Please enter a valid year YYYY',
    FORMAT_ERROR: 'Format should be either json or csv',
    AUTH_WARNING: "Waring: Requesting data, without being authenticated",
    INVALID_CHARACTERS: "Input contains invalid characters (/)",
    LOAD_REQ_ARGS: 'Required arguments are missing. Load queries need --area, --timeres and [--date | --month | --year]',
    AGGR_REQ_ARGS: 'Required arguments are missing. Generation queries need --area, --prodtype, --timeres and [--date | --month | --year]',



    EMAIL_ERROR: 'Invalid email address',
    QUOTA_ERROR: 'Quota needs to be numeric',
    PASSWD_ERROR: 'Password should be at least 3 characters long',
    AUTH_ERROR: 'No token found, please login',
    MOD_PARAMS: 'Required parameters are missing. Atleast one of --passw, --email, --quota is needed',
    NEW_USER_PARAMS: 'Required parameters are missing. Parameters needed: --passw, --email, --quota',
    NO_TOKEN_FOUND: 'No token found',

    NEW_DATA_ERROR: 'Accepted values for --newdata: ActualTotalLoad | DayAheadTotalLoadForecast | AggregatedGenerationPerType',
    SOURCE_ERROR: 'You need to define the source csv file correctly, using --source',
    FILE_NOT_FOUND:'The csv file speciffied, does not exist',


    LOGIN_PARAMS:'Required arguments are missing. We need --username and --passw'

}
