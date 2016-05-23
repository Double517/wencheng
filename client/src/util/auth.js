import Ajax from './ajax';

module.exports = {

    login(username, password, cb) {
        cb = arguments[arguments.length - 1];

        if (this.loggedIn()) {
            if (cb) cb(true);
            this.onChange(true);
            return;
        }

        const data = {username, password};
        console.log(data);
        Ajax.post('/api/login', data)
            .then((data) => {
                console.log(data);
                this.didLogin(data);
                if (cb) cb(true);
                this.onChange(true);
            })
            .catch((err) => {
                if (cb) cb(false, err);
                this.onChange(false);
            });
    },

    logout: function (cb) {
        this.didLogout();
        if (cb) cb();
        this.onChange(false)
    },

    didLogin(user) {
        localStorage.token = JSON.stringify(user);
    },

    didLogout(){
        delete localStorage.token;
    },

    getUser: function () {
        try{
            return JSON.parse(localStorage.token);
        } catch (e){
            console.log(e);
            return null;
        }
    },

    loggedIn: function () {
        var f = !!localStorage.token;
        console.log(localStorage.token);
        console.log(f);
        return !!localStorage.token
    },

    onChange: function () {
    }
};