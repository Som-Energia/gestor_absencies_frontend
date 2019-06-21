'use strict';
import m from 'mithril';
import moment from 'moment';
require('@material/typography/dist/mdc.typography.css').default;
import Auth from './models/auth'
import MCWTextField from './mdc/textfield'
import MCWButton from './mdc/button'
import MCWCard from './mdc/card'
import Layout from './mdc/layout'
import MCWList from './mdc/list'
import MCWDrawer from './mdc/drawer'
import MWCFab from './mdc/fab'
import MWCSnackbar from './mdc/snackbar'
import MCWSelectmenu from './mdc/selectmenu'
import MCWCheckbox from './mdc/checkbox'
import MCWMenuSurface from './mdc/menu-surface'
import Table from './mdc/table'
import DatePicker from './mdc/datepicker'
import './style.styl';
import Login from './login'
import ET from './et'
import Team from './team'
import Member from './member'
import SomEnergia from './somenergia'
import AbsenceType from './absencetype'
import VacationPolicy from './vacationpolicy'
import WorkerForm from './worker_form'
import VacationPolicyForm from './vacationpolicy_form'
import OccurrenceForm from './occurrence_form'
import TeamForm from './team_form'
import AbsenceTypeForm from './absencetype_form'
import Calendar from './calendar'
import Absences from './absences'
import GlobalDateForm from './globaldate_form'

const Menu = {
    oninit: function(vn){

        moment.locale('ca');

        if(Auth.token === false){
            m.route.set('/login');
            return false;
        }

        vn.state.options = [
            { 'name': 'El meu perfil', 'link': '/member/' + (Auth.user_id !== undefined ? Auth.user_id : '') },
            { 'name': 'Absències', 'link': '/absences' },
            { 'name': 'Calendari', 'link': '/calendar' },
            { 'name': 'E.T', 'link': '/et' },
            { 'name': 'Som Energia', 'link': '/somenergia' },
            { 'name': 'Logout', 'link': '/login' },
            //{ 'name': 'Options', 'component': m(MCWMenuSurface) },
        ];
    },
    view: function(vn) {
        return m('.menu', [
                m(MCWDrawer, {elements_list: vn.state.options, title: 'Gestor d\'Absències'}),
            ])
    }
}

m.route(document.getElementById('app'), "/login", {
    "/login": Login,
    "/member/:memberid": Member,
    '/et': ET,
    "/team/:teamid": Team,
    '/absences': Absences,
    '/calendar': Calendar,
    '/somenergia': SomEnergia,
    '/absencetype/:absenceid': AbsenceType,
    '/vacationpolicy/:vacationpolicyid': VacationPolicy,
    '/worker_form': WorkerForm,
    '/team_form': TeamForm,
    '/vacationpolicy_form': VacationPolicyForm,
    '/absencetype_form': AbsenceTypeForm,
    '/occurrence/form': OccurrenceForm,
    '/globaldate/form': GlobalDateForm
});

export default Menu