import m from 'mithril';
import "@material/card/dist/mdc.card.css"
import MCWButton from './button'

const MCWCard = {
    view: (vn) =>
        m('.mdc-card', [
            ( vn.attrs.header !== undefined ? m('.mdc-card__header', vn.attrs.header) : ''),
            m('.mdc-card__content', vn.children)
        ])
}

export default MCWCard