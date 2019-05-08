import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'


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
            url: 'http://localhost:8000/absencies/vacationpolicy',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.elements_list = result.results.map(function(e){
                return {'value': e.id, 'text': e.name};
            })
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
                                            m(MCWSelectmenu, {elements_list: vn.state.elements_list,
                                                onchange: function(ev){
                                                    vn.state.worker['vacation_policy'] = parseInt(ev.target.value);
                                                    console.log(vn.state.worker['vacation_policy']);
                                                }
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

export default WorkerForm