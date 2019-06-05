import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'


var apibase = process.env.APIBASE;

const WorkerForm = {
    oninit: function(vn){
        vn.state.worker = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        m.request({
            method: 'GET',
            url: apibase+'/absencies/vacationpolicy',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.elements_list = result.results.map(function(e){
                return {'value': e.id, 'text': e.name};
            })

            vn.state.worker['vacation_policy'] = vn.state.elements_list.length > 0 ? vn.state.elements_list[0] : '';
        }).
        catch(function(error){
            console.log(error);
        });
    },
    view: function(vn) {
        return m('.worker_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació de Worker'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Username",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['username'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: 'Password',
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['password'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: "First Name",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['first_name'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: "Last Name",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['last_name'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: "Gender",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['gender'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: "Category",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['category'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                options: vn.state.elements_list,
                                                outlined: true,
                                                label: 'Politica de Vacances',
                                                id: 'vacation_policy',
                                                value: vn.state.worker['vacation_policy'],
                                                onchange: function(ev){
                                                    vn.state.worker['vacation_policy'] = parseInt(ev.target.value);
                                                    console.log(vn.state.worker['vacation_policy']);
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: function(){
                                        m.request({
                                        method: 'POST',
                                        url: apibase+'/absencies/workers',
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
                                }, 'Create'),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default WorkerForm