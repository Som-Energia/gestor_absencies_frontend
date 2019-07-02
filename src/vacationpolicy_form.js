import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'
import Snackbar from './mdc/snackbar'


var apibase = process.env.APIBASE;

const VacationPolicyForm = {
    oninit: function(vn){
        console.log('VacationPolicyForm');
        vn.state.vacation_policy = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        const token = Auth.token;
    },
    view: function(vn) {
        return m('.vacationpolicy_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació d\'una Política de Vacances'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Nom",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.vacation_policy['name'] = e.target.value
                                                },
                                            })
                                        )
                                    ),
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Descripció",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.vacation_policy['description'] = e.target.value
                                                },
                                            })
                                        )
                                    ),
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Dies de vacances",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.vacation_policy['holidays'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: function(){
                                        m.request({
                                        method: 'POST',
                                        url: apibase+'/absencies/vacationpolicy',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.vacation_policy
                                        }).
                                        then(function(result) {
                                            vn.state.snackbar.close();
                                            m.route.set('/somenergia');
                                        }).
                                        catch(function(error){
                                            vn.state.snackbar_message = error.message;
                                            vn.state.snackbar.open();
                                            console.log(error);
                                        });
                                    },
                                }, 'Crear'),
                                m(Snackbar, {
                                    model: vn.state.snackbar,
                                    dismiss: true
                                }, vn.state.snackbar_message),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default VacationPolicyForm