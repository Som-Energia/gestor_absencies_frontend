
import m from 'mithril';
var apibase = process.env.APIBASE;

var Auth = {
    username: "",
    password: "",
    token: false,
    user_id: false,
    is_admin: false,
    error: '',
    setUsername: function(value) {
        Auth.username = value
        console.log(apibase);
    },
    setPassword: function(value) {
        Auth.password = value
    },
    canSubmit: function() {
        return Auth.username !== "" && Auth.password !== ""
    },
    login: function(snackbar) {
        m.request({
            method: 'POST',
            url: apibase+'/login/',
            data: {username: Auth.username, password: Auth.password}
        }).
        then(function(result){
            if(result.token !== undefined){
                snackbar.close();
                Auth.token = 'JWT ' +  result.token;
                Auth.user_id = result.user_id;
                Auth.is_admin = result.is_admin;
                m.route.set('/absences');
            } else {
                Auth.token = false;
                Auth.user_id = false;
                Auth.is_admin = false;
            }
        }).
        catch(function(error){
            console.log(error);
            Auth.error = error.message;
            snackbar.open();
            Auth.token = false;
        });
    },
    logout: function() {
        Auth.token = false;
        Auth.username = '';
        Auth.password = '';
        Auth.is_admin = false;
    }
}

export default Auth;