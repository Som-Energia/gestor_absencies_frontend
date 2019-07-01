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
                m('.mdc-checkbox__background', [
                    m('svg.mdc-checkbox__checkmark', {
                        viewBox: '0 0 24 24',
                    }, [
                        m('path.mdc-checkbox__checkmark-path', {
                            fill: 'none',
                            d: 'M1.73,12.91 8.1,19.28 22.79,4.59',
                        }),
                    ]),
                ])            ),
            m('label', {'for': vn.attrs.id}, vn.attrs.label)
        )
};

export default MCWCheckbox