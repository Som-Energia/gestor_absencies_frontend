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
        vn.state.month_seen = formatDate(Date(
            ((new Date()).getFullYear()),
            ((new Date()).getMonth()),
            1
        ))
        vn.state.list = [];
        vn.state.workers_result = [];

        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/workers',
            headers: {
                'Authorization': token
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

            m.request({
                method: 'GET',
                url: 'http://localhost:8000/absencies/absences',
                headers: {
                    'Authorization': token
                }
            }).
            then(function(result) {
                vn.state.list = result.results;
            }).
            catch(function(error) {
                console.log(error);
            });

        }).
        catch(function(error){
            console.log(error);
        });        
    },
    onupdate: function(vn){

                vn.state.object_list = [];
                vn.state.workers.map(function(e) {
                    var morning_row = new Array(31);
                    morning_row.fill(0);
                    var afternoon_row = new Array(31);
                    afternoon_row.fill(0);
                    var occurrense_entity = new Object();
                    occurrense_entity['name'] = e.name;
                    occurrense_entity['mornings'] = morning_row;
                    occurrense_entity['afternoon'] = afternoon_row;
                    vn.state.object_list.push(occurrense_entity);
                });

                console.log('es prepararà ', vn.state.object_list);

                vn.state.same_month_dates = vn.state.list.filter(
                    list => (list.end_time.includes(vn.state.month_seen.substring(0,7), 0) || 
                        list.start_time.includes(vn.state.month_seen.substring(0,7), 0))
                );
                console.log('same_month_dates ', vn.state.same_month_dates);

                vn.state.same_month_dates.map( function(e) {
                    var start_day = '';
                    var end_day = '';
                    var actual_object = find_row(vn.state.object_list, vn.state.workers, e.worker); // donarà el numero de la row de que és l'occurrencia
                    if (e.start_time.includes(vn.state.month_seen.substring(0,7), 0) && e.end_time.includes(vn.state.month_seen.substring(0,7), 0)) {
                        start_day = new Date(e.start_time).getDate();
                        end_day = new Date(e.end_time).getDate();
                        if (new Date(e.start_time).getHours() == 9) {
                            actual_object['mornings'][start_day] = e.absence_type;
                        }
                        actual_object['afternoon'][start_day] = e.absence_type;
                        for (var i = start_day+1; i < end_day; i++){
                            console.log('dins 1er if ', i);
                            actual_object['mornings'][i] = e.absence_type;
                            actual_object['afternoon'][i] = e.absence_type;
                        }
                        actual_object['mornings'][end_day] = e.absence_type;
                        if (new Date(e.end_time).getHours() == 17) {
                            actual_object['afternoon'][end_day] = e.absence_type;
                        }
                    }
                    else if (e.start_time.includes(vn.state.month_seen.substring(0,7), 0)) {
                        start_day = new Date(e.start_time).getDate();
                        end_day = 31;
                        if (new Date(e.start_time).getHours() == 9) {
                            actual_object['mornings'][start_day] = e.absence_type;
                        }
                        actual_object['afternoon'][start_day] = e.absence_type;
                        for (var i = start_day+1; i < end_day; i++){
                            console.log('dins 2n if ', i);
                            actual_object['mornings'][i] = e.absence_type;
                            actual_object['afternoon'][i] = e.absence_type;
                        }
                        actual_object['mornings'][end_day] = e.absence_type;
                        if (new Date(e.end_time).getHours() == 17) {
                            actual_object['afternoon'][end_day] = e.absence_type;
                        }
                    }
                    else if (e.end_time.includes(vn.state.month_seen.substring(0,7), 0)) {
                        start_day = 1;
                        end_day = new Date(e.end_time).getDate();
                        if (new Date(e.start_time).getHours() == 9) {
                            actual_object['mornings'][start_day] = e.absence_type;
                        }
                        actual_object['afternoon'][start_day] = e.absence_type;
                        for (var i = start_day+1; i < end_day; i++){
                            console.log('dins 3er if ', i);
                            actual_object['mornings'][i] = e.absence_type;
                            actual_object['afternoon'][i] = e.absence_type;
                        }
                        actual_object['mornings'][end_day] = e.absence_type;
                        if (new Date(e.end_time).getHours() == 17) {
                            actual_object['afternoon'][end_day] = e.absence_type;
                        }
                    }
                });
            
            console.log('es printarà ', vn.state.object_list);
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
                                                        var aux = new Date(vn.state.month_seen);
                                                        vn.state.month_seen = formatDate(aux.setMonth(aux.getMonth()-1));
                                                    },
                                                })
                                            ),
                                            m(Layout.Cell, {span:2},
                                                m('h3', {align: 'center'}, vn.state.month_seen.substring(0,7))
                                            ),
                                            m(Layout.Cell, {span:5, class: 'left'},
                                                m(MCWButton, {                                                
                                                    name: '>',
                                                    shaped: true,
                                                    radius: 50,
                                                    rtl: true,
                                                    onclick: function(ev) {
                                                        var aux = new Date(vn.state.month_seen);
                                                        vn.state.month_seen = formatDate(aux.setMonth(aux.getMonth()+1));
                                                    },
                                                })
                                            ),
                                        ]),
                                        m(Layout.Row, [
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
                ]),
        ]);
    }
}

export default Calendar