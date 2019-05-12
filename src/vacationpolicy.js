import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'


const VacationPolicy = {
    oninit: function(vn) {
        vn.state.vacationpolicy_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;

        m.request({
            method: 'GET',
            url: ('http://localhost:8000/absencies/vacationpolicy/' + vn.attrs.vacationpolicyid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.vacationpolicy_info = result;
            m.redraw();
            vn.state.can_edit = true; // TODO: Check user permission
        }).
        catch(function(error){
            console.log(error);
        });
    },
    view: function(vn) {
        return m('.vacationpolicy', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
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
                                        )
                                    )
                            ]),
                        ),
                                //m(MWCSnackbar),
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
                                vn.state.vacationpolicy_info = result;
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
            ],
            )
        }
}

export default VacationPolicy