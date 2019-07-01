import m from 'mithril';
import moment from 'moment';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWButton from './mdc/button'
import Snackbar from './mdc/snackbar'
import MCWSelectmenu from './mdc/selectmenu'


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
        vn.state.gender_options = [
            {'value': 'Female', 'text': 'Dona'},
            {'value': 'Male', 'text': 'Home'},
            {'value': 'Intersex', 'text': 'Intersex'},
            {'value': 'Trans', 'text': 'Trans'},
            {'value': 'Queer', 'text': 'Queer'},
            {'value': 'Other', 'text': 'Altre'},
        ]
        vn.state.category_options = [
            {'value': 'Technical', 'text': 'Tècnic'},
            {'value': 'Specialist', 'text': 'Especialista'},
            {'value': 'Manager', 'text': 'Gerència'},
        ]
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
                    if (key == 'contract_date') {
                        vn.state.member_info[key] = moment(result[key]).format('YYYY/MM/DD');
                    }
                    else {
                        vn.state.member_info[key] = result[key];
                    }
                }
                else {
                    vn.state.worker_id = result[key];
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
        return (Auth.token === false) ?
            m('', '')
            :
            m('.member.drawer-frame-root', [
                m(Menu),
                    m('.drawer-main-content', [
                        m(Layout,
                            m(Layout.Row, [
                                m(Layout.Cell, {span:11},
                                m(MCWCard, { header: m('h2','Worker') }, [
                                    m(Layout,
                                        m('.personal_info', [
                                                m(Layout.Row,[
                                                    Object.keys(vn.state.member_info).map(function(key) {
                                                        return (key != 'gender' && key != 'category') ?
                                                            m(Layout.Cell, {span:6}, [
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
                                                                })
                                                            ])
                                                        :
                                                            ''
                                                    }),
                                                    m(Layout.Cell, {span:6},
                                                        m(MCWSelectmenu, {
                                                            outlined: true,
                                                            label: 'Gènere',
                                                            id: 'gender',
                                                            value: vn.state.member_info['gender'] != undefined ? vn.state.member_info['gender'] : '',
                                                            options: vn.state.gender_options,
                                                            disabled: !vn.state.can_edit,
                                                            onchange: function(ev){
                                                                vn.state.member_info['gender'] = ev.target.value;
                                                            }
                                                        })
                                                    ),
                                                    m(Layout.Cell, {span:6},
                                                        m(MCWSelectmenu, {
                                                            outlined: true,
                                                            label: 'Categoria',
                                                            id: 'category',
                                                            value: vn.state.member_info['category'] != undefined ? vn.state.member_info['category'] : '',
                                                            options: vn.state.category_options,
                                                            disabled: !vn.state.can_edit,
                                                            onchange: function(ev){
                                                                vn.state.member_info['category'] = ev.target.value;
                                                            }
                                                        })
                                                    ),
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
                        ( vn.state.auth.user_id == vn.state.worker_id || vn.state.auth.is_admin ?
                            m(MWCFab, {
                                value: (!vn.state.can_edit)?'edit':'save',
                                onclick: function() {
                                    if (vn.state.can_edit) {
                                        vn.state.member_info['contract_date'] = moment(vn.state.member_info['contract_date']).format('YYYY-MM-DDThh:mm:ss')
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
                                                    if (key == 'contract_date') {
                                                        vn.state.member_info[key] = moment(result[key]).format('YYYY/MM/DD');
                                                    }
                                                    else {
                                                        vn.state.member_info[key] = result[key];
                                                    }
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
                            })
                        :
                            ''),
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