import m from 'mithril';
import "@material/button/dist/mdc.button.css"
import "@material/ripple/dist/mdc.ripple.css"

function pop(o,k) { var r=o[k]; if (r!==undefined) { delete o[k];} return r; }

const MCWButton = {
    view: (vn) =>
        m('button.mdc-button' +
            (vn.attrs.shaped ? '.mdc-button-shape-' + vn.attrs.radius : ''), 
            vn.attrs,
            [
                (vn.attrs.icon ?
                    m('i.material-icons mdc-button__icon', vn.attrs.icon)
                :
                    ''),
                (vn.attrs.name ?
                    m('span.mdc-button__label', vn.attrs.name)
                :
                    '')
            ]
        )
};

export default MCWButton