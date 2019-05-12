'use strict';
import m from 'mithril';
import moment from 'moment';
require('@material/typography/dist/mdc.typography.css').default;
import Auth from './models/auth'
import MCWTextField from './mdc/textfield'
import MCWButton from './mdc/button'
import MCWCard from './mdc/card'
import Layout from './mdc/layout'
import MCWCheckbox from './mdc/checkbox'
import DatePicker from './mdc/datepicker'
import MCWSelectmenu from './mdc/selectmenu'




const OccurrenceForm = {
    oninit: function(vn){
        vn.state.worker = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        const token = Auth.token;
        m.request({
            method: 'GET',
            url: 'http://localhost:8000/absencies/absencetype',
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {
            vn.state.elements_list = result.results.map(function(e){
                return {'value': e.id, 'text': e.name};
            })
            console.log('ABSENCE TYPE ', vn.state.elements_list);
        }).
        catch(function(error){
            console.log(error);
        });
        vn.state.absence_info = {};
        vn.state.absence_info['start_morning'] = true;
        vn.state.absence_info['start_afternoon'] = true;
        vn.state.absence_info['end_morning'] = true;
        vn.state.absence_info['end_afternoon'] = true;
    	vn.state.absence_info['worker'] = Auth.user_id;
    },
    view: function(vn) {
        return m('.worker_form', [
                m(Layout,
                    m(Layout.Row, {align: 'center'}, [
                        m(Layout.Cell,  {span:4}),
                        m(Layout.Cell,  {span:4}, 
                            m(MCWCard,
                                m('h1', 'Formulari de creació d\'Absència'),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                           m(DatePicker, 
                                                {id: 'start_date',
                                                label: 'Start',
                                                help: 'First day that will be included',
                                                value: undefined,
                                                future: moment().add(20,'years'),
                                                onchange: function(newvalue) {
                                                    console.log("changin from ", newvalue.format("YYYY-MM-DD HH:mm:ss"));

                                                    //DatePicker.Example.fromdate=newvalue;
                                                    vn.state.absence_info['start_time'] = newvalue.format("YYYY-MM-DD HH:mm:ss");
                                                },
                                                boxed: true,
                                                autoclose: true,}
                                            )
                                       )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(DatePicker, 
                                                {id: 'end_date',
                                                label: 'End',
                                                help: 'Last day that will be included',
                                                value: undefined,
                                                future: moment().add(20,'years'),
                                                onchange: function(newvalue) {
                                                    console.log("changin from ", newvalue.format("YYYY-MM-DD HH:mm:ss"));

                                                    //DatePicker.Example.fromdate=newvalue;
                                                    vn.state.absence_info['end_time'] = newvalue.format("YYYY-MM-DD HH:mm:ss");
                                                },
                                                boxed: true,
                                                autoclose: true,}
                                            )
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWCheckbox, {
                                                'label': 'Start morning',
                                                'checked': (vn.state.absence_info['start_morning'] !== undefined) ?
                                                    vn.state.absence_info['start_morning']
                                                    :
                                                    false,
                                                onchange: function(ev){
                                                    vn.state.absence_info['start_morning'] = ev.target.checked;
                                                    console.log('checkbox onchange ', vn.state.absence_info['start_morning']);
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWCheckbox, {
                                                'label': 'End afternoon',
                                                'checked': (vn.state.absence_info['end_afternoon'] !== undefined) ?
                                                    vn.state.absence_info['end_afternoon']
                                                    :
                                                    false,                                                
                                                onchange: function(ev){
                                                    vn.state.absence_info['end_afternoon'] = ev.target.checked;
                                                    console.log('checkbox onchange ', vn.state.absence_info['end_afternoon']);
                                                },
                                            })
                                        )
                                    )
                                ),
                                m(Layout,
                                    m(Layout.Row,
                                        m(Layout.Cell, {span:12},
                                            m(MCWSelectmenu, {
                                                elements_list: vn.state.elements_list,
                                                onchange: function(ev){
                                                    vn.state.absence_info['absence_type'] = parseInt(ev.target.value);
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    onclick: function(){
                                        console.log('Ready to posted ', vn.state.absence_info);

                                        m.request({
                                        method: 'POST',
                                        url: 'http://localhost:8000/absencies/absences',
                                        headers: {
                                            'Authorization': Auth.token,
                                            'Content-type': 'application/json',
                                        },
                                        data: vn.state.absence_info
                                        }).
                                        then(function(result) {
                                            console.log('Occurrence created');
                                            m.route.set('/absences');
                                        }).
                                        catch(function(error){
                                        console.log(error);
                                        });
                                    },
                                    name: 'Create'
                                }),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default OccurrenceForm