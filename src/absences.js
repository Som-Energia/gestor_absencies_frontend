'use strict';
import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import MCWButton from './mdc/button'
import MCWCard from './mdc/card'
import Layout from './mdc/layout'
import MCWList from './mdc/list'
import MCWDrawer from './mdc/drawer'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWSelectmenu from './mdc/selectmenu'
import Snackbar from './mdc/snackbar'
import moment from 'moment'
import get_objects from './iterate_request'

var apibase = process.env.APIBASE;


function count_work_days(start, end) {
    var work_days = 0;
    var date = moment(start);
    for ( date ; end.isSameOrAfter(date) ; date.add(1, 'days') ) {
        if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
            work_days++;
        }
    }
    return work_days;
}

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

async function get_occurrences(vn) {

    m.request({
        method: 'GET',
        url: (apibase+'/absencies/workers/'+vn.state.auth.user_id),
        headers: {
            'Authorization': vn.state.token
        }
    }).
    then(async function(worker_result) {
        vn.state.holidays = worker_result.holidays;

        var url = apibase+'/absencies/vacationpolicy'
        var headers = {'Authorization': vn.state.token};
        vn.state.vacationpolicy_result = await get_objects(url, headers);
        vn.state.vacation_policy = vn.state.vacationpolicy_result.find( x => worker_result.vacation_policy == x.id);
    }).
    catch(function(error){
        console.log(error);
    });

    var url = apibase+'/absencies/absences?' +
            'worker=' + Auth.user_id +
            '&' +
            'start_period=' + moment(vn.state.start_period).format('YYYY-MM-DD') +
            '&' +
            'end_period=' + moment(vn.state.end_period).format('YYYY-MM-DD');
    
    var headers = {
            'Authorization': vn.state.token
    };

    vn.state.occurrences = await get_objects(url, headers);

    var url = apibase+'/absencies/absencetype'

    var headers = {
            'Authorization': vn.state.token
    };

    vn.state.absencetype_result = await get_objects(url, headers);

    vn.state.absence_type = vn.state.absencetype_result.map(function(e){
        return {'name': e.name, 'id': e.id, 'spend_days': e.spend_days};
    });
    vn.state.occurrences.map(function(e) {
        var absencetype = vn.state.absence_type.find( x => e.absence_type == x.id );
        var start_occurrence = moment(e.start_time);
        var end_occurrence = moment(e.end_time);
        if (absencetype.spend_days == -1) {
            vn.state.vacation_spend +=
                start_occurrence.format('H') == 9 && end_occurrence.format('H') == 17 ?
                        count_work_days(start_occurrence, end_occurrence)
                    :
                        start_occurrence.format('H') == end_occurrence.format('H') ?
                            count_work_days(start_occurrence, end_occurrence)-1
                        :
                            count_work_days(start_occurrence, end_occurrence)-0.5
        }

        for ( start_occurrence ; end_occurrence.isSameOrAfter(start_occurrence) ; start_occurrence.add(1, 'days') ) {
            var absencetype_name = vn.state.absencetype_result.find( x => e.absence_type == x.id ).name;
            vn.state.occurrence_days.push({
                'absencetype_id': e.absence_type,
                'absencetype_name': absencetype_name,
                'day': start_occurrence.format('YYYY-MM-DD')
            })
        }
    });
    m.redraw();
}


