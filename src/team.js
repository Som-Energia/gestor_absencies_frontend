import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import MCWButton from './mdc/button'
import MCWCard from './mdc/card'
import MCWList from './mdc/list'
import Dialog from './mdc/dialog'
import MCWSelectmenu from './mdc/selectmenu'

const Team = {
    oninit: function(vn) {
        vn.state.team_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        vn.state.members_info = [];
        vn.state.workers_info = [];
        vn.state.members_list = [];
        vn.state.possibles_referents = [];
        vn.state.actual_representant = '';
        vn.state.actual_referent = '';
        vn.state.dialog = {};

        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/teams/' + vn.attrs.teamid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.team_info = result;
            m.redraw();
            console.log('team info', vn.state.team_info);
            vn.state.editing = true; // TODO: Check user permission
        }).
        catch(function(error){
            console.log(error);
        });
        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/workers'),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.workers_info = result.results;
            m.redraw();
            console.log('worker info', vn.state.workers_info);
            vn.state.editing = true; // TODO: Check user permission
        }).
        catch(function(error){
            console.log(error);
        });
        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/members?team=' + vn.attrs.teamid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.members_info = result.results;
            m.redraw();
            console.log('members info', vn.state.members_info);
            vn.state.members_list = [];
            if (vn.state.members_info !== undefined && vn.state.workers_info !== undefined) {
                vn.state.members_info.map(function(e){
                    var presunto_worker = vn.state.workers_info.find(x => x.id === e.worker);
                    console.log('presunto_worker ', presunto_worker);
                    if (e.is_referent === true) {
                        vn.state.request_body_referent = e;
                        vn.state.actual_referent = ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                            ' ' +
                            (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : '')
                    }
                    if (e.is_representant === true) {
                        vn.state.request_body_representant = e;
                        vn.state.actual_representant = ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                            ' ' +
                            (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : '')
                    }

                    vn.state.members_list.push({
                        'name': ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                            ' ' + 
                            (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : ''),
                        'link': '/member/' + presunto_worker.id,
                        'button': m(MCWButton, {
                            onclick: function(ev) {
                                vn.state.dialog.open();
                            }
                        })
                    })
                    vn.state.possibles_referents.push({
                        'text': ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                            ' ' + 
                            (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : ''),
                        'value': presunto_worker.id
                    })

                })
                console.log('LLISTA MEMBERS ', vn.state.members_list);
            }
        }).
        catch(function(error){
            console.log(error);
        });
            vn.state.editing = true; // TODO: Check user permission

    },
    view: function(vn) {
        return m('.team', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
                            m(MCWCard, [
                                m('h2', 'Dades de l\'Equip'),
                                    m(Layout,
                                        m(Layout.Row,
                                            m(Layout.Cell, {span:8},
                                                m('.team_info', [
                                                    Object.keys(vn.state.team_info).map(function(key){
                                                        return m(Layout,
                                                                m(Layout.Row,
                                                                    m(Layout.Cell, {span:12},
                                                                        m(MCWTextField, {
                                                                            label: key,
                                                                            value: vn.state.team_info[key],
                                                                            disabled: vn.state.editing,
                                                                            oninput: function(ev) {
                                                                                vn.state.team_info[key]=ev.target.value;
                                                                            }                                                                            
                                                                        })
                                                                    )
                                                                )
                                                        )
                                                    }),
                                                    m(Layout,
                                                        m(Layout.Row,
                                                            m(Layout.Cell, {span:12},
                                                                m(MCWSelectmenu, {
                                                                    default: vn.state.actual_referent,
                                                                    value: vn.state.actual_referent,
                                                                    elements_list: vn.state.possibles_referents,
                                                                    disabled: vn.state.editing,
                                                                    onchange: function(ev){
                                                                        vn.state.request_body_referent['worker'] = parseInt(ev.target.value);

                                                                    }
                                                                })
                                                            )
                                                        )
                                                    ),
                                                ])
                                            )
                                        ),
                                        m(Layout.Row,
                                            m(Layout.Cell, [
                                                m('h2', 'Membres de l\'Equip'),
                                            ])
                                        ),
                                        m(Layout.Row,
                                            m(Layout.Cell, {span:8},
                                                m('.members', [
                                                    !vn.state.editing ?
                                                        m(MCWList, {
                                                            elements_list: vn.state.members_list
                                                        })
                                                    :
                                                        m(MCWList, {
                                                            elements_list: vn.state.members_list.map(function(e) {
                                                                return {'name': e.name, 'link': e.link};
                                                            })
                                                        })          
                                                ])
                                            )
                                        ),
                                        !vn.state.editing ?
                                            m(Layout.Row,
                                                m(Layout.Cell,
                                                    m(MCWButton, {
                                                        onclick: function(){
                                                            console.log('AD ME!');
                                                        }
                                                    }),                                           
                                                ),
                                                m(Layout.Cell,
                                                    m(MCWButton, {
                                                        onclick: function(){
                                                            console.log('REMOVE TEAM!!');
                                                        }
                                                    }),                                           
                                                )
                                            )
                                        :
                                            undefined
                                    )
                            ]),
                        ),
                    ])
                ),
                m(MWCFab, {
                    value: (vn.state.editing)?'edit':'save',
                    onclick: function() {
                        if (vn.state.editing === false) {
                            // Es pot enviat el metode put!
                            m.request({
                                method: 'PUT',
                                url: ('http://localhost:8000/absencies/teams/' + vn.attrs.teamid),
                                headers: {
                                    'Authorization': Auth.token,
                                    'Content-type': 'application/json',
                                },
                                data: vn.state.team_info
                            }).
                            then(function(result) {
                                vn.state.team_info = result;
                                vn.state.editing = true;
                                m.redraw();
                            }).
                            catch(function(error){
                                console.log(error);
                            });
                            if (vn.state.request_body_referent !== undefined) {
                                console.log('REQUEST PER CANVIAR REFERENT body ',
                                    vn.state.request_body_referent
                                )
                                m.request({
                                    method: 'PUT',
                                    url: ('http://localhost:8000/absencies/members/' + vn.state.request_body_referent.id),
                                    headers: {
                                        'Authorization': Auth.token,
                                        'Content-type': 'application/json',
                                    },
                                    data: vn.state.request_body_referent
                                }).
                                then(function(result) {
                                    vn.state.actual_referent = ((result.first_name !== undefined) ? result.first_name : '-' +
                                        ' ' +
                                        (result.last_name !== undefined) ? result.last_name : '')
                                    m.redraw();
                                }).
                                catch(function(error){
                                    console.log(error);
                                });
                            }

                        }
                        vn.state.editing = !vn.state.editing;
                    }
                }),
                m(Dialog, {
                    id: 'random',
                    headers: 'Header',
                    model: vn.state.dialog,
                    onaccept: function(ev) {
                        ev.cancelBubble = true;
                        vn.state.dialog.innerexit = 'Accepted';
                        m.redraw();
                    },
                    onclose: function(ev) {
                        vn.state.self.dialog.innerexit = 'Rejected';
                        m.redraw();
                    },
                    backdrop: false,
                }),
            ],
            )
        }
}

export default Team