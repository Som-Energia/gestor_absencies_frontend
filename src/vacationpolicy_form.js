import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'


const VacationPolicyForm = {
    oninit: function(vn){
        console.log('VacationPolicyForm');
        vn.state.vacation_policy = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
    },
    view: function(vn) {
        return m('.vacationpolicy_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació d\'una Vacation Policy'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Name",
                                                onblur: function (e){
                                                    vn.state.vacation_policy['name'] = e.target.value
                                                },
                                            })
                                        )
                                    ),
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Description",
                                                onblur: function (e){
                                                    vn.state.vacation_policy['description'] = e.target.value
                                                },
                                            })
                                        )
                                    ),
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Holidays",
                                                onblur: function (e){
                                                    vn.state.vacation_policy['holidays'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    onclick: function(){
                                        m.request({
                                        method: 'POST',
                                        url: 'http://localhost:8000/absencies/workers',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.worker
                                        }).
                                        then(function(result) {
                                            console.log('Worker created');
                                            m.route.set('/et');
                                        }).
                                        catch(function(error){
                                        console.log(error);
                                        });
                                    },
                                    name: 'Create'

                                }),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default VacationPolicyForm