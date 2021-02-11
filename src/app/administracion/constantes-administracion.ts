import { CONST_ADMINISTRACION_EQUIPO } from './equipo/equipo.constant';
import { CONST_MENU } from './menu/constantes-menu';
import { CONST_SHARED } from 'src/app/shared/constantes-shared';

export const CONS_ADMINISTRACION = {
    ...CONST_SHARED,
    ...CONST_ADMINISTRACION_EQUIPO,
    ...CONST_MENU,
};
