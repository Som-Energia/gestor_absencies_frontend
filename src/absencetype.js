import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'


const AbsenceType = {
    oninit: function(vn) {
        vn.state.absence_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;

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
        return m('.absencetype', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
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
                                                                            'value': vn.state.absence_info[key],
                                                                            'placeholder': key,
                                                                            'disabled' : vn.state.can_edit ,
                                                                            onblur: function (e){
                                                                                vn.state.absence_info[key] = e.target.value;
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
            ],
            )
        }
}

export default AbsenceType