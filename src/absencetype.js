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
import ColorPicker from './mdc/colorPicker'


var apibase = process.env.APIBASE;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } : null;
};

const AbsenceType = {
    oninit: function(vn) {
        vn.state.absence_info = {};
        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }
        vn.state.dialog_edit_color = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.auth = Auth;
        const token = Auth.token;
        vn.state.dialog_remove_absencetype = {
            backdrop: true,
            outer: {},
            inner: {},
        };
        vn.state.snackbar = {};
        vn.state.snackbar_message = '';
        m.request({
            method: 'GET',
            url: (apibase+'/absencies/absencetype/' + vn.attrs.absenceid),
            headers: {
                'Authorization': token
            }
        }).
        then(function(result) {

            Object.keys(result).map(function(key){
                if (key !== 'id') {
                    vn.state.absence_info[key] = result[key];   
                }
            });
            ColorPicker.color = vn.state.absence_info['color'];
            vn.state.color = hexToRgb(ColorPicker.color);
            m.redraw();
            vn.state.can_edit = true; // TODO: Check user permission
        }).
        catch(function(error){
            console.log(error);
        });
    },
    view: function(vn) {
        return (Auth.token === false) ?
            m('', '')
            :
            m('.vacationpolicy.drawer-frame-root', [
                m(Menu),
                    m('.drawer-main-content', [
                        m(Layout,
                            m(Layout.Row, [
                                m(Layout.Cell, {span:11},
                                    m(MCWCard, { header: m('h2','Absence Type') }, [
                                        m(Layout,
                                            m('.absence_info', [
                                                m(Layout.Row, [
                                                    Object.keys(vn.state.absence_info).map(function(key){
                                                        return m(Layout.Cell, {span:6},
                                                            (key != 'color') ?
                                                                m(MCWTextField, {
                                                                    label: key,
                                                                    outlined: true,
                                                                    value: vn.state.absence_info[key],
                                                                    disabled : vn.state.can_edit,
                                                                    oninput: function (e){
                                                                        vn.state.absence_info[key] = e.target.value;
                                                                    },
                                                                })
                                                            :
                                                                vn.state.can_edit ?
                                                                    m(Layout,
                                                                        m(Layout.Row, [
                                                                            m(Layout.Cell, {span: 12}, [
                                                                                m('.mdc-typography--headline5', { style: {
                                                                                    'background-color': vn.state.absence_info[key],
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    color: vn.state.absence_info[key],
                                                                                }}, vn.state.absence_info[key]),
                                                                            ])
                                                                        ])
                                                                    )
                                                                :
                                                                    m(ColorPicker, {
                                                                        color: vn.state.absence_info[key],
                                                                        red: hexToRgb(ColorPicker.color)['red'],
                                                                        green: hexToRgb(ColorPicker.color)['green'],
                                                                        blue: hexToRgb(ColorPicker.color)['blue'],
                                                                    })
                                                        )
                                                    })
                                                ])
                                            ])
                                        ),
                                        !vn.state.can_edit ?
                                            m(Layout.Row,
                                                m(Layout.Cell, {span:5}),
                                                m(Layout.Cell, {span:2},
                                                    m(MCWButton, {
                                                        raised: true,
                                                        onclick: function(){
                                                            vn.state.dialog_remove_absencetype.outer.open();
                                                        }
                                                    },'remove AbsenceType'),
                                                ),
                                                m(Layout.Cell, {span:5})
                                            )
                                        : ''
                                    ]),
                                ),
                            ])
                        ),
                        ( vn.state.auth.is_admin ? 
                            m(MWCFab, {
                                value: (vn.state.can_edit)?'edit':'save',
                                onclick: function() {
                                    if (vn.state.can_edit === false) {
                                        vn.state.absence_info['color'] = ColorPicker.color;
                                        // Es pot enviat el metode put!
                                        m.request({
                                            method: 'PUT',
                                            url: (apibase+'/absencies/absencetype/' + vn.attrs.absenceid),
                                            headers: {
                                                'Authorization': Auth.token,
                                                'Content-type': 'application/json',
                                            },
                                            data: vn.state.absence_info
                                        }).
                                        then(function(result) {
                                            Object.keys(result).map(function(key){
                                                if (key !== 'id') {
                                                    vn.state.absence_info[key] = result[key];   
                                                }
                                            });
                                            vn.state.snackbar.close();
                                            m.redraw();
                                            vn.state.can_edit = true;
                                        }).
                                        catch(function(error){
                                            vn.state.snackbar_message = error.message;
                                            vn.state.snackbar.open();
                                            console.log(error);
                                        });
                                    }
                                    vn.state.can_edit = !vn.state.can_edit;
                                    m.redraw();
                                }
                            })
                        :
                            ''
                        ),
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
                                        url: (apibase+'/absencies/absencetype/' + vn.attrs.absenceid),
                                        headers: {
                                            'Authorization': Auth.token
                                        }
                                    }).
                                    then(function(result) {
                                        vn.state.snackbar.close();
                                        m.route.set('/somenergia');
                                    }).
                                    catch(function(error){
                                        vn.state.snackbar_message = error.message;
                                        vn.state.snackbar.open();
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
                        m(Snackbar, {
                            model: vn.state.snackbar,
                            dismiss: true
                        }, vn.state.snackbar_message),
                    ])
        ])
    }
}

export default AbsenceType