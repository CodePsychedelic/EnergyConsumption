const mongoose = require('mongoose');   // mongoose for mongoDB
mongoose.set('useCreateIndex', true);

// mongoose conneciton
mongoose.connect(
    'mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false',   // environmental variable for pw
    { useNewUrlParser: true , useUnifiedTopology: true }    // use new url parser and new monitoring
); 
const bcrypt = require('bcryptjs');
const users = require('../../api/models/User');


function makeid (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


    users.deleteMany({}).then(() => {

        const names = ['test', 'alkis', 'sotiris', 'markos', 'dummy1', 'dummy2', 'dummy3', 'dummy4', 'dummy5'];

        bcrypt.hash('123', 10, (err, hash) => {
            var k = 0;
            var quota = -2;
            var api_key;
            const docs = names.map(name => {
                k++;
                quota++;
                if(k === 1) api_key = '1111-1111-1111';
                else if(k === 2) api_key = '2222-2222-2222'
                else if(k === 3) api_key = '3333-3333-3333'
                else api_key = makeid(4) + '-' + makeid(4) + '-' + makeid(4);
                return {
                    username: name,
                    passwd: hash,
                    email: 'test' + k +'@test.com',
                    quota: quota,
                    quota_limit: quota,
                    api_key: api_key,
                    last_refresh: new Date()
                }
            })

            users.insertMany(docs).then(ok => console.log(ok)).catch(err => console.log(err));
        })
    }).catch(err => console.log(err));


