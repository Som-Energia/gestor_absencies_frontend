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
        then(function(abnsecetype_result) {
            vn.state.absence_type = abnsecetype_result.results.map(function(e){
                return {'name': e.name, 'id': e.id};
            });
            vn.state.occurrences = occurrence_result.results;            
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
                                                                        //vn.state.occurrence_to_remove = e.id
                                                                        console.log('Remove member');
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
                                        console.log(vn.state.occurrence_to_remove);
                                        console.log(vn.state.occurrences);
                                        console.log(vn.state.occurrences.indexOf(vn.state.occurrence_to_remove));
                                        const idx = vn.state.occurrences.indexOf(vn.state.occurrence_to_remove);
                                        if( idx >= 0){
                                            vn.state.occurrences.splice(idx, 1);
                                        }
                                        console.log('Occurrence removed!');
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
                                    console.log('cancel dialog');
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