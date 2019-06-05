var m = require('mithril');
require('@material/drawer/dist/mdc.drawer.css');
require('@material/list/dist/mdc.list.css');
var MDCDrawer = require('@material/drawer').MDCDrawer;
var cuca = require('../cuca.svg');


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