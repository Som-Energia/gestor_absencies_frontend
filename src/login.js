import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWButton from './mdc/button'
import MCWTextField from './mdc/textfield'
import cuca from './cuca.svg'
import Snackbar from './mdc/snackbar'

const Login = {
    oninit: function(vn) {
        vn.state.auth = Auth;
        vn.state.snackbar = {};
    },
    view: function(vn) {
        return m('.main.form.mdc-typography',
            m(Layout,
                m(Layout.Row, {align: 'center'}, [
                    m(Layout.Cell,  {span:4}),
                    m(Layout.Cell,  {span:4}, 
                        m(MCWCard, { class: 'login' },
                            (vn.state.auth.token === false) ? [
                                m('img', { src: cuca, class:'login-cuca', title: 'Som Energia'}),
                                m('h1', 'Gestor d\'absències'),                                
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                "label":"Usuari",
                                                outlined: true,
                                                oninput: function (e){
                                                    vn.state.auth.setUsername(e.target.value)
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                "type":"password",
                                                "label":"Password",
                                                outlined: true,
                                                oninput: function (e){
                                                    vn.state.auth.setPassword(e.target.value)
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    onclick: function(e) {
                                        vn.state.auth.login(vn.state.snackbar);
                                    },
                                    raised: true,
                                }, 'Login'),
                                m(Snackbar, {
                                    model: vn.state.snackbar,
                                    dismiss: true
                                }, 'Credencials incorrectes'),
                            ] : [
                                m('h1', 'Logout'),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: vn.state.auth.logout,
                                }, 'Logout')
                            ]
                        )
                    )
               ]) 
            )
        );
    }
}

export default Login