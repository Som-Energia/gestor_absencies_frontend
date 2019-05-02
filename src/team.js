import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import MCWCard from './mdc/card'


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
            url: ('http://localhost:8000/absencies/members?team=' + vn.attrs.teamid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.members_info = result.results;
            m.redraw();
            console.log('members info', vn.state.members_info);
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

        vn.state.members_list = [];
        vn.state.members_info.map(function(vn){
            console.log('TODO!');
        })
    },
    /*onupdate: function(vn){
        if (vn.state.members_info !== []) {
            vn.state.members_info.map(function(e){
                m.request({
                    method: 'GET',
                    url: ('http://localhost:8000/absencies/workers/' + e.worker),
                    headers: {
                        'Authorization': token
                    }
                }).
                then(function(result) {
                    vn.state.workers_info.push(result);
                    m.redraw();
                    console.log('worker info', vn.state.members_info);
                    vn.state.editing = true; // TODO: Check user permission
                    if (e.is_referent === true) {
                        console.log('is referent!');
                        vn.state.referent_info = result;
                    }
                    if (e.is_representant === true) {
                        console.log('is representant!');
                        vn.state.representant_info = result;    
                    }

                }).
                catch(function(error){
                    console.log(error);
                });
            })
        }

    },*/
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
                                                                            'value': vn.state.team_info[key],
                                                                            'placeholder': key,
                                                                            'disabled' : vn.state.editing ,
                                                                            onblur: function (e){
                                                                                vn.state.team_info[key] = e.target.value;
                                                                            },
                                                                        })
                                                                    )
                                                                )
                                                        )
                                                    })
                                                ])
                                            )
                                        )
                                    )
                            ]),
                        ),
                                //m(MWCSnackbar),
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
                                m.redraw();
                                vn.state.editing = true;
                            }).
                            catch(function(error){
                                console.log(error);
                            });
                        }
                        vn.state.editing = !vn.state.editing;
                    }
                }),
            ],
            )
        }
}

export default Team