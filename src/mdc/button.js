import m from 'mithril';
import "@material/button/dist/mdc.button.css"
import "@material/ripple/dist/mdc.ripple.css"

/** @module */

/**
@namespace Button
@description
A Mithril component wrapping a Material Design Button.
It can be used as a regular HTML `<button>` but it adds
severall attributes to control the look and feel.
![Different styles for button](../docs/shots/mdc-button.png)
@property {bool} raised   Shows the button in raised style
@property {bool} unelevated  Shows the button in unelevated style
@property {bool} outlined  Shows the button in outlined style
@property {bool} dense  Shows the inner letters in dense mode
@property {string} icon  Name for a leading icon of the Material Design collection
@property {string} faicon  Name for a leading icon of the font-awesome collection
@property {string} trailingicon  Name for a trailing icon of the Material Design collection
@property {string} trailingfaicon  Name for a trailing icon of the font-awesome collection
@property - Any other attribute is propagated to the button subelement.
  Interesting ones are `onclick`, `disabled`, `style`...
@property {text/vnode} children Any component children are taken as the content of the button
*/
const MCWButton = {

    view: function(vn) {
        var attrs = vn.attrs;   
        return  m('button'+
            '.mdc-button'+
            (vn.attrs.raised ? '.mdc-button--raised' : '')+
            (vn.attrs.unelevated ? '.mdc-button--unelevated' : '')+
            (vn.attrs.outlined ? '.mdc-button--outlined' : '')+
            (vn.attrs.dense ? '.mdc-button--dense' : '')+
            '', attrs, [
            (vn.attrs.icon ? m('i.mdc-button__icon.material-icons', {'aria-hidden':'true'}, vn.attrs.icon):''),
            (vn.attrs.faicon ? m('i.mdc-button__icon.fa.fa-'+vn.attrs.faicon, {'aria-hidden':'true'}):''),
            m('.mdc-button__label', vn.children),
            (vn.attrs.trailingicon ? m('span.mdc-button__icon.material-icons', {'aria-hidden':'true'}, vn.attrs.trailingicon):''),
            (vn.attrs.trailingfaicon ? m('i.mdc-button__icon.fa.fa-'+vn.attrs.trailingfaicon, {'aria-hidden':'true'}):''),
        ]);
    },
};

export default MCWButton