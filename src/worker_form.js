import m from 'mithril';
import moment from 'moment';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'
import Snackbar from './mdc/snackbar'
import DatePicker from './mdc/datepicker'
import get_objects from './iterate_request'

var apibase = process.env.APIBASE;

const WorkerForm = {
    oninit: async function(vn){
        vn.state.worker = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        vn.state.gender_options = [
            {'value': 'Female', 'text': 'Dona'},
            {'value': 'Male', 'text': 'Home'},
            {'value': 'Intersex', 'text': 'Intersex'},
            {'value': 'Trans', 'text': 'Trans'},
            {'value': 'Queer', 'text': 'Queer'},
            {'value': 'Other', 'text': 'Altre'},
        ]
        vn.state.category_options = [
            {'value': 'Technical', 'text': 'Tècnic'},
            {'value': 'Specialist', 'text': 'Especialista'},
            {'value': 'Manager', 'text': 'Gerència'},
        ]
        const token = Auth.token;

        var url = apibase+'/absencies/vacationpolicy';

        var headers = {'Authorization': token}

        vn.state.vacationpolicy_result = await get_objects(url, headers);

        vn.state.elements_list = vn.state.vacationpolicy_result.map(function(e){
            return {'value': e.id, 'text': e.name};
        })

        vn.state.worker['vacation_policy'] = vn.state.elements_list.length > 0 ? vn.state.elements_list[0].value : '';
        m.redraw();
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
                                                type: 'password',
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
                                                label: 'Nom',
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
                                                label: 'Cognoms',
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
                                            m(MCWSelectmenu, {
                                                options: vn.state.gender_options,
                                                outlined: true,
                                                label: 'Gènere',
                                                id: 'gender',
                                                value: vn.state.worker['gender'],
                                                onchange: function(ev){
                                                    vn.state.worker['gender'] = ev.target.value;
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                options: vn.state.category_options,
                                                outlined: true,
                                                label: 'Categoria',
                                                id: 'category',
                                                value: vn.state.worker['category'],
                                                onchange: function(ev){
                                                    vn.state.worker['category'] = ev.target.value;
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label: "Hores de jornada",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.worker['working_week'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(DatePicker, 
                                                {id: 'contract_date',
                                                label: 'Data de contractació',
                                                value: undefined,
                                                outlined: true,
                                                future: moment().add(20, 'years'),
                                                onchange: function(newvalue) {
                                                    vn.state.worker['contract_date'] = newvalue.format("YYYY-MM-DD HH:mm:ss");
                                                },
                                                boxed: true,
                                                autoclose: true,}
                                            )
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                options: vn.state.elements_list,
                                                outlined: true,
                                                label: 'Política de Vacances',
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
                                            vn.state.snackbar.close();
                                            m.route.set('/et');
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

export default WorkerForm