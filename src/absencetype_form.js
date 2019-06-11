import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'
import Snackbar from './mdc/snackbar'
import RgbEditor from './mdc/colorPicker'

var apibase = process.env.APIBASE;

const AbsenceTypeForm = {
    oncreate: function(vn) {
        vn.state.absencetype = {};
    },
    oninit: function(vn){
        vn.state.absencetype = {};
        vn.state.elements_list = [];
        
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        const token = Auth.token;
        vn.state.min_duration = 0.5;
        vn.state.absencetype['min_duration'] = 0.5;
        vn.state.absencetype['min_spend'] = 0.5;
        vn.state.max_duration = -1;
        vn.state.absencetype['max_duration'] = -1;
        vn.state.absencetype['max_spend'] = -1;
        vn.state.absencetype['spend_days'] = 0;
        vn.state.absencetype['color'] = '';
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
                                                value: vn.state.min_duration,
                                                label: 'Minima duració',
                                                id: 'min_duration',
                                                outlined: true,
                                                options: [
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
                                                            vn.state.absencetype['min_duration'] = ev.target.value;
                                                            vn.state.absencetype['min_spend'] = ev.target.value;
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
                                                value: vn.state.max_duration,
                                                label: 'Màxima duració',
                                                id: 'max_duration',
                                                outlined: true,
                                                options: [
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
                                                            vn.state.absencetype['max_duration'] = ev.target.value;
                                                            vn.state.absencetype['max_spend'] = ev.target.value;
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
                                                value: vn.state.absencetype['spend_days'],
                                                label: 'Computació de dies de vacances',
                                                id: 'spend_days',
                                                outlined: true,
                                                options: [
                                                    {'value': -1, 'text': 'Descompta dies de vacances'},
                                                    {'value': 0, 'text': 'No descompta dies de vacances'},
                                                    {'value': 1, 'text': 'En cas de coincidir amb festes, genera dies de vacances'},
                                                ],
                                                onchange: function(ev){
                                                    vn.state.absencetype['spend_days'] = parseInt(ev.target.value);
                                                }
                                            })
                                        )
                                    ),
                                ),
                                m(RgbEditor),
                                m(MCWButton, {
                                    onclick: function(){
                                        vn.state.absencetype['color'] = RgbEditor.color;
                                        m.request({
                                        method: 'POST',
                                        url: apibase+'/absencies/absencetype',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.absencetype
                                        }).
                                        then(function(result) {
                                            vn.state.snackbar.close();
                                            m.route.set('/somenergia');
                                        }).
                                        catch(function(error){
                                            console.log(error);
                                            vn.state.snackbar_message = error.message
                                            vn.state.snackbar.open();
                                        });
                                    },
                                    raised: true,
                                }, 'Create'),
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

export default AbsenceTypeForm