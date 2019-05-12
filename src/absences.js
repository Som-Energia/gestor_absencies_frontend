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
            'start_period=' + formatDate(vn.state.start_period) +
            '&' +
            'end_period=' + formatDate(vn.state.end_period),
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
            vn.state.occurrences = occurrence_result.results.map(function(e){
                return {
                        'name': vn.state.absence_type.find(
                                x => x.id === e.absence_type
                            ).name + ' ' +
                            e.start_time + ' ' + e.end_time 
                        /*'start_occurrence': e.start_time,
                        'end_occurrence': e.end_time,
                        'absence_type': e.absence_type,*/
                    };
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
    oncreate: function(vn) {
        vn.state.year = (new Date()).getFullYear();
        vn.state.occurrences = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        get_occurrences(vn);
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
        return m('.absences.drawer-frame-root', [
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
                                                m('.', {align: 'center'}, 'Absències'),
                                                m('hr'),
                                                m(MCWList, {elements_list: vn.state.occurrences})
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
                ])    
        ]);
    }
}

export default Absences