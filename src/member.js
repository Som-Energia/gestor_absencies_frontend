import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWButton from './mdc/button'
import Snackbar from './mdc/snackbar'


var apibase = process.env.APIBASE;

const Member = {
    oninit: function(vn) {
        vn.state.member_info = {};
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        vn.state.auth = Auth;
        const token = Auth.token;
        vn.state.dialog_remove_worker = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        m.request({
            method: 'GET',
            url: (apibase+'/absencies/workers/' + vn.attrs.memberid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {

            Object.keys(result).map(function(key){
                if (key !== 'id') {
                    vn.state.member_info[key] = result[key];   
                }
            });
            m.redraw();
            console.log('ADMIN? ', vn.state.auth.is_admin);
            vn.state.can_edit = false;
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
                                m(MCWCard, { header: m('h2','Worker') }, [
                                    m(Layout,
                                        m('.personal_info', [
                                                m(Layout.Row,[
                                                    Object.keys(vn.state.member_info).map(function(key) {
                                                        return m(Layout.Cell, {span:6}, [
                                                                m(MCWTextField, {
                                                                    label: key,
                                                                    value: vn.state.member_info[key],
                                                                    outlined: true,
                                                                    disabled: ( key === 'holidays' ?
                                                                        !(vn.state.auth.is_admin && vn.state.can_edit)
                                                                        :
                                                                        !vn.state.can_edit
                                                                    ),
                                                                    oninput: function (e){
                                                                        vn.state.member_info[key] = e.target.value;
                                                                    },
                                                                })]
                                                            );
                                                    }),
                                                ])        
                                            ])
                                        ),
                                        vn.state.can_edit ?
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:5}),
                                                m(Layout.Cell, {span:2},
                                                    m(MCWButton, {
                                                        raised: true,
                                                        onclick: function(){
                                                            vn.state.dialog_remove_worker.outer.open();
                                                        }
                                                    }, 'Remove Worker'),
                                                ),
                                                m(Layout.Cell, {span:5})
                                            ) : ''
                                    ]),
                                ),
                            ])
                        ),
                        m(MWCFab, {
                            value: (!vn.state.can_edit)?'edit':'save',
                            onclick: function() {
                                if (vn.state.can_edit) {
                                    m.request({
                                        method: 'PUT',
                                        url: (apibase+'/absencies/workers/' + vn.attrs.memberid),
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.member_info
                                    }).
                                    then(function(result) {

                                        Object.keys(result).map(function(key){
                                            if (key !== 'id') {
                                                vn.state.member_info[key] = result[key];   
                                            }
                                        });
                                        vn.state.snackbar.close();
                                        m.redraw();
                                    }).
                                    catch(function(error){
                                        vn.state.snackbar_message = error.message;
                                        vn.state.snackbar.open();
                                        console.log(error);
                                    });
                                }
                                vn.state.can_edit = !vn.state.can_edit;
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
                                        url: (apibase+'/absencies/workers/' + vn.attrs.memberid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        vn.state.snackbar.close();
                                        m.route.set('/et');
                                    }).
                                    catch(function(error){
                                        vn.state.snackbar_message = error.message;
                                        vn.state.snackbar.open();
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
                        m(Snackbar, {
                            model: vn.state.snackbar,
                            dismiss: true
                        }, vn.state.snackbar_message),
                    ])
                ])
        }
}

export default Member