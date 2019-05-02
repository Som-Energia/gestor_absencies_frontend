'use strict';
import m from 'mithril';
import moment from 'moment';
require('@material/typography/dist/mdc.typography.css').default;
import Auth from './models/auth'
import MCWTextField from './mdc/textfield'
import MCWButton from './mdc/button'
import MCWCard from './mdc/card'
import Layout from './mdc/layout'
import MCWList from './mdc/list'
import MCWDrawer from './mdc/drawer'
import MWCFab from './mdc/fab'
import MWCSnackbar from './mdc/snackbar'
import MCWSelectmenu from './mdc/selectmenu'
import Table from './mdc/table'
import './style.styl';
import Login from './login'
import ET from './et'
import Team from './team'
import Member from './member'
import SomEnergia from './somenergia'
import AbsenceType from './absencetype'
import VacationPolicy from './vacationpolicy'
import WorkerForm from './worker_form'
import DatePicker from './mdc/datepicker'
import MCWCheckbox from './mdc/checkbox'


const Main = {
	view: function() {
		return m('div.main',
            [
                m('h1', 'Gestor d\'Absències'),
                m(Menu)
            ]);    
	} 
}

const Absences = {
    view: function() {
        return m('.absences', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
                            m(MCWCard, [
                                m('h2', {align: 'center'}, 'Absències'),
                                m('hr'),
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span:12},
                                            m('h3', {align: 'center'}, '2019')
                                        )
                                    ]),
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span:6},
                                            m('.', {align: 'center'}, 'Absències'),
                                            m('hr'),
                                        ),
                                        m(Layout.Cell, {span:6},
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                            m('.', {align: 'center'}, 'Minicalendari'),
                                        ),
                                    ]),
                                )
                            ]),
                            
                        )
                    ])
                ),
                m(MWCFab, {
                    value: 'add',
                    onclick: function() {
                            // FORMULARI CREATE TEAM
                            console.log('CREATE OCCURRENCE!');
                            m.route.set('/occurrence/form');
                    }
                })
        ]);
    }
}

function find_row(object_list, workers_dicts, worker_id) {
    console.log('workers_dicts ', workers_dicts);
    console.log('object_list ', object_list);
    var worker = workers_dicts.find(function(e) {
        return e.id === worker_id;
    });
    console.log('worker ', worker);
    var row = object_list.find(function(e) {
        return e['name'] === (worker.name);
    });
    console.log('row', row);
    return row;
};

const Calendar = {
    oninit: function(vn){
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        var date = new Date();
        const token = Auth.token;
        vn.state.same_month_dates = [];
        vn.state.table = [];
        vn.state.object_list = [];
        vn.state.workers = [];
                m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/workers',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            result.results.map(function(e) {
                var morning_row = new Array(31);
                morning_row.fill(0);
                var afternoon_row = new Array(31);
                afternoon_row.fill(0);
                var occurrense_entity = {};
                occurrense_entity['name'] = e.first_name + e.last_name;
                occurrense_entity['mornings'] = morning_row;
                occurrense_entity['afternoon'] = afternoon_row;
                vn.state.object_list.push(occurrense_entity);
                vn.state.workers.push({
                    'name': e.first_name + e.last_name,
                    'id': e.id
                });
            });
        }).
        catch(function(error){
            console.log(error);
        });        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/absences',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {

            var list = result.results
            vn.state.same_month_dates = list.filter(
                list => (list.end_time.includes("2019-04-", 0) || 
                    list.start_time.includes("2019-04-", 0))
            );
            vn.state.same_month_dates.map( function(e) {
                var start_day = '';
                var end_day = '';
                var actual_object = find_row(vn.state.object_list, vn.state.workers, e.worker); // donarà el numero de la row de que és l'occurrencia
                if (e.start_time.includes("2019-04-", 0) && e.end_time.includes("2019-04-", 0)) {
                    start_day = new Date(e.start_time).getDate();
                    end_day = new Date(e.end_time).getDate();
                    for (var i = start_day; i <= end_day; i++){
                        actual_object['mornings'][i+1] = e.absence_type;
                        actual_object['afternoon'][i] = e.absence_type;
                    }
                }
                if (e.start_time.includes("2019-04-", 0)) {
                    start_day = new Date(e.start_time).getDate();
                    end_day = 31;
                    for (var i = start_day; i < end_day; i++){
                        actual_object['mornings'][i+1] = e.absence_type;
                        actual_object['afternoon'][i] = e.absence_type;
                    }
                }
                if (e.end_time.includes("2019-04-", 0)) {
                    start_day = 1;
                    end_day = new Date(e.end_time).getDate();
                    for (var i = start_day; i <= end_day; i++){
                        actual_object['mornings'][i+1] = e.absence_type;
                        actual_object['afternoon'][i] = e.absence_type;
                    }
                }
            });

            m.redraw();
        }).
        catch(function(error){
            console.log(error);
        });
    },
    view: function(vn) {
        return m('.calendar', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
                            m(MCWCard, [
                                m('h2', {align: 'center'}, 'Calendari'),
                                m('hr'),
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span:12},
                                            m('h3', {align: 'center'}, 'Març 2019')
                                        ),
                                        m(Layout.Cell, {span:12},
                                            m(Table, {
                                                'absences': vn.state.object_list
                                            }),
                                        ),
                                    ]),
                                )
                            ]),
                        )

                    ])
                ),
                
        ]);    
    }
}

