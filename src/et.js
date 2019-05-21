import m from 'mithril';
import Auth from './models/auth'
import Menu from './main'
import MCWButton from './mdc/button'
import MCWList from './mdc/list'
import MWCFab from './mdc/fab'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'

const ET = {
    oninit: function(vn) {
        vn.state.members = [];
        vn.state.teams = [];
        vn.state.selected_members = [];
        vn.state.selected_teams = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.auth = Auth;
        const token = Auth.token;
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/workers',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.members = result.results.map(function(e){
                return {
                    'name': e.first_name + ' ' + e.last_name,
                    'link': '/member/' + e.id,
                };
            })
            vn.state.selected_members = vn.state.members;
            console.log('list ', vn.state.members);
            console.log('selected list ', vn.state.selected_members);
        }).
        catch(function(error){
            console.log(error);
        });
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/teams',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.teams = result.results.map(function(e){
                return {'name': e.name, 'link': '/team/' + e.id};
            });
            vn.state.selected_teams = vn.state.teams;
        }).
        catch(function(error){
            console.log(error);
        });
        vn.state.option = 'members';
    },
    view: function(vn) {
        return m('.et.drawer-frame-root', [
                m(Menu),
                m('.drawer-main-content', [
                    m(Layout,
                        m(Layout.Row, [
                            m(Layout.Cell, {span:12},
                                m(MCWCard, { header:[
                                    m('ul.et__tabs', [
                                        m('li',
                                            m('a.et__tab',
                                                {
                                                    class: vn.state.option == 'members' ? 'et__tab--selected':'',
                                                    onclick: function() {
                                                        vn.state.option = 'members';
                                                    }
                                                },
                                                'Members'
                                            )
                                        ),
                                        m('li',
                                            m('a.et__tab',
                                                {
                                                    class: vn.state.option == 'teams' ? 'et__tab--selected':'',
                                                    onclick: function() {
                                                        vn.state.option = 'teams';
                                                    }
                                                },
                                                'Teams'
                                            )
                                        )
                                    ])
                                ]
                                },
                                m(Layout,
                                    m(Layout.Row, [
                                        m(Layout.Cell, {span: 12}, [
                                        (vn.state.option == 'members') ? 
                                            [
                                                m('h2', 'Members'),
                                                m(MCWTextField, {
                                                    label: 'Nom de la persona a cercar',
                                                    outlined: true,
                                                    oninput: function(ev) {
                                                        if (ev.target.value !== ''){
                                                            vn.state.selected_members = 
                                                            vn.state.members.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                                []
                                                            :
                                                                vn.state.members.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                        }
                                                        else {
                                                            vn.state.selected_members = vn.state.members;    
                                                        }
                                                    }
                                                }),
                                                m(MCWList, { class:'members__list', elements_list: vn.state.selected_members},
                                                    (vn.state.auth.is_admin) ?
                                                        m(MWCFab, {
                                                            value: 'person_add',
                                                            onclick: function() {
                                                                // FORMULARI CREATE TEAM
                                                                console.log('CREATE PERSON!');
                                                                m.route.set('/worker_form');
                                                            }
                                                        })
                                                    :
                                                        ''
                                                ),
                                            ]
                                        :
                                            [
                                                m('h2', 'Teams'),
                                                m(MCWTextField, {
                                                    label: 'Nom de l\'equip a cercar',
                                                    outlined: true,
                                                    oninput: function(ev) {
                                                        if (ev.target.value !== ''){
                                                            vn.state.selected_teams = 
                                                            vn.state.teams.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase())) === undefined ?
                                                                []
                                                            :
                                                                vn.state.teams.filter(x => (x.name.toLowerCase()).includes(ev.target.value.toLowerCase()))
                                                        }
                                                        else {
                                                            vn.state.selected_teams = vn.state.teams;    
                                                        }
                                                    }
                                                }),
                                                m(MCWList, { class:'members__list', elements_list: vn.state.selected_teams},
                                                    (vn.state.auth.is_admin) ?
                                                        m(MWCFab, {
                                                            value: 'group_add',
                                                            onclick: function() {
                                                                console.log('CREATE TEAM!');
                                                                m.route.set('/team_form');
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

export default ET