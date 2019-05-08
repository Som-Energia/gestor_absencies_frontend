import m from 'mithril';
import Menu from './main'
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MWCFab from './mdc/fab'


const Member = {
    oninit: function(vn) {
        vn.state.member_info = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;

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
        return m('.member', [
                m(Layout,
                    m(Layout.Row, [
                        m(Layout.Cell, {span:2},
                            m(Menu)
                        ),
                        m(Layout.Cell, {span:9},
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
            ],
            )
        }
}

export default Member