import m from 'mithril';
import "@material/button/dist/mdc.button.css"
import "@material/ripple/dist/mdc.ripple.css"

const MCWButton = {
    oninit: function(vn){
        if (vn.attrs.name) {
            vn.state.name = vn.attrs.name;
        }
        else {
            vn.state.name = 'Button';
        }
    },
    view: (vn) =>
        m('button.mdc-button' +
            (vn.attrs.shaped ? '.mdc-button-shape-' + vn.attrs.radius : ''), 
            vn.attrs, [
            m('span.mdc-button__label', vn.state.name),
        ])
};

export default MCWButton