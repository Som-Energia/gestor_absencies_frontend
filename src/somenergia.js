import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import MWCFab from './mdc/fab'
import MCWButton from './mdc/button'
import MCWList from './mdc/list'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import get_objects from './iterate_request'

var apibase = process.env.APIBASE;

const SomEnergia = {
    oninit: async function(vn) {
        vn.state.vacation_policies = [];
        vn.state.absence_types = []; 
        vn.state.selected_vacationpolicy = [];
        vn.state.selected_absencetype = [];
        vn.state.vacation_policy = [];
        
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.auth = Auth;
        const token = Auth.token;

        var url = apibase+'/absencies/vacationpolicy';

        var headers = {'Authorization': token}

        vn.state.vacation_pocilies_result = await get_objects(url, headers);

        vn.state.vacation_policies = vn.state.vacation_pocilies_result.map(function(e){
            return {'name': e.name, 'link': '/vacationpolicy/' + e.id};
        })
        vn.state.selected_vacationpolicy = vn.state.vacation_policies;

        var url = apibase+'/absencies/absencetype'+(vn.state.auth.is_admin ? '' : '?global_date=False');

        var headers = {'Authorization': token}

        vn.state.absence_type_result = await get_objects(url, headers);

        vn.state.absence_type = vn.state.absence_type_result.map(function(e){
            return {'name': e.name, 'link': '/absencetype/' + e.id};
        });
        console.log('vn.state.absence_type ', vn.state.absence_type);
        vn.state.selected_absencetype = vn.state.absence_type;
        vn.state.can_edit = true;
        vn.state.option = 'vacation_policy';
        m.redraw();
    },
    view: function(vn) {
        return (Auth.token === false) ?
            m('', '')
            :
            m('.et.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:11},
                                m(MCWCard, { header:[
                                    m('ul.et__tabs', [
                                        m('li',
                                            m('a.et__tab',
                                                {
                                                    class: vn.state.option == 'vacation_policy' ? 'et__tab--selected':'',
                                                    onclick: function() {
                                                        vn.state.option = 'vacation_policy';
                                                    }
                                                },
                                                'Polítiques de Vacances'
                                            )
                                        ),
                                        m('li',
                                            m('a.et__tab',
                                                {
                                                    class: vn.state.option == 'absence_type' ? 'et__tab--selected':'',
                                                    onclick: function() {
                                                        vn.state.option = 'absence_type';
                                                    }
                                                },
                                                'Tipus d\'Absències'
                                            )
                                        )
                                    ])
                                ]
                                },
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span: 12}, [
                                        (vn.state.option == 'vacation_policy') ? 
                                            [
                                                m('h2', 'Polítiques de Vacances'),
                                                m(MCWTextField, {
                                                    label: 'Filtrar',
                                                    outlined: true,
                                                    oninput: function(ev) {
                                                        if (ev.target.value !== ''){
                                                            vn.state.selected_vacationpolicy = 
                                                            vn.state.vacation_policies.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                                []
                                                            :
                                                                vn.state.vacation_policies.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                        }
                                                        else {
                                                            vn.state.selected_vacationpolicy = vn.state.vacation_policies;    
                                                        }
                                                    }
                                                }),
                                                m(MCWList, { class:'members__list', elements_list: vn.state.selected_vacationpolicy},
                                                    (vn.state.auth.is_admin) ?
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
                                                m('h2', 'Tipus d\'Absències'),
                                                m(MCWTextField, {
                                                    label: 'Filtrar',
                                                    outlined: true,
                                                    oninput: function(ev) {
                                                        if (ev.target.value !== ''){
                                                            vn.state.selected_absencetype = 
                                                            vn.state.absencetype.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                                []
                                                            :
                                                                vn.state.absencetype.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                        }
                                                        else {
                                                            vn.state.selected_absencetype = vn.state.absencetype;    
                                                        }
                                                    }
                                                }),
                                                m(MCWList, { class:'members__list', elements_list: vn.state.selected_absencetype},
                                                    (vn.state.auth.is_admin) ?
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
                                        ])
                                    ])
                                )

                                )
                            )
                        ])
                    )
                ])
        ])
    }
}

export default SomEnergia