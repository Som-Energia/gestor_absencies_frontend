import m from 'mithril';
import { MDCList } from '@material/list'
import '@material/list/dist/mdc.list.css'

const MCWList = {
    view: (vn) =>
        m('.mdc-list', vn.attrs, [
            m('ul', vn.attrs.elements_list.map(function(e){
                return m('li.mdc-list-item', 
                    !e.link ? 
                        m('div', e.name) 
                    : 
                        m('span.mdc-list-item__text', [
                            m('a',
                                {'href': e.link, oncreate: m.route.link},
                                e.name
                            ),
                            !e.button ?
                                ''
                            :
                                e.button,
                        ])
                );
            })
            ),
            vn.children
        ]
    )
};

export default MCWList