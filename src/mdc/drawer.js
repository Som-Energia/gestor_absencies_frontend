import m from 'mithril';
import { MDCDrawer } from '@material/drawer'
import '@material/drawer/dist/mdc.drawer.css'
import '@material/list/dist/mdc.list.css'
import cuca from '../cuca.svg'

const MCWDrawer = {
    view: (vn) =>
        m('aside.mdc-drawer',
            m('.mdc-drawer__header', [ 
                m('img', { src : cuca, class: 'cuca' }),
                ( vn.attrs.title !== undefined ? m('h3', vn.attrs.title) : '' )
            ]),
            m('.mdc-drawer__content',    
                m('nav.mdc-list', vn.attrs.elements_list.map(function(e){
                        return m('a.mdc-list-item',
                            {
                                'href': e.link,
                                oncreate: m.route.link,
                                class: ( m.route.get() === e.link ? 'mdc-list-item--selected':'' )
                            },
                            m('span.mdc-list-item__text',
                                e.name
                            )
                        );
                    })
                )
            )
        )
};

export default MCWDrawer