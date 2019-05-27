import m from 'mithril';
import Auth from './models/auth'
import Layout from './mdc/layout'
import MCWCard from './mdc/card'
import MCWTextField from './mdc/textfield'
import MCWSelectmenu from './mdc/selectmenu'
import MCWButton from './mdc/button'


var apibase = process.env.APIBASE;

const TeamForm = {
    oninit: function(vn){
        vn.state.team = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
    },
    view: function(vn) {
        return m('.team_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació de Team'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWTextField, {
                                                label : "Name",
                                                outlined: true,
                                                onblur: function (e){
                                                    vn.state.team['name'] = e.target.value
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: function(){
                                        m.request({
                                        method: 'POST',
                                        url: apibase+'/absencies/teams',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.team
                                        }).
                                        then(function(result) {
                                            console.log('Team created');
                                            m.route.set('/et');
                                        }).
                                        catch(function(error){
                                        console.log(error);
                                        });
                                    },
                                }, 'Create'),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default TeamForm