const Menu = {
    oninit: function(vn){
        vn.state.options = [
            { 'name': 'El meu perfil', 'link': '/member/' + Auth.user_id },
            { 'name': 'Absències', 'link': '/absences' },
            { 'name': 'Calendari', 'link': '/calendar' },
            { 'name': 'E.T', 'link': '/et' },
            { 'name': 'Som Energia', 'link': '/somenergia' },
            { 'name': 'Logout', 'link': '/login' },
        ];
        console.log('User id ', Auth.user_id);
    },
    view: function(vn) {
        return m('.menu', [
                m(MCWDrawer, {elements_list: vn.state.options}),
            ])
    }
}



const AbsenceForm = {
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
            url: 'http://localhost:8000/absencies/absencetype',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.elements_list = result.results.map(function(e){
                return {'value': e.id, 'text': e.name};
            })
            console.log('ABSENCE TYPE ', vn.state.elements_list);
        }).
        catch(function(error){
            console.log(error);
        });
        vn.state.absence_info = {};
        vn.state.absence_info['start_morning'] = true;
        vn.state.absence_info['start_afternoon'] = true;
        vn.state.absence_info['end_morning'] = true;
        vn.state.absence_info['end_afternoon'] = true;  
    },
    view: function(vn) {
        return m('.worker_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació d\'Absència'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                           m(DatePicker, 
                                                {id: 'start_date',
                                                label: 'Start',
                                                help: 'First day that will be included',
                                                value: undefined,
                                                future: moment().add(20,'years'),
                                                onchange: function(newvalue) {
                                                    console.log("changin from ", newvalue.format("YYYY-MM-DD HH:mm:ss"));

                                                    //DatePicker.Example.fromdate=newvalue;
                                                    vn.state.absence_info['start_time'] = newvalue.format("YYYY-MM-DD HH:mm:ss");
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
                                            m(DatePicker, 
                                                {id: 'end_date',
                                                label: 'End',
                                                help: 'Last day that will be included',
                                                value: undefined,
                                                future: moment().add(20,'years'),
                                                onchange: function(newvalue) {
                                                    console.log("changin from ", newvalue.format("YYYY-MM-DD HH:mm:ss"));

                                                    //DatePicker.Example.fromdate=newvalue;
                                                    vn.state.absence_info['end_time'] = newvalue.format("YYYY-MM-DD HH:mm:ss");
                                                },
                                                boxed: true,
                                                autoclose: true,}
                                            )
                                            /*m(MCWTextField, {
                                                "placeholder":'Password',
                                                onblur: function (e){
                                                    vn.state.worker['password'] = e.target.value
                                                },
                                            })*/
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWCheckbox, {
                                                'label': 'Start morning',
                                                'checked': (vn.state.absence_info['start_morning'] !== undefined) ?
                                                    vn.state.absence_info['start_morning']
                                                    :
                                                    false,
                                                onchange: function(ev){
                                                    vn.state.absence_info['start_morning'] = ev.target.checked;
                                                    console.log('checkbox onchange ', vn.state.absence_info['start_morning']);
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWCheckbox, {
                                                'label': 'End afternoon',
                                                'checked': (vn.state.absence_info['end_afternoon'] !== undefined) ?
                                                    vn.state.absence_info['end_afternoon']
                                                    :
                                                    false,                                                
                                                onchange: function(ev){
                                                    vn.state.absence_info['end_afternoon'] = ev.target.checked;
                                                    console.log('checkbox onchange ', vn.state.absence_info['end_afternoon']);
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                elements_list: vn.state.elements_list,
                                                onchange: function(ev){
                                                    vn.state.absence_info['absence_type'] = parseInt(ev.target.value);
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    onclick: function(){
                                        console.log('Ready to posted ', vn.state.absence_info);
                                        // TODO: SOLVE BACKEND
                                        /*m.request({
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
                                        });*/
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


m.route(document.getElementById('app'), "/login", {
    "/": Main,
    "/login": Login,
    "/member/:memberid": Member,
    '/et': ET,
    "/team/:teamid": Team,
    '/absences': Absences,
    '/calendar': Calendar,
    '/somenergia': SomEnergia,
    '/absencetype/:absenceid': AbsenceType,
    '/vacationpolicy/:vacationpolicyid': VacationPolicy,
    '/worker/form': WorkerForm,
    '/occurrence/form': AbsenceForm,
});

export default Menu