import m from 'mithril';
import moment from 'moment';

function range(start, stop) {
    var result = [];
    result.push('Noms');
    for (var i = start; i <= stop; i++) {
        result.push(i);
    }
    return result;
};

const Table = {
    oninit: function(vn) {
        vn.state.days = range(
            1,
            moment().endOf('month').format('D')
        );
        vn.state.absences = [];
    },
    onupdate: function(vn){
        vn.state.days = range(
            1,
            moment(vn.attrs.date).endOf('month').format('D')
        );
        if (vn.attrs.absences !== undefined) {
            vn.state.absences = vn.attrs.absences;
            vn.state.absences.map(function(e) {
                if (e['mornings'] !== undefined && 
                    typeof e['mornings'][0] !== "string") {
                        e['mornings'].unshift(e['name']);
                }
            });
        }
        else {
            vn.state.absences = [];
        }
        console.log(
            'in table ', 
            vn.state.absences,
            ' ',
            vn.attrs.date
        );
    },
    view: (vn) =>
        m('table',
            m(Row, {
                'tr_style': 'th',
                'data': vn.state.days,
            }),
            vn.state.absences.map(function(e) {
                return [ m(Row, {
                    'tr_style': 'td',
                    'rowspan': 2,
                    'data': e['mornings'],
                }), 
                m(Row, {
                    'tr_style': 'td',
                    'data': e['afternoon'],
                })]
            }),
        )
};

const Row = {
    oninit: function(vn) {
        vn.state.data = [];
    },
    onupdate: function(vn) {
        vn.state.data = (vn.attrs.data !== undefined) ? vn.attrs.data : [];
    },
    view: (vn) =>
        m('tr',
            m(vn.attrs.tr_style, {'rowspan': vn.attrs.rowspan}, vn.attrs.data[0]),
            vn.attrs.data.map(function(e, index){
                if (index > 0) {
                    return m(vn.attrs.tr_style, e)
                }
            })
        )
};

export default Table
