import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'
import Dialog from './mdc/dialog'
import MCWButton from './mdc/button'


const VacationPolicy = {
    oninit: function(vn) {
        vn.state.vacationpolicy_info = {};
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        vn.state.dialog_remove_vacationpolicy = {
            backdrop: true,
            outer: {},
            inner: {},
        };

        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/vacationpolicy/' + vn.attrs.vacationpolicyid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {

            Object.keys(result).map(function(key){
                if (key !== 'id') {
                    vn.state.vacationpolicy_info[key] = result[key];   
                }
            });
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
                                        m('h2', 'Dades de la Politica de Vacances'),
                                            m(Layout,
                                                m(Layout.Row,
                                                    m(Layout.Cell, {span:8},
                                                        m('.vacationpolicy_info', [
                                                            Object.keys(vn.state.vacationpolicy_info).map(function(key){
                                                                return m(Layout,
                                                                        m(Layout.Row,
                                                                            m(Layout.Cell, {span:12},
                                                                                m(MCWTextField, {
                                                                                    label: key,
                                                                                    value: vn.state.vacationpolicy_info[key],
                                                                                    disabled : vn.state.can_edit,
                                                                                    oninput: function (e){
                                                                                        vn.state.vacationpolicy_info[key] = e.target.value;
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
                                                                name: 'Remove VacationPolicy',
                                                                onclick: function(){
                                                                    vn.state.dialog_remove_vacationpolicy.outer.open();
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
                                        url: ('http://localhost:8000/absencies/vacationpolicy/' + vn.attrs.vacationpolicyid),
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.vacationpolicy_info
                                    }).
                                    then(function(result) {
                                        Object.keys(result).map(function(key){
                                            if (key !== 'id') {
                                                vn.state.vacationpolicy_info[key] = result[key];   
                                            }
                                        });
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
                            id: 'remove_vacationpolicy',
                            header: 'Remove VacationPolicy',
                            model: vn.state.dialog_remove_vacationpolicy.outer,
                            content: 'Estas segur?',
                            buttons: [{
                                text: 'Eliminar la VacationPolicy',
                                onclick: function(){
                                    m.request({
                                        method: 'DELETE',
                                        url: ('http://localhost:8000/absencies/vacationpolicy/' + vn.attrs.vacationpolicyid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        console.log('VacationPolicy removed!');
                                        m.route.set('/somenergia');
                                    }).
                                    catch(function(error){
                                        console.log(error);
                                    });
                                    vn.state.dialog_remove_vacationpolicy.outer.close();
                                }
                            },{
                                text: 'Cancel',
                                onclick: function(){
                                    console.log('cancel dialog');
                                    vn.state.dialog_remove_vacationpolicy.outer.close();
                                }
                            }],
                            onaccept: function(ev) {
                                ev.cancelBubble = true;
                                vn.state.dialog_remove_vacationpolicy.innerexit = 'Accepted';
                                m.redraw();
                            },
                            onclose: function(ev) {
                                vn.state.self.dialog_remove_vacationpolicy.innerexit = 'Rejected';
                                m.redraw();
                            },
                            backdrop: vn.state.dialog_remove_vacationpolicy.backdrop,
                        }, [
                            m('.', 'Estas segur que vols eliminar aquesta politica de vacances?')
                        ]),
                    ])
        ])
    }
}

export default VacationPolicy