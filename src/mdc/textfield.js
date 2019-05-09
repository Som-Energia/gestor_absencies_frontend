'use strict';
var m = require('mithril');
var MDCTextField = require('@material/textfield');
require('@material/textfield/dist/mdc.textfield.css');


function applyInputFilter(input, inputfilter, event) {
  var filtered = inputfilter instanceof Function ?
    inputfilter(input.value) :
    (RegExp(inputfilter).test(input.value) && input.value);

  if (filtered!==false) {
    input.value = filtered;
    input.oldValue = filtered;
    input.oldSelectionStart = input.selectionStart;
    input.oldSelectionEnd = input.selectionEnd;
  } else if (input.hasOwnProperty("oldValue")) {
    input.value = input.oldValue;
    input.setSelectionRange(input.oldSelectionStart, input.oldSelectionEnd);
  }
}

function setInputFilter(textbox, inputfilter) {
  [
    //"input", // Let the widget handle that
    "keydown", "keyup",
    "mousedown", "mouseup", "select",
    "contextmenu", "drop"
  ].forEach(function(event) {
    textbox.addEventListener(event, function() {
      applyInputFilter(this, inputfilter);
    });
  });
}


var TextField = {
  oncreate: function(vn) {
    var mdcinput = vn.dom.querySelector('.mdc-text-field');
    this.mdcinstance = new MDCTextField.MDCTextField(mdcinput);
    var errormessage = vn.attrs.errormessage || vn.state.errormessage || '';
    vn.state.mdcinstance.valid = !errormessage;
    vn.state.native = vn.dom.querySelector('.mdc-text-field__input');
    vn.state.native.setCustomValidity(errormessage);

    var inputfilter = vn.attrs.inputfilter;
    if ( inputfilter ) {
      setInputFilter(vn.state.native, inputfilter);
    }
  },

  onupdate: function(vn) {
    var errormessage = vn.attrs.errormessage || vn.state.errormessage || '';
    var valid = !errormessage;
    if (vn.state.mdcinstance.valid !== !errormessage) {
      vn.state.mdcinstance.valid = !errormessage;
    }
    vn.state.native = vn.dom.querySelector('.mdc-text-field__input');
    vn.state.native.setCustomValidity(errormessage);
  },

  view: function (vn) {
    function floats() {
      if (vn.attrs.value!==undefined && vn.attrs.value!=="") return true;
      if (!vn.dom) return false;
      if (!vn.state.native) return false;
      if (!vn.state.native===document.activeElement) return true;
      if (!vn.state.native.value) return true;
      return false;
    }
    var attrs = Object.assign({}, vn.attrs);
    // Remove the custom attributes no to be applied to the native input
    function pop(o,k) { var r=o[k]; if (r!==undefined) { delete o[k];} return r; }
    const floating = floats();
    const fullwidth = pop(attrs, 'fullwidth');
    const boxed = pop(attrs, 'boxed');
    const outlined = pop(attrs, 'outlined');
    const errormessage = pop(attrs, 'errormessage') || vn.state.errormessage;
    const dense = pop(attrs, 'dense');
    const disabled = pop(attrs, 'disabled');
    const help = pop(attrs, 'help');
    const faicon = pop(attrs, 'faicon');
    const trailingicon = pop(attrs, 'trailingicon');
    const iconaction = pop(attrs, 'iconaction');
    const leadingfaicon = pop(attrs, 'leadingfaicon');
    const leadingicon = pop(attrs, 'leadingicon');
    const inputfilter = pop(attrs, 'inputfilter');
    const help_id = vn.attrs.id+'_help';
    const nativeattrs = Object.assign({
      // defaults
      type: 'text',
      placeholder: fullwidth?vn.attrs.label:(undefined),
      'aria-label': fullwidth?vn.attrs.label:undefined,
      'aria-controls': help_id,
      'aria-describedby': help_id,
      'disabled': disabled 
    }, attrs, {
      // redefined
      oninput: function(ev) {
        var value = ev.target.value;
        if(inputfilter !== undefined)
          applyInputFilter(ev.target, inputfilter);
        ev.target.setCustomValidity('');
        if (attrs.oninput) attrs.oninput(ev);
        vn.state.errormessage = ev.target.validationMessage;
      },
    });

    return m('', [
      m(''
        +'.mdc-text-field'
        +(disabled?'.mdc-text-field--disabled':'')
        +(fullwidth?'.mdc-text-field--fullwidth':'')
        +(boxed?'.mdc-text-field--box':'')
        +(outlined?'.mdc-text-field--outlined':'')
        +(faicon||trailingicon?'.mdc-text-field--with-trailing-icon':'')
        +(leadingfaicon||leadingicon?'.mdc-text-field--with-leading-icon':'')
        +(dense?'.mdc-text-field--dense':'')
      ,{
        style: { width: '100%'},
      },[
        (leadingfaicon ? m('i.mdc-text-field__icon.fa.fa-'+leadingfaicon):''),
        (leadingicon ? m('i.mdc-text-field__icon.material-icons',leadingicon):''),
        m('input.mdc-text-field__input', nativeattrs),
        fullwidth || outlined?'':m('label'
          +'.mdc-floating-label'
          +(floating?
            '.mdc-floating-label--float-above':'')
          ,
          {'for': vn.attrs.id}, [
          vn.attrs.label,
        ]),
        (faicon ? m('i.mdc-text-field__icon.fa.fa-'+faicon,
          iconaction && {tabindex:0, role: 'button', onclick:
            function(ev) {
              iconaction(ev);
              ev.cancelBubble = true;
            }})
        :[]),
        (trailingicon ? m('i.mdc-text-field__icon.material-icons',
          iconaction && {tabindex:0, role: 'button', onclick:
            function(ev) {
              iconaction(ev);
              ev.cancelBubble = true;
            }},trailingicon)
        :[]),
        (outlined? []: m('.mdc-line-ripple')),
        (outlined? m('.mdc-notched-outline'
          +(floating?
            '.mdc-notched-outline--notched':''),
          //m('svg', m('path.mdc-notched-outline__path'))):[]),
          m('.mdc-notched-outline__leading'),
          m('.mdc-notched-outline__notch',
            m('label.mdc-floating-label' + (floating?' mdc-floating-label--float-above':''),{'for':vn.attrs.id}, [ vn.attrs.label ])),
          m('.mdc-notched-outline__trailing'),
        ):[]),
        (outlined? m('.mdc-notched-outline__idle'):''),
      ]),
      vn.attrs.nohelp?[]:
      m('.mdc-text-field-helper-text'+
        '.mdc-text-field-helper-text--persistent'+
        (errormessage?'.mdc-text-field-helper-text--validation-msg':'')+
        '', {
        id: help_id,
        'aria-hidden': true,
        },
        errormessage || help || m.trust('&nbsp;')
      ),
    ]);
  },
};



module.exports = TextField
