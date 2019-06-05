var m = require('mithril');
require('@material/checkbox/dist/mdc.checkbox.css');
require('@material/form-field/dist/mdc.form-field.css');
var MDCCheckbox = require('@material/checkbox').MDCCheckbox;
var MDCFormField = require('@material/form-field').MDCFormField;


const MCWCheckbox = {
    view: (vn) =>
        m('.mdc-form-field', 
            m('.mdc-checkbox',
                m('input[type=checkbox].mdc-checkbox__native-control', vn.attrs),
                m('.mdc-checkbox__background',
                    m('svg.mdc-checkbox__checkmark',
                        
                    )
                )
            ),
            m('label', {'for': vn.attrs.id}, vn.attrs.label)
        )
};

export default MCWCheckbox