import m from 'mithril';
import '@material/fab/dist/mdc.fab.css';

const MCWFab = {
    view: (vn) =>
        m('button.mdc-fab',vn.attrs , [
            m('span.material-icons mdc-fab__icon', vn.attrs.value),
        ])
};

export default MCWFab