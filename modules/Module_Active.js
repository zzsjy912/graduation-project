
const UserActive = require('../models/UserAcive');


 Module_Active = {
    name : 'Module_Active',
    save : function (newUserAcive) {
        UserActive.countDocuments({}).then(data => {
            var id = data + 1;
            newUserAcive.useracive_id = id;
            new UserAcive(newUserAcive).save()
                .then(useractive => {
                    console.log(useractive);
                    
                })
        })
    }
}


module.exports  = Module_Active;