import m from 'mithril';
import { MDCSelect } from '@material/select'
import '@material/select/dist/mdc.select.css'

const MCWSelectmenu = {
    view: (vn) => 
        m('.mdc-select' + (vn.attrs.disabled?'.mdc-select--disabled':'')+
            (vn.attrs.outlined?'.mdc-select--outlined':'')+
            (vn.attrs.boxed?'.mdc-select--box':'') , vn.attrs,
            m('i.mdc-select__dropdown-icon'),
            m('select.mdc-select__native-control',
                (vn.attrs.elements_list) ?
                    vn.attrs.elements_list.map(function(e){
                        return ( vn.attrs.value !== undefined && 
                            e['value'] === vn.attrs.value ?
                                m('option', {
                                    'value': e['value'],
                                    'text': e['text'],
                                    'selected': 'selected'
                                })
                            :
                                ( e['value'] === vn.attrs.default ?
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
                        )
                    })
                :
                    ''
            ),
            m(
                'label.mdc-floating-label .mdc-floating-label--float-above',
                vn.attrs.label
            ),
            m('.mdc-line-ripple')
        )
    
};

export default MCWSelectmenu