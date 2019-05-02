import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import MWCFab from './mdc/fab'
import MCWButton from './mdc/button'
import MCWList from './mdc/list'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'


const SomEnergia = {
    oninit: function(vn) {
        vn.state.vacation_policies = [];
        vn.state.som_energia_absence_types = []; 
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/vacationpolicy',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.vacation_policies = result.results.map(function(e){
                return {'name': e.name, 'link': '/vacationpolicy/' + e.id};
            })
        }).
        catch(function(error){
            console.log(error);
        });
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/absencetype',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.teams = result.results.map(function(e){
                return {'name': e.name, 'link': '/absencetype/' + e.id};
            });
            vn.state.can_edit = true;
        }).
        catch(function(error){
            console.log(error);
        });
        vn.state.option = 'vacation_policy';
    },
    view: function(vn) {
        return m('.et', (vn.state.option == 'vacation_policy') ? [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
                            m(MCWCard, [
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span:6},
                                            m(MCWButton,
                                                {
                                                    name: 'Politica de Vacances',
                                                    onclick: function() {
                                                        vn.state.option = 'vacation_policy';
                                                    }
                                                }
                                            )
                                        ),
                                        m(Layout.Cell, {span:6},
                                            m(MCWButton,
                                                {
                                                    name: 'Tipus d\'absencies',
                                                    onclick: function() {
                                                        vn.state.option = 'absence_type';
                                                    }
                                                }
                                            )

                                        ),
                                    ])
                                ),
                                m('hr'),
                                m(MCWList, {elements_list: vn.state.vacation_policies},
                                    (vn.state.can_edit === true) ?
                                        m(MWCFab, {
                                            value: 'beach_access',
                                            onclick: function() {
                                                    // FORMULARI CREATE TEAM
                                                    console.log('CREATE VACATION POLICY!');
                                            }
                                        })
                                    :
                                        ''
                                ),
                            ])
                        )
                    ])
                )
        ]
        :
            [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
                            m(MCWCard, [
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span:6},
                                            m(MCWButton,
                                                {
                                                    name: 'Politica de Vacances',
                                                    onclick: function() {
                                                        vn.state.option = 'vacation_policy';
                                                }
                                            }),
                                        ),
                                        m(Layout.Cell, {span:6},
                                            m(MCWButton,
                                                {
                                                    name: 'Tipus d\'absencies',
                                                    onclick: function() {
                                                        vn.state.option = 'absence_type';
                                                }
                                            }
                                            ),
                                        )

                                    ])
                                ),
                                m('hr'),
                                m(MCWList, {elements_list: vn.state.som_energia_absence_types},
                                    (vn.state.can_edit === true) ?
                                        m(MWCFab, {
                                            value: 'assignment_late',
                                            onclick: function() {
                                                    console.log('CREATE SOM ENERGIA ABSENCE TYPE!');
                                            }
                                        })
                                    :
                                        ''
                                ),
                            ])
                        )
                    ])
                )
            ]
        )
    }
}

export default SomEnergia