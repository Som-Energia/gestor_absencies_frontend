'use strict';
import m from 'mithril';

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
import MCWCheckbox from './mdc/checkbox'
import Table from './mdc/table'
import Menu from './main'


function find_row(object_list, workers_dicts, worker_id) {
    var worker = workers_dicts.find(function(e) {
        return e.id === worker_id;
    });
    console.log('find_row', worker);
    var row = object_list.find(function(e) {
        return e['name'] === (worker.name);
    });
    return row;
};


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function get_occurrences(vn) {

    vn.state.start_period = new Date(
        vn.state.month_seen.getFullYear(),
        vn.state.month_seen.getMonth(),
        1
    )
    vn.state.end_period = new Date(
        vn.state.month_seen.getFullYear(),
        vn.state.month_seen.getMonth(),
        31
    )
    vn.state.object_list = [];
    console.log('periods ', 
        formatDate(vn.state.start_period), ' ', formatDate(vn.state.end_period)
    );
    m.request({
        method: 'GET',
        url: 'http://localhost:8000/absencies/absences?' +
            'start_period=' + formatDate(vn.state.start_period) +
            '&' +
            'end_period=' + formatDate(vn.state.end_period),
        headers: {
            'Authorization': vn.state.token
        }
    }).
    then(function(result) {
        
        console.log('same month dates ---> ', result.results);
        vn.state.object_list = [];
        vn.state.workers.map(function(e) {
            var morning_row = new Array(31);
            morning_row.fill(0);
            var afternoon_row = new Array(31);
            afternoon_row.fill(0);
            var occurrense_entity = new Object();
            occurrense_entity['name'] = e.name;
            occurrense_entity['worker_id'] = e.id;
            occurrense_entity['mornings'] = morning_row;
            occurrense_entity['afternoon'] = afternoon_row;
            vn.state.object_list.push(occurrense_entity);
        });

        result.results.map( function(e) {
            var start_day = '';
            var end_day = '';
            var actual_object = find_row(vn.state.object_list, vn.state.workers, e.worker); // donarà el numero de la row de que és l'occurrencia
            console.log('actual_object ', actual_object);
            if (e.start_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0) && e.end_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = new Date(e.start_time).getDate() - 1;
                end_day = new Date(e.end_time).getDate();
                if (new Date(e.start_time).getHours() == 9) {
                    actual_object['mornings'][start_day] = e.absence_type;
                }
                actual_object['afternoon'][start_day] = e.absence_type;
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 1er if ', i);
                    actual_object['mornings'][i] = e.absence_type;
                    actual_object['afternoon'][i] = e.absence_type;
                }
                actual_object['mornings'][end_day-1] = e.absence_type;
                if (new Date(e.end_time).getHours() == 17) {
                    actual_object['afternoon'][end_day-1] = e.absence_type;
                }
            }
            else if (e.start_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = new Date(e.start_time).getDate() - 1;
                end_day = 31;
                if (new Date(e.start_time).getHours() == 9) {
                    actual_object['mornings'][start_day] = e.absence_type;
                }
                actual_object['afternoon'][start_day] = e.absence_type;
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 2n if ', i);
                    actual_object['mornings'][i] = e.absence_type;
                    actual_object['afternoon'][i] = e.absence_type;
                }
                actual_object['mornings'][end_day-1] = e.absence_type;
                actual_object['afternoon'][end_day-1] = e.absence_type;
            }
            else if (e.end_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = 0;
                end_day = new Date(e.end_time).getDate();
                actual_object['mornings'][start_day] = e.absence_type;
                actual_object['afternoon'][start_day] = e.absence_type;
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 3er if ', i);
                    actual_object['mornings'][i] = e.absence_type;
                    actual_object['afternoon'][i] = e.absence_type;
                }
                actual_object['mornings'][end_day-1] = e.absence_type;
                if (new Date(e.end_time).getHours() == 17) {
                    actual_object['afternoon'][end_day-1] = e.absence_type;
                }
            }
        });
        vn.state.selected_object_list = vn.state.object_list;
        
        console.log('es printarà ', vn.state.selected_object_list);
        m.redraw();
    }).
    catch(function(error){
        console.log(error);
    });

}


