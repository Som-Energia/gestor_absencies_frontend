import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWButton from './mdc/button'
import MCWTextField from './mdc/textfield'

const Login = {
    oninit: function(vn) {
        vn.state.auth = Auth;
    },
    view: function(vn) {
        return m('.main.form.mdc-typography',
            m(Layout,
                m(Layout.Row, {align: 'center'}, [
                    m(Layout.Cell,  {span:4}),
                    m(Layout.Cell,  {span:4}, 
                        m(MCWCard,
                            (vn.state.auth.token === false) ? [
                                m('h1', 'Login'),
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
                                    onclick: vn.state.auth.login,
                                    raised: true,
                                }, 'Login'),
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