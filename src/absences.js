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
import moment from 'moment'



function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

function get_occurrences(vn) {

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
    m.request({
        method: 'GET',
        url: 'http://localhost:8000/absencies/absences?' +
            'worker=' + Auth.user_id +
            '&' +
            'start_period=' + moment(vn.state.start_period).format('YYYY-MM-DD') +
            '&' +
            'end_period=' + moment(vn.state.end_period).format('YYYY-MM-DD'),
        headers: {
            'Authorization': vn.state.token
        }
    }).
    then(function(occurrence_result) {
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/absencetype',
            headers: {
                'Authorization': vn.state.token
            }
        }).
        then(function(absencetype_result) {
            vn.state.absence_type = absencetype_result.results.map(function(e){
                return {'name': e.name, 'id': e.id};
            });
            vn.state.occurrences = occurrence_result.results;

            vn.state.occurrences.map(function(e) {

                var start_occurrence = moment(e.start_time);
                var end_occurrence = moment(e.end_time);
                for ( start_occurrence ; end_occurrence.isSameOrAfter(start_occurrence) ; start_occurrence.add(1, 'days') ) {
                    var absencetype_name = absencetype_result.results.find( x => e.absence_type == x.id ).name;
                    vn.state.occurrence_days.push({
                        'absencetype_id': e.absence_type,
                        'absencetype_name': absencetype_name,
                        'day': start_occurrence.format('YYYY-MM-DD') 
                    })
                }
                console.log(vn.state.occurrence_days);
            })
        }).
        catch(function(error){
            console.log(error);
        });
    }).
    catch(function(error){
        console.log(error);
    });

}


const Absences = {
    oninit: function(vn) {
        vn.state.year = (new Date()).getFullYear();
        vn.state.occurrences = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }        
        vn.state.dialog_remove_occurrence = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.token = Auth.token;
        get_occurrences(vn);
    },
    view: function(vn) {
        return m('.absences.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:12},
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
                                                        vn.state.year --;
                                                        get_occurrences(vn);                                                    },
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
                                                    onclick: function(ev) {
                                                        vn.state.year ++;
                                                        get_occurrences(vn);
                                                    },
                                                })
                                            ),
                                        ]),
                                        m(Layout.Row, [
                                            m(Layout.Cell, {span:6},
                                                m('ul.absences-list',
                                                    vn.state.occurrences.map(function(e){
                                                    return m('li.absences-list__item',
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
                                                                        vn.state.absence_type.find(x => x.id === e.absence_type).name
                                                                    ),
                                                                    m('.num-days',
                                                                        //moment.duration(moment(e.end_time).diff(moment(e.start_time))).asDays()
                                                                        moment(e.end_time).from(moment(e.start_time), true)
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
                                                        )       
                                                    })
                                                )
                                            ),
                                            m(Layout.Cell, {span:6},
                                                m('ul.total-absences',
                                                    m('li.total-absences__item', [
                                                        m('.num', '25'),
                                                        m('.desc', 'Dies totals'),
                                                    ]),
                                                    m('li.total-absences__item', [
                                                        m('.num', '13'),
                                                        m('.desc', 'Dies disponibles'),
                                                    ]),
                                                    m('li.total-absences__item', [
                                                        m('.num', '12'),
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
                                        ]),
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
                        m(Dialog, {
                            id: 'remove_occurrence',
                            header: 'Remove Occurrence',
                            model: vn.state.dialog_remove_occurrence.outer,
                            buttons: [{
                                text: 'Remove Occurrence',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: ('http://localhost:8000/absencies/absences/' + vn.state.occurrence_to_remove.id),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        const idx = vn.state.occurrences.indexOf(vn.state.occurrence_to_remove);
                                        if( idx >= 0){
                                            vn.state.occurrences.splice(idx, 1);
                                        }
                                        m.redraw();
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                    vn.state.dialog_remove_occurrence.outer.close();
                                }
                            },{
                                text: 'Cancel',
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

                ])    
        ]);
    }
}

export default Absences