const Calendar = {
    oncreate: function(vn){
        vn.state.year = (new Date()).getFullYear();
        vn.state.month = (new Date()).getMonth();
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        var date = new Date();
        vn.state.token = Auth.token;
        vn.state.same_month_dates = [];
        vn.state.table = [];
        vn.state.selected_object_list = [];
        vn.state.object_list = [];
        vn.state.workers = [];
        vn.state.month_seen = new Date(
            ((new Date()).getFullYear()),
            ((new Date()).getMonth()),
            1
        )
        vn.state.list = [];
        vn.state.workers_result = [];

        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/workers',
            headers: {
                'Authorization': vn.state.token
            }
        }).
        then(function(result) {
            vn.state.workers_result = result.results;
            
            vn.state.workers = vn.state.workers_result.map(function(e){
                return {
                    'name': e.first_name + e.last_name,
                    'id': e.id
                }
            });

            
            get_occurrences(vn);
            console.log('es prepararà ', vn.state.object_list);

            console.log('same_month_dates ', vn.state.same_month_dates);


        }).
        catch(function(error){
            console.log(error);
        }); 

        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/teams',
            headers: {
                'Authorization': vn.state.token
            }
        }).
        then(function(result) {
            vn.state.teams = result.results.map(function(e){
                return {'name': e.name, 'id': e.id};
            });
        }).
        catch(function(error){
            console.log(error);
        });

        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/members',
            headers: {
                'Authorization': vn.state.token
            }
        }).
        then(function(result) {
            vn.state.members = result.results.map(function(e){
                return {'team': e.team, 'worker': e.worker};
            });
        }).
        catch(function(error){
            console.log(error);
        });


    },
    oninit: function(vn) {
        vn.state.occurrences = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.token = Auth.token;
    },
    view: function(vn) {
        return m('.calendar.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:12},
                                m(MCWCard, [
                                    m('h2', {align: 'center'}, 'Absències'),
                                    m('hr'),
                                    m(Layout,
                                        m(Layout.Row, [
                                            m(Layout.Cell, {span:5, class: 'right'},
                                                m(MCWButton, {                                                
                                                    name: '<',
                                                    shaped: true,
                                                    radius: 50,
                                                    rtl: true,
                                                    onclick: function(ev) {
                                                        vn.state.month_seen.setMonth(
                                                            vn.state.month_seen.getMonth()-1
                                                        )
                                                        get_occurrences(vn);
                                                    },
                                                })
                                            ),
                                            m(Layout.Cell, {span:2},
                                                m('h3', {align: 'center'}, formatDate(vn.state.month_seen).substring(0,7))
                                            ),
                                            m(Layout.Cell, {span:5, class: 'left'},
                                                m(MCWButton, {                                                
                                                    name: '>',
                                                    shaped: true,
                                                    radius: 50,
                                                    rtl: true,
                                                    onclick: function(ev) {
                                                        vn.state.month_seen.setMonth(
                                                            vn.state.month_seen.getMonth()+1
                                                        )
                                                        get_occurrences(vn);
                                                    },
                                                })
                                            ),
                                        ]),
                                        m(Layout.Row, [
                                            m(Layout.Cell, {span:9},
                                                m(MCWTextField, {
                                                    label: 'Filter',
                                                    outlined: true,
                                                    oninput: function(ev) {
                                                        if (vn.state.type_filter === 'worker') {
                                                            if (ev.target.value != ''){
                                                                vn.state.selected_object_list =
                                                                    vn.state.object_list.filter
                                                                        (x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                                            []
                                                                        :
                                                                            vn.state.object_list.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                            }
                                                            else {
                                                                vn.state.selected_object_list = vn.state.object_list;
                                                            }
                                                        }
                                                        else if (vn.state.type_filter === 'team') {
                                                            if (ev.target.value != '') {
                                                                var team = vn.state.teams.find(x => x.name.toLowerCase().includes(ev.target.value.toLowerCase()));
                                                                if (team) {
                                                                    var workers_ids = [];
                                                                    vn.state.members.map(function(e) {
                                                                        if (e.team === team.id) {
                                                                            workers_ids.push(e.worker);
                                                                        }
                                                                    });

                                                                    vn.state.selected_object_list =
                                                                        (vn.state.object_list.filter(
                                                                            x => workers_ids.includes(x.worker_id))) === undefined ?
                                                                                []
                                                                            :
                                                                                vn.state.object_list.filter(x => workers_ids.includes(x.worker_id))

                                                                }
                                                                else {
                                                                    vn.state.selected_object_list = [];
                                                                }
                                                                console.log('filtered: ', vn.state.selected_object_list);
                                                            }
                                                            else {
                                                                vn.state.selected_object_list = vn.state.object_list;
                                                            }
                                                        }
                                                    }
                                                })
                                            ),
                                            m(Layout.Cell, {span:3},
                                                m(MCWSelectmenu, {
                                                    elements_list: [
                                                        {
                                                            'text': 'Team',
                                                            'value': 'team'
                                                        },
                                                        {
                                                            'text': 'Worker',
                                                            'value': 'worker'
                                                        },
                                                    ],
                                                    onchange: function(ev) {
                                                        vn.state.type_filter = ev.target.value;
                                                    }
                                                })
                                            ),
                                        ]),
                                        m(Layout.Row, [
                                            m(Layout.Cell, {span:12},
                                                m(Table, {
                                                    'absences': vn.state.selected_object_list
                                                }),
                                            ),
                                        ]),
                                    )
                                ]),
                            )
                        ])
                    ),
                ]),
        ]);
    }
}

export default Calendar