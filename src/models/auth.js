
import m from 'mithril';

var Auth = {
    username: "",
    password: "",
    token: false,
    user_id: false,
    setUsername: function(value) {
        Auth.username = value
    },
    setPassword: function(value) {
        Auth.password = value
    },
    canSubmit: function() {
        return Auth.username !== "" && Auth.password !== ""
    },
    login: function() {
        // post backend
        m.request({
            method: 'POST',
            url: 'http://localhost:8000/login/',
            data: {username: Auth.username, password: Auth.password}
        }).
        then(function(result){
            if(result.token !== undefined){
                Auth.token = 'JWT ' +  result.token;
                Auth.user_id = result.user_id;
                m.route.set('/member/' + Auth.user_id);
            } else {
                Auth.token = false;
                Auth.user_id = false;
            }
        }).
        catch(function(error){
            console.log(error);
            Auth.token = false;
        });
    },
    logout: function() {
        Auth.token = false;
        Auth.username = '';
        Auth.password = '';
    }
}

export default Auth;