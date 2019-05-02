import m from 'mithril';
import "@material/card/dist/mdc.card.css"
import MCWButton from './button'

const MCWCard = {
    view: (vn) =>
        m('.mdc-card', vn.children)
}

export default MCWCard