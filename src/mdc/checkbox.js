import m from 'mithril';
import '@material/checkbox/dist/mdc.checkbox.css'
import '@material/form-field/dist/mdc.form-field.css'
import { MDCCheckbox } from '@material/checkbox'
import { MDCFormField } from '@material/form-field'

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