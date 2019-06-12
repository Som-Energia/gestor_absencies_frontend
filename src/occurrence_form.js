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
import Snackbar from './mdc/snackbar'
import get_objects from './iterate_request'

var apibase = process.env.APIBASE;

const OccurrenceForm = {
    oninit: async function(vn){
        vn.state.worker = {};
        vn.state.elements_list = [];
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        vn.state.absence_info = {};
        vn.state.absence_info['start_morning'] = true;
        vn.state.absence_info['start_afternoon'] = true;
        vn.state.absence_info['end_morning'] = true;
        vn.state.absence_info['end_afternoon'] = true;
        vn.state.absence_info['worker'] = Auth.user_id;
        const token = Auth.token;

        var url = apibase+'/absencies/absencetype';

        var headers = {'Authorization': token}

        vn.state.absencetype_result = await get_objects(url, headers);

        vn.state.elements_list = vn.state.absencetype_result.map(function(e){
            return {'value': e.id, 'text': e.name};
        })
        vn.state.absence_info['absence_type'] = vn.state.elements_list.length > 0 ? vn.state.elements_list[0] : '';

        console.log('ABSENCE TYPE ', vn.state.elements_list);
    },
    view: function(vn) {
        return (Auth.token === false) ?
            m('', '')
            :
            m('.occurrence_form', [
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
                                                outlined: true,
                                                future: moment().add(20,'years'),
                                                past: moment(),
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
                                                outlined: true,
                                                future: moment().add(20,'years'),
                                                past: moment(),
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
                                                outlined: true,
                                                value: vn.state.absence_info['absence_type'],
                                                label: 'Tipus d\'Absència',
                                                options: vn.state.elements_list,
                                                onchange: function(ev){
                                                    vn.state.absence_info['absence_type'] = parseInt(ev.target.value);
                                                }
                                            })
                                        )
                                    )
                                ),
                                m(MCWButton, {
                                    raised: true,
                                    onclick: function(){
                                        console.log('Ready to posted ', vn.state.absence_info);

                                        m.request({
                                        method: 'POST',
                                        url: apibase+'/absencies/absences',
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
                                            vn.state.snackbar_message = error.message
                                            vn.state.snackbar.open();
                                        });
                                    },
                                }, 'Create'),
                                m(Snackbar, {
                                    model: vn.state.snackbar,
                                    dismiss: true
                                }, vn.state.snackbar_message),
                            )
                        )
                    ])
                )
        ]);
    }
}

export default OccurrenceForm