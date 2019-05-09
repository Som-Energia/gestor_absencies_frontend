import m from 'mithril';
import { MDCDrawer } from '@material/drawer'
import '@material/drawer/dist/mdc.drawer.css'
import '@material/list/dist/mdc.list.css'
//import { MDCList } from './list'


const MCWDrawer = {
    view: (vn) =>
        m('aside.mdc-drawer',
            m('.mdc-drawer__header',  
                ( vn.attrs.title !== undefined ? m('h3', vn.attrs.title) : '' )
            ),
            m('.mdc-drawer__content',    
                m('nav.mdc-list', vn.attrs.elements_list.map(function(e){
                        return m('a.mdc-list-item',
                            {'href': e.link, oncreate: m.route.link},
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