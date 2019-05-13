import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWButton from './mdc/button'


const Member = {
    oninit: function(vn) {
        vn.state.member_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        vn.state.dialog_remove_worker = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/workers/' + vn.attrs.memberid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.member_info = result;
            m.redraw();
            vn.state.editing = true;
        }).
        catch(function(error){
            console.log(error);
        });    
    },
    view: function(vn) {
        return m('.member.drawer-frame-root', [
                m(Menu),
                    m('.drawer-main-content', [
                        m(Layout,
                            m(Layout.Row, [
                                m(Layout.Cell, {span:12},
                                    m(MCWCard, [
                                        m('h2', 'Dades personals'),
                                            m(Layout,
                                                m(Layout.Row,
                                                    m(Layout.Cell, {span:8},
                                                        m('.personal_info', [
                                                            Object.keys(vn.state.member_info).map(function(key){
                                                                return m(Layout,
                                                                        m(Layout.Row,
                                                                            m(Layout.Cell, {span:12},
                                                                                m(MCWTextField, {
                                                                                    label: key,
                                                                                    value: vn.state.member_info[key],
                                                                                    disabled: vn.state.editing,
                                                                                    oninput: function (e){
                                                                                        vn.state.member_info[key] = e.target.value;
                                                                                    },
                                                                                })
                                                                            )
                                                                        )
                                                                )
                                                            })
                                                        ])
                                                    )
                                                ),
                                                !vn.state.editing ?
                                                    m(Layout.Row,
                                                        m(Layout.Cell, {span:5}),
                                                        m(Layout.Cell, {span:2},
                                                            m(MCWButton, {
                                                                name: 'remove worker',
                                                                onclick: function(){
                                                                    vn.state.dialog_remove_worker.outer.open();
                                                                }
                                                            }),
                                                        ),
                                                        m(Layout.Cell, {span:5})
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
                                        url: ('http://localhost:8000/absencies/workers/' + vn.attrs.memberid),
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.member_info
                                    }).
                                    then(function(result) {
                                        vn.state.member_info = result;
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
                        m(Dialog, {
                            id: 'remove_worker',
                            header: 'Remove Worker',
                            model: vn.state.dialog_remove_worker.outer,
                            content: 'Estas segur?',
                            buttons: [{
                                text: 'Eliminar el Worker',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: ('http://localhost:8000/absencies/workers/' + vn.attrs.memberid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        console.log('Worker removed!');
                                        m.route.set('/et');
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });    
                                    vn.state.dialog_remove_worker.outer.close();
                                }
                            },{
                                text: 'Cancel',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_remove_worker.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_worker.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog_remove_worker.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_worker.backdrop,
                        }, [
                            m('.', 'Estas segur que vols eliminar aquest treballador?')
                        ]),
                    ])
                ])
        }
}

export default Member