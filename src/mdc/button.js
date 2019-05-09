import m from 'mithril';
import "@material/button/dist/mdc.button.css"
import "@material/ripple/dist/mdc.ripple.css"

const MCWButton = {
    oninit: function(vn){
        if (vn.attrs.name) {
            vn.state.name = vn.attrs.name;
            vn.state.icon = vn.attrs.icon;
        }
        else {
            vn.state.name = '';
            vn.state.icon = '';
        }
        
    },
    view: (vn) =>
        m('button.mdc-button' +
            (vn.attrs.shaped ? '.mdc-button-shape-' + vn.attrs.radius : ''), 
            vn.attrs, [
            (vn.state.icon !== '' ? 
                (m('i.material-icons mdc-button__icon', vn.state.icon),
                m('span.mdc-button__label', vn.state.name))
            :
                m('span.mdc-button__label', vn.state.name)
            )
            //m('span.mdc-button__label', vn.state.name),
        ])
};

export default MCWButton