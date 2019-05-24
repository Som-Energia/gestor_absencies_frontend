'use strict';

import m from 'mithril';
import { MDCSelect } from '@material/select'
import '@material/select/dist/mdc.select.css'

/** @module */

/**
Mithril component wrapping an MDC Select input field.
Input field that unfolds in a set of options you can choose.
@namespace
@property {string} id  (it won't work if you don't provide one)
@property {string} label  Text to be shown as label of the input
@property {string} help  Helper text to be shown in the bottom of the control
@property {string} icon  Material icon identifier for a trailing icon (Not implemented yet by MDC4W)
@property {string} faicon  Font Awesome icon identifier for a trailing icon (Not implemented yet by MDC4W)
@property {string} leadingicon  Material icon identifier for a leading icon
@property {string} leadingfaicon  Font Awesome icon identifier for a leading icon
@property {function} iconaction  Turns de trailing icon into an action icon executing the function on click (Not implemented yet by MDC4W)
@property {function} leadingiconaction  Turns de leading icon into an action icon executing the function on click
@property {bool} required  Makes the field madatory
@property {bool} disabled  Disables the input
@property {bool} boxed  Activates the boxed style
@property {bool} outlined  Activates the outlined style
@property {bool} nohelp  Does not allocate the space for the helper text when it is empty
@property {string} value  The currently selected value
@property {function} onchange  A callback to be called when the user changes the value
@property {function} oninvalid  A callback to be called when the chosen value is invalid
@property {Object[]} options  A list of objects defining the options
@property {string} options.text  The text to be shown for the option
@property {string} options.value  The value taken by this option
@property {bool} options.disabled  Disables the option to be selected
@property {Object[]} options.group  A list of objects defining suboptions
*/
var MCWSelectmenu = {
    oncreate: function(vn) {
        var mdcselect = this.native = vn.dom.querySelector('.mdc-select');
        //this.mdcinstance = new MDCSelect.MDCSelect(mdcselect);
    },
    view: function(vn) {
        function floats() {
            if (vn.attrs.value!==undefined && vn.attrs.value!=="") return true;
            if (!vn.dom) return false;
            if (!vn.state.native) return false;
            if (!vn.state.native===document.activeElement) return true;
            if (!vn.state.native.value) return true;
            return false;
        }
        var attrs = Object.assign({}, vn.attrs);
        function pop(o,k) { var r=o[k]; if (r!==undefined) { delete o[k];} return r; }
        const options = vn.attrs.options || [];
        const floating = floats()
        const boxed = pop(attrs, 'boxed');
        const outlined = pop(attrs, 'outlined');
        const help = pop(attrs, 'help');
        const icon = pop(attrs, 'icon');
        const faicon = pop(attrs, 'faicon');
        const iconaction = pop(attrs, 'iconaction');
        const leadingicon = pop(attrs, 'leadingicon');
        const leadingfaicon = pop(attrs, 'leadingfaicon');
        const leadingiconaction = pop(attrs, 'leadingiconaction');
        const help_id = vn.attrs.id+'_help';
        return m('', [
            m('.mdc-select'+
                (vn.attrs.disabled?'.mdc-select--disabled':'')+
                (outlined?'.mdc-select--outlined':'')+
                (boxed?'.mdc-select--box':'')+
                (leadingicon?'.mdc-select--with-leading-icon':'')+
                (icon?'.mdc-select--with-trailing-icon':'')+
                '', {
                style: {width: '100%'},
                },[
                leadingicon &&
                    m('i.mdc-select__icon.material-icons',
                        leadingiconaction && {
                            tabindex: 0,
                            role: 'button',
                            onclick: leadingiconaction,
                        },
                        leadingicon),
                leadingfaicon &&
                    m('i.mdc-select__icon.fa.fa-'+leadingfaicon,
                        leadingiconaction && {
                            tabindex: 0,
                            role: 'button',
                            onclick: leadingiconaction,
                        }),
                m('i.mdc-select__dropdown-icon'),
                m('select'+
                '.mdc-select__native-control'+
                '', {
                    id: vn.attrs.id,
                    required: vn.attrs.required, // TODO: current MDC version does not work yet
                    disabled: vn.attrs.disabled,
                    'aria-controls': help_id,
                    'aria-describedby': help_id,
                    value: vn.attrs.value,
                    onchange: function(ev) {
                        vn.attrs.value = ev.target.value;
                        vn.attrs.onchange && vn.attrs.onchange(ev);
                    },
                    oninvalid: function(ev) {
                        vn.attrs.oninvalid && vn.attrs.oninvalid(ev);
                    },
                }, 
                    options.map(function (v,i) {
                        if (v.group) {
                            return m('optgroup', Object.assign({label: v.text}, v),
                                v.group.map(function(v,i) {
                                    return m('option', Object.assign({},v), v.text);
                                }));
                        }
                        return m('option', Object.assign({},v), v.text);
                    })
                ),
                (vn.attrs.outlined?[]:m('label'
                    +'.mdc-floating-label'
                    +(floating?'.mdc-floating-label--float-above':''),
                    vn.attrs.label)),
                vn.attrs.icon &&
                    m('i.mdc-select__icon.material-icons',
                        vn.attrs.iconaction && {
                            tabindex: 0,
                            role: 'button',
                            onclick: vn.attrs.iconaction,
                        },
                        vn.attrs.icon),
                vn.attrs.faicon &&
                    m('i.mdc-select__icon.fa.fa-'+vn.attrs.faicon,
                        vn.attrs.iconaction && {
                            tabindex: 0,
                            role: 'button',
                            onclick: vn.attrs.iconaction,
                        }),
                (vn.attrs.outlined? []: m('.mdc-line-ripple')),
                (vn.attrs.outlined?
                    m('.mdc-notched-outline' +(floating?'.mdc-notched-outline--notched':''), [
                        m('.mdc-notched-outline__leading'),
                        m('.mdc-notched-outline__notch',
                            m('label.mdc-floating-label'
                                +(floating?'.mdc-floating-label--float-above':''),
                                vn.attrs.label)),
                        m('.mdc-notched-outline__trailing')
                    ]):''),
                /* Old version
                vn.attrs.outlined && m('.mdc-notched-outline'
                    +(floating?'.mdc-notched-outline--notched':''),
                    m('svg', m('path.mdc-notched-outline__path'))),
                vn.attrs.outlined && m('.mdc-notched-outline__idle'),
                */
            ]),
            vn.attrs.nohelp === true ? []:
            m('.mdc-text-field-helper-text'+
                '.mdc-text-field-helper-text--persistent'+
                '.mdc-text-field-helper-text--validation-msg'+
                '', {
                'aria-hidden': true,
                id: help_id,
                },
                vn.attrs.help
            ),
        ])
    },
};

export default MCWSelectmenu