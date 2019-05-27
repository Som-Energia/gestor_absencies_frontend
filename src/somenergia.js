import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import MWCFab from './mdc/fab'
import MCWButton from './mdc/button'
import MCWList from './mdc/list'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'


var apibase = process.env.APIBASE;

const SomEnergia = {
    oninit: function(vn) {
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
        m.request({
            method: 'GET',
            url: apibase+'/absencies/vacationpolicy',
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
            url: apibase+'/absencies/absencetype',
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
        return m('.et.drawer-frame-root', [
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
                                                'Vacation Policy'
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
                                                'Absence Type'
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
                                                m('h2', 'Vacation Policy'),
                                                m(MCWTextField, {
                                                    label: 'Nom de la politica de vacances a cercar',
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
                                                m('h2', 'Abscence Type'),
                                                m(MCWTextField, {
                                                    label: 'Nom del tipus d\'absencia',
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