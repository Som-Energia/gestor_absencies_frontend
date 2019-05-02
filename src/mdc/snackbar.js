import m from 'mithril';
import { MDCSnackbar } from '@material/snackbar'
import '@material/snackbar/dist/mdc.snackbar.css'

const MCWSnackbar = {
    view: (vn) =>
        m('.mdc-snackbar', vn.attrs,
            m('.mdc-snackbar__surface',
                m('.mdc-snackbar__label',
                    {'role': 'status', 'aria-live': 'polite'}, 'YOLO'
                ), 'YOLA'
            )
        )
}

export default MCWSnackbar