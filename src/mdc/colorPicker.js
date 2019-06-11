'use strict';

var m = require('mithril');
var MDCSlider = require('@material/slider').MDCSlider;
require('@material/slider/dist/mdc.slider.css');
var MCWButton = require('./button');


var Slider = {};
Slider.oncreate = function(vn) {
    this.widget = MDCSlider.attachTo(vn.dom);
    this.widget.listen('MDCSlider:change', function(ev) {
        vn.attrs.onchange && vn.attrs.onchange(ev, vn.state.widget.value);
        m.redraw();
    });
    this.widget.listen('MDCSlider:input', function(ev) {
        vn.attrs.oninput && vn.attrs.oninput(ev, vn.state.widget.value);
        m.redraw();
    });
    this.onupdate(vn);
};
Slider.onupdate = function(vn) {
    // external set
    if (this.widget.value!==vn.attrs.value) {
        this.widget.value = vn.attrs.value;
    }
};
Slider.onremove = function(vn) {
    this.widget.destroy();
};

Slider.view = function(vn) {
    return m('.mdc-slider'
        +(vn.attrs.discrete?'.mdc-slider--discrete':'')
        +(vn.attrs.marked?'.mdc-slider--display-markers':'')
        , {
            tabindex: 0,
            role: 'slider',
            'aria-valuemin': vn.attrs.min,
            'aria-valuemax': vn.attrs.max,
            'aria-valuenow': vn.attrs.value,
            'aria-step': vn.attrs.step,
            'data-step': vn.attrs.step,
            'aria-label': "Select Value",
            'aria-disabled': vn.attrs.disabled,
        }, [

        m('.mdc-slider__track-container',[
            m('.mdc-slider__track',
                vn.attrs.color&&{style: {'background-color': vn.attrs.color}}
                ),
            vn.attrs.marked && m('.mdc-slider__track-marker-container'),
        ]),
        m('.mdc-slider__thumb-container', [
            m('.mdc-slider__pin',
                vn.attrs.color&&{style: {'background-color': vn.attrs.color}},
                m('span.mdc-slider__pin-value-marker',
                    vn.attrs.value)),
            m('svg.mdc-slider__thumb[width="21"][height="21"]',
                vn.attrs.color&&{style: {'fill': vn.attrs.color,'stroke': vn.attrs.color}},
                m('circle', {cx:10.5,cy:10.5,r:7.875})
            ),
            m('.mdc-slider__focus-ring')
        ]),
    ]);
};


const ColorPicker = {
    color: '#000000',
    oninit: function(vn) {
        (vn.attrs.color != undefined) ? ColorPicker.color = vn.attrs.color : ''
        vn.state.red = 142;
        vn.state.green = 100;
        vn.state.blue = 32;
    },
    onupdate: function(vn) {
        ColorPicker.color = '#'+('000'+(
            +256*256*vn.state.red
            +256*vn.state.green
            +vn.state.blue
            ).toString(16)).slice(-6);
    },
    view: function(vn) {
        var Layout = require('./layout');
        var color = function() {
            return '#'+('000'+(
                +256*256*vn.state.red
                +256*vn.state.green
                +vn.state.blue
                ).toString(16)).slice(-6)
            ;
        };
        return m(Layout,
            m(Layout.Row, [
                m(Layout.Cell, {span: 9}, [
                    m(Slider, {
                        discrete: true,
                        disabled: vn.attrs.disabled,
                        min:0, max:255, step: 1,
                        value: vn.state.red,
                        color: 'red',
                        oninput: function(ev, value) {
                            vn.state.red = value;
                        },
                    }),
                    m(Slider, {
                        discrete: true,
                        disabled: vn.attrs.disabled,
                        min:0, max:255, step: 1,
                        value: vn.state.green,
                        color: '#00b100',
                        oninput: function(ev, value) {
                            vn.state.green = value;
                        },
                    }),
                    m(Slider, {
                        discrete: true,
                        disabled: vn.attrs.disabled,
                        min:0, max:255, step: 1,
                        value: vn.state.blue,
                        color: 'blue',
                        oninput: function(ev, value) {
                            vn.state.blue = value;
                        },
                    }),
                ]),
                m(Layout.Cell, {span: 3}, [
                    m('.mdc-typography--headline5', { style: {
                        'background-color': ColorPicker.color,
                        width: '100%',
                        height: '100%',
                        'text-align': 'center',
                        color: (
                            (vn.state.red*299)+
                            (vn.state.green*587)+
                            (vn.state.blue*114))
                            /1000>=128?'black':'white',
                    }}, ColorPicker.color),
                ]),
                vn.attrs.button != undefined ? 
                    vn.attrs.button
                :
                    ''
            ]),
        );
    },
}

module.exports = ColorPicker