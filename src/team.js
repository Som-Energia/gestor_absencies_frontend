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


var apibase = process.env.APIBASE;

const Team = {
    oninit: function(vn) {
        vn.state.team_info = {};
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        vn.state.auth = Auth;
        vn.state.members_info = [];
        vn.state.workers_info = [];
        vn.state.members_list = [];
        vn.state.possibles_referents = [];
        vn.state.possibles_members = [];
        vn.state.actual_representant = '';
        vn.state.actual_referent = '';
        vn.state.request_body_referent = {};
        vn.state.request_body_representant = {};
        vn.state.request_body_old_referent = {}
        vn.state.request_body_old_representant = {};
        vn.state.dialog_add_member = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.dialog_remove_team = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.dialog_remove_member = {
            backdrop: true,
            outer: {},
            inner: {},
        };

        m.request({
            method: 'GET',
            url: (apibase+'/absencies/teams/' + vn.attrs.teamid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {

            Object.keys(result).map(function(key){
                if (key !== 'id') {
                    vn.state.team_info[key] = result[key];   
                }
            });
            m.redraw();
            console.log('team info', vn.state.team_info);
            vn.state.editing = true; // TODO: Check user permission
            
            m.request({
                method: 'GET',
                url: (apibase+'/absencies/workers'),
                headers: {
                    'Authorization': token
                }
            }).
            then(function(result) {
                vn.state.workers_info = result.results;
                m.redraw();
                console.log('worker info', vn.state.workers_info);
                vn.state.workers_info.map(function(e){
                    if (e.id == vn.state.auth.user_id) {
                        vn.state.my_name = e.first_name + ' ' + e.last_name;
                    }
                    vn.state.possibles_members.push({
                        'text': e.first_name + ' ' + e.last_name,
                        'value': e.id,
                    });
                });
                vn.state.editing = true; // TODO: Check user permission

                m.request({
                    method: 'GET',
                    url: (apibase+'/absencies/members?team=' + vn.attrs.teamid),
                    headers: {
                        'Authorization': token
                    }
                }).
                then(function(result) {
                    vn.state.members_info = result.results;
                    console.log('members info', vn.state.members_info);
                    vn.state.members_list = [];
                    if (vn.state.members_info !== undefined && vn.state.workers_info !== undefined) {
                        vn.state.members_info.map(function(e){
                            if (e.worker == vn.state.auth.user_id) {
                                console.log('Soc memeber');
                                vn.state.im_member = true;
                                vn.state.member_id = e.id;
                            }
                            var presunto_worker = vn.state.workers_info.find(x => x.id === e.worker);
                            console.log('presunto_worker ', presunto_worker);
                            if (e.is_referent === true) {
                                console.log(`És referent!`);
                                vn.state.request_body_referent = e;
                                console.log(vn.state.request_body_referent);
                                vn.state.request_body_old_referent = e;
                                console.log('DEFERENT ----------------------------> ', e);
                                vn.state.actual_referent = ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                                    ' ' +
                                    (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : '')
                            }
                            if (e.is_representant === true) {
                                vn.state.request_body_representant = e;
                                vn.state.request_body_old_representant = e;
                                console.log('REPRESENTANT ----------------------------> ', e);
                                vn.state.actual_representant = ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                                    ' ' +
                                    (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : '')
                            }

                            vn.state.members_list.push({
                                'id': e.id,
                                'name': ((presunto_worker.first_name !== undefined) ? presunto_worker.first_name : '-' +
                                    ' ' + 
                                    (presunto_worker.last_name !== undefined) ? presunto_worker.last_name : ''),
                                'link': '/member/' + presunto_worker.id,
                                'button': m(MCWButton, {
                                    icon: 'delete',
                                    onclick: function(ev) {
                                        vn.state.member_to_remove = e.id
                                        console.log('Remove member ', vn.state.member_to_remove, e);
                                        vn.state.dialog_remove_member.outer.open();
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
                        vn.state.possibles_referents.push({
                            'text': '',
                            'value': '',
                        })
                        console.log(
                            'LLISTA DE POSSIBLES REFERENTS / REPRESENTANTS ',
                            vn.state.possibles_referents,
                            'actual referent',
                            vn.state.request_body_representant,
                            'actual representant',
                            vn.state.request_body_referent
                        );
                    }
                    m.redraw();
                    
                }).
                catch(function(error){
                    console.log(error);
                });



            }).
            catch(function(error){
                console.log(error);
            });

        }).
        catch(function(error){
            console.log(error);
        });

        vn.state.editing = true; // TODO: Check user permission

    },
    view: function(vn) {
        return m('.team.drawer-frame-root', [
                m(Menu),
                    m('.drawer-main-content', [
                        m(Layout,
                            m(Layout.Row, [
                                m(Layout.Cell, {span:12},
                                m(MCWCard, { header: m('h2','Team') }, [
                                        m(Layout,
                                            m('.team_info', [
                                                m(Layout.Row, [
                                                    Object.keys(vn.state.team_info).map(function(key){
                                                        return m(Layout.Cell, {span:12},
                                                                    m(MCWTextField, {
                                                                        label: key,
                                                                        value: vn.state.team_info[key],
                                                                        outlined: true,
                                                                        disabled: vn.state.editing,
                                                                        oninput: function(ev) {
                                                                            vn.state.team_info[key]=ev.target.value;
                                                                        },
                                                                    })
                                                                )
                                                    })
                                                ])
                                            ])
                                        ),
                                        m(Layout,
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:6},
                                                    m(MCWSelectmenu, {
                                                        outlined: true,
                                                        label: 'Referent',
                                                        id: 'referent_selectmenu',
                                                        value: vn.state.request_body_referent.worker != undefined ? vn.state.request_body_referent.worker : '',
                                                        options: vn.state.possibles_referents,
                                                        disabled: vn.state.editing,
                                                        onchange: function(ev){
                                                            vn.state.request_body_referent = vn.state.members_info.find(
                                                                x => x.worker == parseInt(ev.target.value)
                                                            );
                                                            vn.state.request_body_referent['is_referent'] = true;
                                                            vn.state.request_body_old_referent !== {} ? vn.state.request_body_old_referent['is_referent'] = false : '';
                                                        }
                                                    })
                                                ),
                                                m(Layout.Cell, {span:6},
                                                    m(MCWSelectmenu, {
                                                        outlined: true,
                                                        label: 'Representant',
                                                        value: vn.state.request_body_representant.worker != undefined ? vn.state.request_body_representant.worker : '',
                                                        options: vn.state.possibles_referents,
                                                        disabled: vn.state.editing,
                                                        onchange: function(ev){
                                                            vn.state.request_body_representant = vn.state.members_info.find(
                                                                x => x.worker == parseInt(ev.target.value)
                                                            );
                                                            vn.state.request_body_representant['is_representant'] = true;
                                                            vn.state.request_body_old_representant !== {} ? vn.state.request_body_old_representant['is_representant'] = false : '';
                                                        }
                                                    })
                                                ),
                                            ),
                                        ),
                                        m(Layout, 
                                            m(Layout.Row,
                                                m(Layout.Cell, [
                                                    m('h2', 'Membres de l\'Equip'),
                                                ])
                                            ),
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:12},
                                                    m('.members', [
                                                        !vn.state.editing ?
                                                            m(MCWList, {
                                                                class:'members__list',
                                                                elements_list: vn.state.members_list
                                                            })
                                                        :
                                                            m(MCWList, {
                                                                class:'members__list',
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
                                                            raised: true,
                                                            onclick: function(){
                                                                vn.state.dialog_add_member.outer.open();
                                                            }
                                                        }, 'Add Member'),
                                                    ),
                                                    m(Layout.Cell,
                                                        m(MCWButton, {
                                                            raised: true,
                                                            onclick: function(){
                                                                vn.state.dialog_remove_team.outer.open();
                                                            }
                                                        }, 'Remove Team'),
                                                    )
                                                )
                                            :
                                                undefined
                                        ),
                                    ])
                                )
                            ]),
                        ),
                        ( vn.state.auth.is_admin ?

                            m(MWCFab, {
                                value: (vn.state.editing)?'edit':'save',
                                onclick: function() {
                                    if (vn.state.editing === false) {
                                        // Es pot enviat el metode put!
                                        m.request({
                                            method: 'PUT',
                                            url: (apibase+'/absencies/teams/' + vn.attrs.teamid),
                                            headers: {
                                                'Authorization': Auth.token,
                                                'Content-type': 'application/json',
                                            },
                                            data: vn.state.team_info
                                        }).
                                        then(function(result) {
                                            Object.keys(result).map(function(key){
                                                if (key !== 'id') {
                                                    vn.state.team_info[key] = result[key];   
                                                }
                                            });
                                            //vn.state.editing = true;
                                            m.redraw();
                                        }).
                                        catch(function(error){
                                            console.log(error);
                                        });
                                        if (vn.state.request_body_old_referent !== {} && vn.state.request_body_referent.id !== vn.state.request_body_old_referent.id) {
                                            console.log('REQUEST PER CANVIAR REFERENT body ',
                                                vn.state.request_body_referent,
                                                vn.state.request_body_referent.worker
                                            )
                                            m.request({
                                                method: 'PUT',
                                                url: (apibase+'/absencies/members/' + vn.state.request_body_referent.id),
                                                headers: {
                                                    'Authorization': Auth.token,
                                                    'Content-type': 'application/json',
                                                },
                                                data: vn.state.request_body_referent
                                            }).
                                            then(function(result) {
                                            }).
                                            catch(function(error){
                                                console.log(error);
                                            });
                                            m.request({
                                                method: 'PUT',
                                                url: (apibase+'/absencies/members/' + vn.state.request_body_old_referent.id),
                                                headers: {
                                                    'Authorization': Auth.token,
                                                    'Content-type': 'application/json',
                                                },
                                                data: vn.state.request_body_old_referent
                                            }).
                                            then(function(result) {

                                            }).
                                            catch(function(error){
                                                console.log(error);
                                            });
                                        }
                                        if (vn.state.request_body_old_representant !== {} && vn.state.request_body_representant.id !== vn.state.request_body_old_representant.id) {
                                            m.request({
                                                method: 'PUT',
                                                url: (apibase+'/absencies/members/' + vn.state.request_body_representant.id),
                                                headers: {
                                                    'Authorization': Auth.token,
                                                    'Content-type': 'application/json',
                                                },
                                                data: vn.state.request_body_representant
                                            }).
                                            then(function(result) {

                                            }).
                                            catch(function(error){
                                                console.log(error);
                                            });
                                            m.request({
                                                method: 'PUT',
                                                url: (apibase+'/absencies/members/' + vn.state.request_body_old_representant.id),
                                                headers: {
                                                    'Authorization': Auth.token,
                                                    'Content-type': 'application/json',
                                                },
                                                data: vn.state.request_body_old_representant
                                            }).
                                            then(function(result) {

                                            }).
                                            catch(function(error){
                                                console.log(error);
                                            });
                                        }
                                    }
                                    vn.state.editing = !vn.state.editing;
                                }
                            })
                        :
                            m(MWCFab, {
                                value: (vn.state.im_member)?'-':'+',
                                onclick: function() {
                                    if (vn.state.im_member) {
                                        m.request({
                                            method: 'DELETE',
                                            url: (apibase+'/absencies/members/' + vn.state.member_id),
                                            headers: {
                                                'Authorization': Auth.token,
                                            },
                                        }).
                                        then(function(result) {
                                            vn.state.im_member = !vn.state.im_member;
                                            vn.state.members_list = vn.state.members_list.filter(
                                                x => x.id != vn.state.member_id
                                            );
                                        }).
                                        catch(function(error){
                                            console.log(error);
                                        });
                                    }
                                    else {
                                        m.request({
                                            method: 'POST',
                                            url: (apibase+'/absencies/members'),
                                            headers: {
                                                'Authorization': Auth.token,
                                                'Content-type': 'application/json',
                                            },
                                            data: {
                                                'worker': vn.state.auth.user_id,
                                                'team': vn.attrs.teamid
                                            }
                                        }).
                                        then(function(result) {                                            
                                            vn.state.im_member = !vn.state.im_member;
                                            vn.state.member_id = result.id;
                                            vn.state.members_list.push({
                                                'id': result.id,
                                                'name': vn.state.my_name,
                                                'link': '/member/' + vn.state.auth.user_id,
                                                'button': m(MCWButton, {
                                                    icon: 'delete',
                                                    onclick: function(ev) {
                                                        console.log('Remove member');
                                                    }
                                                })
                                            })
                                        }).
                                        catch(function(error){
                                            console.log(error);
                                        });                                    
                                    }
                                }
                            })
                        ),
                        m(Dialog, {
                            id: 'add_member',
                            header: 'Add member',
                            model: vn.state.dialog_add_member.outer,
                            buttons: [{
                                text: 'Sub dialog',
                                onclick: function(){
                                    m.request({
                                        method: 'POST',
                                        url: (apibase+'/absencies/members'),
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: {
                                            'worker': parseInt(vn.state.new_member),
                                            'team': parseInt(vn.attrs.teamid)
                                        }
                                    }).
                                    then(function(result) {
                                        var worker_member = vn.state.workers_info.find(x => x.id == vn.state.new_member);
                                        console.log(
                                            'ADD MEMBER ',
                                            vn.state.new_member,
                                            worker_member,
                                            vn.state.workers_info
                                        );
                                        vn.state.members_list.push({
                                            'name': ((worker_member !== undefined && worker_member.first_name !== undefined) ? worker_member.first_name : '-' +
                                                ' ' + 
                                                (worker_member !== undefined && worker_member.last_name !== undefined) ? worker_member.last_name : ''),
                                            'link': '/member/' + worker_member.id,
                                            'button': m(MCWButton, {
                                                icon: 'delete',
                                                onclick: function(ev) {
                                                    console.log('Remove member');
                                                }
                                            })
                                        })
                                        vn.state.dialog_add_member.outer.close();
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                    vn.state.dialog_add_member.outer.close();
                                }
                            },{
                                text: 'Cancel dialog',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_add_member.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_add_member.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_add_member.backdrop,
                        }, [
                            m(MCWSelectmenu, {
                                outlined: true,
                                label: 'Treballador',
                                options: vn.state.possibles_members,
                                onchange: function(ev){
                                    vn.state.new_member = ev.target.value;
                                }
                            }),
                        ]),
                        m(Dialog, {
                            id: 'remove_member',
                            header: 'Remove member',
                            model: vn.state.dialog_remove_member.outer,
                            buttons: [{
                                text: 'Sub dialog',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: (apibase+'/absencies/members/' + vn.state.member_to_remove),
                                        headers: {
                                            'Authorization': Auth.token,
                                        }
                                    }).
                                    then(function(result) {
                                        vn.state.members_list = vn.state.members_list.filter(
                                            x => x.id != vn.state.member_to_remove
                                        );
                                        console.log(
                                            'REMOVE MEMBER ',
                                            vn.state.members_list,
                                            ' ',
                                            vn.state.member_to_remove
                                        );
                                        m.redraw();
                                        vn.state.dialog_remove_member.outer.close();
                                        
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                    vn.state.dialog_remove_member.outer.close();
                                }
                            },{
                                text: 'Cancel dialog',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_remove_member.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_member.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_member.backdrop,
                        },
                        ),
                        m(Dialog, {
                            id: 'remove_team',
                            header: 'Remove Team',
                            model: vn.state.dialog_remove_team.outer,
                            buttons: [{
                                text: 'Remove Team',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: (apibase+'/absencies/teams/' + vn.attrs.teamid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        console.log('Team removed!');
                                        m.route.set('/et');
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                    vn.state.dialog_remove_team.outer.close();
                                }
                            },{
                                text: 'Cancel',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_remove_team.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_team.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog_remove_team.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_team.backdrop,
                        }, [
                            m('.', 'Estas segur que vols eliminar aquest equip?')

                        ]),
                    ])
        ])
    }
}

export default Team