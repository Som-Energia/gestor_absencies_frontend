'use strict';
import m from 'mithril';
import moment from 'moment';
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


var apibase = process.env.APIBASE;

function set_weekends(vn, row, month, year) {
    var day = 1
    var date = new Date(year, month, day);
    do {
        if (date.getDay() === 6 || date.getDay() === 0) {
            row[day-1]['id'] = 9;
            row[day-1]['name'] = 'Finde';
        }
        day++;
        date.setDate(day);
    } while(day <= moment(vn.state.month_seen).endOf('month').format('D'));
}

function find_row(object_list, workers_dicts, worker_id) {
    var worker = workers_dicts.find(function(e) {
        return e['id'] === worker_id;
    });
    var selected_row = object_list.find(function(e) {
        return e['name'] === (worker.name);
    });
    return selected_row;
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
        moment(vn.state.month_seen).endOf('month').format('D')
    )
    vn.state.object_list = [];
    m.request({
        method: 'GET',
        url: apibase+'/absencies/absences?' +
            'start_period=' + formatDate(vn.state.start_period) +
            '&' +
            'end_period=' + formatDate(vn.state.end_period),
        headers: {
            'Authorization': vn.state.token
        }
    }).
    then(function(result) {
        var row = new Array(moment(vn.state.month_seen).endOf('month').format('D'));
        row.length = moment(vn.state.month_seen).endOf('month').format('D')
        row.fill(new Object());
        row = row.map(function(e){
            return {'id': 0, 'name': ''};
        });
        var a = JSON.parse(JSON.stringify(row));
        set_weekends(
            vn,
            row,
            vn.state.start_period.getMonth(),
            vn.state.start_period.getFullYear()
        );
        vn.state.object_list = [];
        vn.state.workers.map(function(e) {
            var morning_row = JSON.parse(JSON.stringify(row));
            var afternoon_row = JSON.parse(JSON.stringify(row));
            console.log(
                'inside bucle ',
                morning_row,
                ' ',
                afternoon_row
            );
            var occurrense_entity = new Object();
            occurrense_entity['name'] = e.name;
            occurrense_entity['worker_id'] = e.id;
            occurrense_entity['mornings'] = morning_row;
            occurrense_entity['afternoon'] = afternoon_row;
            vn.state.object_list.push(occurrense_entity);
        });

        console.log('DESPUES DE SETEJAR ', vn.state.object_list);
        result.results.map( function(e) {
            var start_day = '';
            var end_day = '';
            var actual_object = find_row(vn.state.object_list, vn.state.workers, e.worker);
            if (moment(e.start_time).format('D') == moment(e.end_time).format('D') && moment(e.start_time).format('M') == moment(e.end_time).format('M')) {
                start_day = moment(e.start_time).format('D')-1;
                if (new Date(e.start_time).getHours() == 9) {
                    actual_object['mornings'][start_day]['id'] = e.absence_type;
                    actual_object['mornings'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                if (new Date(e.end_time).getHours() == 17) {
                    actual_object['afternoon'][start_day]['id'] = e.absence_type;
                    actual_object['afternoon'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
            }
            else if (e.start_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0) && e.end_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = new Date(e.start_time).getDate() - 1;
                end_day = new Date(e.end_time).getDate();
                if (new Date(e.start_time).getHours() == 9) {
                    actual_object['mornings'][start_day]['id'] = e.absence_type;
                    actual_object['mornings'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                actual_object['afternoon'][start_day]['id'] = e.absence_type;
                actual_object['afternoon'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 1er if ', i);
                    actual_object['mornings'][i]['id'] = e.absence_type;
                    actual_object['mornings'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                    actual_object['afternoon'][i]['id'] = e.absence_type;
                    actual_object['afternoon'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                actual_object['mornings'][end_day-1]['id'] = e.absence_type;
                actual_object['mornings'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                if (new Date(e.end_time).getHours() == 17) {
                    actual_object['afternoon'][end_day-1]['id'] = e.absence_type;
                    actual_object['afternoon'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
            }
            else if (e.start_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = new Date(e.start_time).getDate() - 1;
                end_day = moment(vn.state.month_seen).endOf('month').format('D');
                if (new Date(e.start_time).getHours() == 9) {
                    actual_object['mornings'][start_day]['id'] = e.absence_type;
                    actual_object['mornings'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                actual_object['afternoon'][start_day]['id'] = e.absence_type;
                actual_object['afternoon'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 2n if ', i);
                    actual_object['mornings'][i]['id'] = e.absence_type;
                    actual_object['mornings'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                    actual_object['afternoon'][i]['id'] = e.absence_type;
                    actual_object['afternoon'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                actual_object['mornings'][end_day-1]['id'] = e.absence_type;
                actual_object['mornings'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                actual_object['afternoon'][end_day-1]['id'] = e.absence_type;
                actual_object['afternoon'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
            }
            else if (e.end_time.includes(formatDate(vn.state.month_seen).substring(0,7), 0)) {
                start_day = 0;
                end_day = new Date(e.end_time).getDate();
                actual_object['mornings'][start_day]['id'] = e.absence_type;
                actual_object['mornings'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                actual_object['afternoon'][start_day]['id'] = e.absence_type;
                actual_object['afternoon'][start_day].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                for (var i = start_day+1; i < end_day-1; i++){
                    console.log('dins 3er if ', i);
                    actual_object['mornings'][i]['id'] = e.absence_type;
                    actual_object['mornings'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                    actual_object['afternoon'][i]['id'] = e.absence_type;
                    actual_object['afternoon'][i].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
                actual_object['mornings'][end_day-1]['id'] = e.absence_type;
                actual_object['mornings'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                if (new Date(e.end_time).getHours() == 17) {
                    actual_object['afternoon'][end_day-1]['id'] = e.absence_type;
                    actual_object['afternoon'][end_day-1].name = vn.state.absencetype.find( x => x.id === e.absence_type ).name
                }
            }
        });
        vn.state.selected_object_list = vn.state.object_list;
        
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
        vn.state.type_filter = 'worker';

        m.request({
            method: 'GET',
            url: apibase+'/absencies/workers',
            headers: {
                'Authorization': vn.state.token
            }
        }).
        then(function(result) {
            vn.state.workers_result = result.results;
            
            vn.state.workers = vn.state.workers_result.map(function(e){
                return {
                    'name': e.first_name + ' ' + e.last_name,
                    'id': e.id
                }
            });

                m.request({
                    method: 'GET',
                    url: apibase+'/absencies/absencetype',
                    headers: {
                        'Authorization': vn.state.token
                    }
                }).
                then(function(result) {
                    vn.state.absencetype = result.results


                    get_occurrences(vn);
                }).
                catch(function(error){
                    console.log(error);
                });            



        }).
        catch(function(error){
            console.log(error);
        }); 

        m.request({
            method: 'GET',
            url: apibase+'/absencies/teams',
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
            url: apibase+'/absencies/members',
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
        vn.state.month_seen = new Date(
            ((new Date()).getFullYear()),
            ((new Date()).getMonth()),
            1
        )
    },
    view: function(vn) {
        return (Auth.token === false) ?
            m('', '')
            :
            m('.calendar.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:12},
                                m(MCWCard, { header: m('h2','Calendari') }, [
                                    m(Layout,
                                        m(Layout.Row, [
                                            m(Layout.Cell, {span:5, class: 'right'},
                                                m(MCWButton, {
                                                    icon: 'chevron_left',
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
                                                    icon: 'chevron_right',
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
                                                    value: vn.state.type_filter,
                                                    outlined: true,
                                                    label: 'Filtre',
                                                    id: 'type_filter',
                                                    required: true,
                                                    options: [
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
                                                    'class': 'tbl-absences',
                                                    'date': vn.state.month_seen,
                                                    'absences': vn.state.selected_object_list,
                                                    'today': ( moment(vn.state.month_seen).format('YYYY-MM') === moment().format('YYYY-MM') ? moment().format('D') : undefined)
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