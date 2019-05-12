import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import MWCFab from './mdc/fab'
import MCWButton from './mdc/button'
import MCWList from './mdc/list'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'

const SomEnergia = {
    oninit: function(vn) {
        vn.state.vacation_policies = [];
        vn.state.absence_types = []; 
        vn.state.selected_vacationpolicy = [];
        vn.state.selected_absencetype = [];
        
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
            vn.state.selected_vacationpolicy = vn.state.vacation_policies;
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
            vn.state.absence_type = result.results.map(function(e){
                return {'name': e.name, 'link': '/absencetype/' + e.id};
            });
            console.log('vn.state.absence_type ', vn.state.absence_type);
            vn.state.selected_absencetype = vn.state.absence_type;
            vn.state.can_edit = true;
        }).
        catch(function(error){
            console.log(error);
        });
        vn.state.option = 'vacation_policy';
    },
    view: function(vn) {
        return m('.somenergia.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:12},
                                m(MCWCard,
                                    (vn.state.option == 'vacation_policy') ? 
                                        [
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
                                            m(MCWTextField, {
                                                label: 'Nom de l\'equip a cercar',
                                                outlined: true,
                                                oninput: function(ev) {
                                                    if (ev.target.value !== ''){
                                                        vn.state.selected_vacationpolicy = 
                                                        vn.state.vacation_policy.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                            []
                                                        :
                                                            vn.state.vacation_policy.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                    }
                                                    else {
                                                        vn.state.selected_vacationpolicy = vn.state.vacation_policy;    
                                                    }
                                                }
                                            }),
                                            m(MCWList, {elements_list: vn.state.selected_vacationpolicy},
                                                (vn.state.can_edit === true) ?
                                                    m(MWCFab, {
                                                        value: 'beach_access',
                                                        onclick: function() {
                                                            m.route.set('/vacationpolicy_form');
                                                        }
                                                    })
                                                :
                                                    ''
                                            ),
                                        ]
                                    :
                                        [
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
                                            m(MCWTextField, {
                                                label: 'Nom de l\'equip a cercar',
                                                outlined: true,
                                                oninput: function(ev) {
                                                    if (ev.target.value !== ''){
                                                        vn.state.selected_absencetype = 
                                                        vn.state.absence_type.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                            []
                                                        :
                                                            vn.state.absence_type.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                    }
                                                    else {
                                                        vn.state.selected_absencetype = vn.state.absence_type;    
                                                    }
                                                }
                                            }),
                                            m(MCWList, {elements_list: vn.state.selected_absencetype},
                                                (vn.state.can_edit === true) ?
                                                    m(MWCFab, {
                                                        value: 'assignment_late',
                                                        onclick: function() {
                                                            m.route.set('/absencetype_form');
                                                        }
                                                    })
                                                :
                                                    ''
                                            ),
                                        ]
                                    )
                                )
                            ])
                        )
                    ])
                ])
    }
}

export default SomEnergia