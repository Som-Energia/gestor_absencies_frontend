import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWButton from './mdc/button'


const AbsenceType = {
    oninit: function(vn) {
        vn.state.absence_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        vn.state.dialog_remove_absencetype = {
            backdrop: true,
            outer: {},
            inner: {},
        };

        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/absencetype/' + vn.attrs.absenceid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.absence_info = result;
            m.redraw();
            vn.state.can_edit = true; // TODO: Check user permission
        }).
        catch(function(error){
            console.log(error);
        });
    },
    view: function(vn) {
        return m('.vacationpolicy.drawer-frame-root', [
                m(Menu),
                    m('.drawer-main-content', [
                        m(Layout,
                            m(Layout.Row, [
                                m(Layout.Cell, {span:12},
                                    m(MCWCard, [
                                        m('h2', 'Dades de l\'absències'),
                                            m(Layout,
                                                m(Layout.Row,
                                                    m(Layout.Cell, {span:8},
                                                        m('.absence_info', [
                                                            Object.keys(vn.state.absence_info).map(function(key){
                                                                return m(Layout,
                                                                        m(Layout.Row,
                                                                            m(Layout.Cell, {span:12},
                                                                                m(MCWTextField, {
                                                                                    label: key,
                                                                                    value: vn.state.absence_info[key],
                                                                                    disabled : vn.state.can_edit,
                                                                                    oninput: function (e){
                                                                                        vn.state.absence_info[key] = e.target.value;
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
                                                                name: 'remove AbsenceType',
                                                                onclick: function(){
                                                                    vn.state.dialog_remove_absencetype.outer.open();
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
                            value: (vn.state.can_edit)?'edit':'save',
                            onclick: function() {
                                if (vn.state.can_edit === false) {
                                    // Es pot enviat el metode put!
                                    m.request({
                                        method: 'PUT',
                                        url: ('http://localhost:8000/absencies/absencetype/' + vn.attrs.absenceid),
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.absence_info
                                    }).
                                    then(function(result) {
                                        vn.state.absence_info = result;
                                        m.redraw();
                                        vn.state.can_edit = true;
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                }
                                vn.state.can_edit = !vn.state.can_edit;
                            }
                        }),
                        m(Dialog, {
                            id: 'remove_absencetype',
                            header: 'Remove AbsenceType',
                            model: vn.state.dialog_remove_absencetype.outer,
                            content: 'Estas segur?',
                            buttons: [{
                                text: 'Eliminar l\'AbsenceType',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: ('http://localhost:8000/absencies/absencetype/' + vn.attrs.absenceid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        console.log('AbsenceType removed!');
                                        m.route.set('/somenergia');
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });    
                                    vn.state.dialog_remove_absencetype.outer.close();
                                }
                            },{
                                text: 'Cancel',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_remove_absencetype.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_absencetype.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog_remove_absencetype.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_absencetype.backdrop,
                        }, [
                            m('.', 'Estas segur que vols eliminar aquest tipus d\'absència?')
                        ]),
                    ])
        ])
    }
}

export default AbsenceType