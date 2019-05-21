import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'


const AbsenceTypeForm = {
    oninit: function(vn){
        vn.state.absencetype = {};
        vn.state.elements_list = [];
        
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
    },
    view: function(vn) {
        return m('.absencetype_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació d\'una tipolodia d\'absència'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : 'Name',
                                                outlined: true,
                                                onchange: function (e){
                                                    vn.state.absencetype['name'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: 'Description',
                                                outlined: true,
                                                onchange: function (e){
                                                    vn.state.absencetype['description'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                label: 'Minima duració',
                                                outlined: true,
                                                elements_list: [
                                                    {'value': 0.5, 'text': 'Migdia'},
                                                    {'value': -2, 'text': 'Per dies'},
                                                    {'value': -1, 'text': 'Indefinit'},
                                                ],
                                                onchange: function(ev){
                                                    vn.state.min_duration = parseInt(ev.target.value);
                                                    vn.state.absencetype['min_duration'] = ev.target.value;
                                                    vn.state.absencetype['min_spend'] = ev.target.value;
                                                }
                                            })
                                        )
                                    ),
                                    (vn.state.min_duration === -2) ? 
                                        m(Layout,
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:12},
                                                    m(MCWTextField, {
                                                        label: 'Min duration',
                                                        outlined: true,
                                                        oninput: function(ev) {
                                                            vn.state.absencetype['min_duration'] = parseInt(ev.target.value);
                                                            vn.state.absencetype['min_spend'] = parseInt(ev.target.value);
                                                        }
                                                    })
                                                )
                                            )
                                        )
                                    :
                                    ''
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                label: 'Màxima duració',
                                                outlined: true,
                                                elements_list: [
                                                    {'value': 0.5, 'text': 'Migdia'},
                                                    {'value': -2, 'text': 'Per dies'},
                                                    {'value': -1, 'text': 'Indefinit'},
                                                ],
                                                onchange: function(ev){
                                                    vn.state.max_duration = parseInt(ev.target.value);
                                                    vn.state.absencetype['max_duration'] = ev.target.value;
                                                    vn.state.absencetype['max_spend'] = ev.target.value;
                                                }
                                            })
                                        )
                                    ),
                                    (vn.state.max_duration === -2) ? 
                                        m(Layout,
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:12},
                                                    m(MCWTextField, {
                                                        label: 'Max duration',
                                                        outlined: true,
                                                        oninput: function(ev) {
                                                            vn.state.absencetype['max_duration'] = parseInt(ev.target.value);
                                                            vn.state.absencetype['max_spend'] = parseInt(ev.target.value);
                                                        }
                                                    })
                                                )
                                            )
                                        )
                                    :
                                    ''
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                label: 'Computació de dies de vacances',
                                                outlined: true,
                                                elements_list: [
                                                    {'value': -1, 'text': 'Descompta dies de vacances'},
                                                    {'value': 0, 'text': 'No descompta dies de vacances'},
                                                    {'value': 1, 'text': 'En cas de coincidir amb festes, genera dies de vacances'},
                                                ],
                                                onchange: function(ev){
                                                    vn.state.absencetype['spend_days'] = ev.target.value;
                                                }
                                            })
                                        )
                                    ),
                                ),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: function(){

                                        console.log('create ', vn.state.absencetype);

                                        m.request({
                                        method: 'POST',
                                        url: 'http://localhost:8000/absencies/absencetype',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.absencetype
                                        }).
                                        then(function(result) {
                                            console.log('AbsenceType created');
                                            m.route.set('/somenergia');
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

export default AbsenceTypeForm