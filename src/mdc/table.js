import m from 'mithril';
import moment from 'moment';

function range(start, stop) {
    var result = [];
    result.push('');
    for (var i = start; i <= stop; i++) {
        result.push(i);
    }
    return result;
};

const Table = {
    oninit: function(vn) {
        vn.state.days = range(
            1,
            moment(vn.attrs.date).endOf('month').format('D')
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
        }
        else {
            vn.state.absences = [];
        }
        console.log(
            'PREPARAT PER PINTAR ',
            vn.state.absences
        );
    },
    view: (vn) =>
        m('table', { class: vn.attrs.class },
            m('tr',
                vn.state.days.map(function(e){
                    return ( vn.attrs.today == e  ?
                        m('th', {class: 'today'} , e)
                    :
                        m('th', e)
                    )
                })
            ),
            vn.state.absences.map(function(e) {
                return [ m('tr.worker-item',
                    m('td.worker', e['name']),
                    e['mornings'].map(function(element, index) {
                        return m('td', ( vn.attrs.today-1 == index ? {class: 'today'} : '' ),
                            m('table.tbl-worker-item',
                                m('tr',
                                    m('td', {
                                        class: 'absence-type absence-type-' + element.id,
                                        title: 'Mati ' + vn.state.days[index+1] + ' ' + ( element.name !== undefined ? element.name : '' )
                                    }, m.trust('&nbsp;'))
                                ),
                                m('tr',
                                    m('td', {
                                        class: 'absence-type absence-type-' + e['afternoon'][index].id,
                                        title: 'Tarda ' + vn.state.days[index+1] + ' ' + ( /*e['afternoon'][index] !== undefined && */e['afternoon'][index].name !== undefined ? e['afternoon'][index].name : '' )
                                    }, m.trust('&nbsp;'))
                                )
                            )
                        )
                    })
                )]
            }),
        )
};

export default Table