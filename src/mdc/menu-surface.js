import m from 'mithril';
import { MDCMenuSurface } from '@material/menu-surface'
import '@material/menu-surface/dist/mdc.menu-surface.css'


const MCWMenuSurface = {
    view: (vn) =>
        m('.mdc-menu-surface', {open: true}, 'TEXT')
};

export default MCWMenuSurface