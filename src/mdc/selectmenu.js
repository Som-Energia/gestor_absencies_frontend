import m from 'mithril';
import { MDCSelect } from '@material/select'
import  '@material/select/dist/mdc.select.css'

const MCWSelectmenu = {
    view: (vn) =>
        m('.mdc-select' + (vn.attrs.disabled?'.mdc-select--disabled':''), vn.attrs,
            m('i.mdc-select__dropdown-icon'),
            m('select.mdc-select__native-control', 
                //m('option'),
                    vn.attrs.elements_list.map(function(e){
                        return ( e['value'] === vn.attrs.default ?
                            m('option', {
                                'value': e['value'],
                                'text': e['text'],
                                'selected': 'selected'
                            })
                            :
                            m('option', {
                                'value': e['value'],
                                'text': e['text'],
                            })
                        )
                    })
            )
        )
};

export default MCWSelectmenu