const Absences = {
    oncreate: function(vn) {
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.semaphore = false;
        vn.state.absence_type = [];
    },
    oninit: function(vn) {
        vn.state.year = (new Date()).getFullYear();
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }        
        vn.state.dialog_remove_occurrence = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        vn.state.token = Auth.token;
        vn.state.auth = Auth;
        vn.state.vacation_spend = 0;
        vn.state.absence_type = [];
        vn.state.semaphore = false;
        vn.state.start_period = new Date(
            vn.state.year,
            0,
            1
        )
        vn.state.end_period = new Date(
            vn.state.year,
            11,
            31
        )
        vn.state.occurrences = [];
        vn.state.occurrence_days = [];
        vn.state.vacation_spend = 0;
        vn.state.end = true;
        get_occurrences(vn);
    },
    view: function(vn) {
        return (Auth.token === false) ?
            m('', '')
            : 
            m('.absences.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:11},
                                m(MCWCard, { header: m('h2','Absències') }, [
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
                                                        vn.state.year--;
                                                        vn.state.start_period = new Date(
                                                            vn.state.year,
                                                            0,
                                                            1
                                                        )
                                                        vn.state.end_period = new Date(
                                                            vn.state.year,
                                                            11,
                                                            31
                                                        )
                                                        vn.state.occurrences = [];
                                                        vn.state.vacation_spend = 0;
                                                        get_occurrences(vn);
                                                    },
                                                })
                                            ),
                                            m(Layout.Cell, {span:2},
                                                m('h3', {align: 'center'}, vn.state.year)
                                            ),
                                            m(Layout.Cell, {span:5, class: 'left'},
                                                m(MCWButton, {
                                                    icon: 'chevron_right',
                                                    name: '>',
                                                    shaped: true,
                                                    radius: 50,
                                                    rtl: true,
                                                    disabled: ((new Date()).getFullYear()+1 === vn.state.year) && !vn.state.auth.is_admin,
                                                    onclick: function(ev) {
                                                        vn.state.year++;
                                                        vn.state.start_period = new Date(
                                                            vn.state.year,
                                                            0,
                                                            1
                                                        )
                                                        vn.state.end_period = new Date(
                                                            vn.state.year,
                                                            11,
                                                            31
                                                        )
                                                        vn.state.occurrences = [];
                                                        vn.state.vacation_spend = 0;
                                                        get_occurrences(vn);
                                                    },
                                                })
                                            ),
                                        ]),
                                        vn.state.absence_type != [] && vn.state.occurrences ?
                                            m(Layout.Row, [
                                                m(Layout.Cell, {span:6},
                                                    m('ul.absences-list',
                                                        vn.state.occurrences.map(function(e){
                                                        return m('li.absences-list__item',
                                                            (e != undefined) ?
                                                            m('.absences-list__item-container', [
                                                                m('.absences-list__item-name',[
                                                                    m('.start-time', { 'data-time': moment(e.start_time).format('DD-MM-YY HH:mm:ss') }, [
                                                                        m('.month', moment(e.start_time).format('MMM')),
                                                                        m('.day', moment(e.start_time).format('DD')),
                                                                        m('.duration-container', ( moment(e.start_time).format('H') == '13' ? m('.duration', 'Tarda') : ''))
                                                                    ]),
                                                                    moment(e.start_time).format('DD MM') !== moment(e.end_time).format('DD MM') ? (
                                                                    m('i',{ class: 'time-separator material-icons' }, 'arrow_forward')
                                                                    ) : '',
                                                                    moment(e.start_time).format('DD MM') !== moment(e.end_time).format('DD MM') ? (
                                                                    m('.end-time',{ 'data-time': moment(e.end_time).format('DD-MM-YY HH:mm:ss') }, [
                                                                        m('.month',moment(e.end_time).format('MMM')),
                                                                        m('.day',moment(e.end_time).format('DD')),
                                                                        m('.duration-container', ( moment(e.end_time).format('H') == '13' ? m('.duration', 'Matí') : ''))
                                                                    ]
                                                                    )) : '',
                                                                    m('.content', [
                                                                        m('.type',
                                                                            (vn.state.absence_type.find(x => x.id === e.absence_type) ? 
                                                                                vn.state.absence_type.find(x => x.id === e.absence_type).name
                                                                            : '')
                                                                        ),
                                                                        m('.num-days',
                                                                            moment(e.end_time).format('D') == moment(e.start_time).format('D') ?
                                                                                moment(e.start_time).format('H') == 13 || moment(e.end_time).format('H') == 13 ?
                                                                                    'mig dia'
                                                                                :
                                                                                    'un dia'
                                                                            :
                                                                                moment(e.start_time).format('H') == 13 && moment(e.end_time).format('H') == 13 ?
                                                                                    moment(e.end_time).from(moment(e.start_time), true)
                                                                                :
                                                                                    moment(e.start_time).format('H') == 13 || moment(e.end_time).format('H') == 13 ?
                                                                                        moment(e.end_time).from(moment(e.start_time), true) + ' i mig'
                                                                                    :
                                                                                        moment(e.end_time).add(1, 'days').from(moment(e.start_time), true)
                                                                        )
                                                                    ])
                                                                ]
                                                                ),
                                                                m('.absences-list__item-delete',
                                                                    m(MCWButton, {
                                                                        icon: 'delete',
                                                                        class: 'right',
                                                                        dense: true,
                                                                        onclick: function(ev) {
                                                                            vn.state.occurrence_to_remove = e
                                                                            vn.state.dialog_remove_occurrence.outer.open();
                                                                        }
                                                                    })
                                                                )
                                                            ])
                                                        :
                                                            ''
                                                            )
                                                        })
                                                    )
                                                ),
                                                m(Layout.Cell, {span:6},
                                                    m('ul.total-absences',
                                                        m('li.total-absences__item', [
                                                            m('.num', (vn.state.vacation_policy != undefined) ? vn.state.vacation_policy.holidays : '0'),
                                                            m('.desc', 'Dies totals'),
                                                        ]),
                                                        m('li.total-absences__item', [
                                                            m('.num', vn.state.holidays),
                                                            m('.desc', 'Dies disponibles'),
                                                        ]),
                                                        m('li.total-absences__item', [
                                                            m('.num', vn.state.vacation_spend),
                                                            m('.desc', 'Dies utilitzats'),
                                                        ])
                                                    ),    
                                                    m('ul.mini-calendar', [

                                                        [0,1,2,3,4,5,6,7,8,9,10,11].map(function(e){
                                                            const first_day = moment().month(e).year(vn.state.year).startOf('month');
                                                            const last_day = moment().month(e).year(vn.state.year).endOf('month');
                                                            const num_first_day = first_day.isoWeekday();
                                                            return m('li', [
                                                                m('.month-title', moment().month(e).format('MMMM') ),
                                                                m('.month-grid', [
                                                                    [...new Array(num_first_day-1).keys()].map(function(f){
                                                                        return m('.month-day', m('.',''))
                                                                    }),
                                                                    [...new Array(last_day.date()).keys()].map(function(f){
                                                                        const dies = vn.state.occurrence_days.map( x => x.day );
                                                                        const noms = vn.state.occurrence_days.map( x => x.absencetype_name );
                                                                        if (arrayContains(moment(vn.state.year+'-'+(e+1)+'-'+(f+1)).format('YYYY-MM-DD'), dies)) {
                                                                            const index = (dies.indexOf(moment(vn.state.year+'-'+(e+1)+'-'+(f+1)).format('YYYY-MM-DD')));
                                                                            return m('.month-day.month-day__selected', { title : moment(vn.state.year+'-'+(e+1)+'-'+(f+1)).format('DD/MM/YYYY')+' - '+noms[index] }, m('.','•'));
                                                                        }
                                                                        else {
                                                                            return m('.month-day', { title : moment(vn.state.year+'-'+(e+1)+'-'+(f+1)).format('DD/MM/YYYY') }, m('.','•'));
                                                                        }
                                                                    })
                                                                ])
                                                            ])

                                                        })
                                                    ]),
                                                ),
                                            ])
                                        :
                                            ''
                                    )
                                ]),
                                
                            )
                        ])
                    ),
                    m(MWCFab, {
                        value: 'add',
                        onclick: function() {
                            m.route.set('/occurrence/form');
                        }
                    }),
                    (vn.state.auth.is_admin) ?
                        m(MWCFab, {
                            value: 'calendar_today',
                            style: {
                                bottom: '5rem',
                            },
                            onclick: function() {
                                m.route.set('/globaldate/form');
                            }
                        })
                    : '',
                        m(Dialog, {
                            id: 'remove_occurrence',
                            header: 'Eliminar',
                            model: vn.state.dialog_remove_occurrence.outer,
                            buttons: [{
                                text: 'Eliminar',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: (apibase+'/absencies/absences/' + vn.state.occurrence_to_remove.id),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        const idx = vn.state.occurrences.indexOf(vn.state.occurrence_to_remove);
                                        if( idx >= 0){
                                            vn.state.occurrences.splice(idx, 1);
                                        }
                                        vn.state.snackbar.close();
                                        m.redraw();
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                        vn.state.snackbar_message = error.message;
                                        vn.state.snackbar.open();
                                    });
                                    vn.state.dialog_remove_occurrence.outer.close();
                                }
                            },{
                                text: 'Cancel·lar',
                                onclick: function(){
                                    vn.state.dialog_remove_occurrence.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_occurrence.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog_remove_occurrence.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_occurrence.backdrop,
                        }, [
                            m('.', 'Estas segur que vols eliminar aquesta ocurrencia?')

                        ]),
                        m(Snackbar, {
                            model: vn.state.snackbar,
                            dismiss: true
                        }, vn.state.snackbar_message),
                ])    
        ]);
    }
}

export default Absences