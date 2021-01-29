//DEFINIDAS PARA SER MODIFICADA POR USUARIO FINAL
const SALARIO_MINIMO_GRAL                 = [{ m:213.39, l:'Zona Libre de la Frontera Norte' }, { m:141.70, l:'Resto del país' } ];
const CANT_MESES_MIN_DESVINCULACION       = 2;
const MULT_SALARIO_LIMITADO               = 2;
const CANT_DIAS_POR_ANIO_LEY              = 20;
const CANT_DESP_INJ_DIAS_POR_ANIO_ANT_LEY = 12;
const PREDETERMINADO_DIAS_AGUINALDO       = 15;
const PREDETERMINADO_PRIMA_VACACIONAL     = 25;
const PREDETERMINADO_SELECTOR_ZONA_GEO    = 141.70;

//DEFINIDAS PARA PROGRAMADOR
const ID_BTN_CALCULAR    = '.btn-calcular-finiquito';
const ID_BTN_VOLVER      = '.btn-fini-volver';
const ID_MODAL           = '#finiquitoModal0';
const ID_INPUT_INGRESO   = '#finiIngreso';
const ID_INPUT_EGRESO    = '#finiEgreso';
const ID_INPUT_MOTIVO    = '#finiSelectMotFin';
const ID_INPUT_SALA_DIA  = '#finiSalarioDiario';
const ID_INPUT_D_N_PAY   = '#finiDiasNoPagos';
const ID_INPUT_D_AGUI    = '#finiDiasAguinaldo';
const ID_INPUT_D_VACA    = '#finiDiasVacaciones';
const ID_INPUT_D_VACA_D  = '#finiDiasAdeudadosVaca';
const ID_INPUT_P_VACA    = '#finiPrimaVacacional';
const CLASS_IS_INVALID   = 'is-invalid';
const ID_ROW_RESULTS     = '#row-result-view';
const ID_ROW_NO_RESULTS  = '#row-noresult-view';
const INPUT_INGRESO_MINY = 1900;
const ID_LABEL_TOTAL     = '#finiTotalInd';
const ID_INPUT_ZONA_GEO  = '#finiSelectZonaGeo';

const ID_LABEL_PRIMA_ANTIGUEDAD = '#finiRPAnt';
const ID_LABEL_AGUINALDO_PROP   = '#finiAProp';
const ID_LABEL_VACA_D_P         = '#finiRVA';
const ID_LABEL_VACA_P           = '#finiRVP';
const ID_LABEL_DT_ADEUDA        = '#finiDTAD';
const ID_LABEL_VACA_PR          = '#finiPVA';
const ID_MINIMA_FECHA_E         = '#LMinDateE';
const ID_SELECT_20D             = '#enable20Days';
const ID_REN_VOLUNTARIA         = '.ren-voluntaria';
const ID_DESPIDO_INJUST         = '.res-despido-inj';
const ID_RES_DIAS_P_A_LEY       = '#dias-p-anio-t';

const ID_LABEL_3S     = '#fini3M';
const ID_LABEL_20DPAT = '#fini20DpA';

const FORMATO_FECHA = 'dd/mm/yyyy';

const finiSelectMotFinOptions = [
  { v: 4, d: 'Despido injustificado', calculadora: ()=>{ calculadoraDespidoInjustificado(); } },
  { v: 12, d: 'Renuncia voluntaria', calculadora: ()=>{ calculadoraRenunciaVoluntaria(); } }
];

function showAlert( text, title ){
  $( ID_MODAL + ' .modal-title' ).text( title );
  $( ID_MODAL + ' .modal-body' ).html( '<p>'+ text + '</p>' );

  $( ID_MODAL ).modal( 'show' );
}

function goToResult( params ){
  $('.nav-tabs a[href="#resultado"]').tab('show');
  $( ID_ROW_RESULTS ).show();
  $( ID_ROW_NO_RESULTS ).hide();
}

function getSalarioMinimoGral(){
  return $( ID_INPUT_ZONA_GEO ).val();
}

function calculadoraDespidoInjustificado(){
  let salario_diario          = Number( $( ID_INPUT_SALA_DIA ).val() );
  let dias_vacacion_pago      = Number( $( ID_INPUT_D_VACA ).val() );
  let prima_vacacional_i      = Number( $( ID_INPUT_P_VACA ).val() );
  let dias_trabajados_adeuda  = Number( $( ID_INPUT_D_N_PAY ).val() );
  let dias_vacacion_adeuda    = Number( $( ID_INPUT_D_VACA_D ).val() );
  let dias_aguinaldo          = Number( $( ID_INPUT_D_AGUI ).val() );

  let prima_vacacional_diaria   = ( salario_diario * dias_vacacion_pago ) / 100 * prima_vacacional_i / 365.25;
  let salario_diario_integrado  = ( ( (salario_diario * 15) / 365 ) + salario_diario + prima_vacacional_diaria );
  let salario_mensual_integrado = salario_diario_integrado * 30;
  let indemniza_3_meses         = salario_mensual_integrado * 3;

  let cantidad_anios   = Math.floor( getDiasTrabajados() / 365.25 );
  let indemniza_20_dpa = cantidad_anios * salario_diario_integrado * CANT_DIAS_POR_ANIO_LEY;

  if ( salario_diario_integrado > ( getSalarioMinimoGral() * MULT_SALARIO_LIMITADO) ){
    salario_diario_integrado = getSalarioMinimoGral() * MULT_SALARIO_LIMITADO;
  }

  let prima_antiguedad = cantidad_anios * CANT_DESP_INJ_DIAS_POR_ANIO_ANT_LEY * salario_diario_integrado;

  let proporcional_dias_t_adeudados = dias_trabajados_adeuda * salario_diario_integrado;
  let vacaciones_adeudadas_prop     = dias_vacacion_adeuda * salario_diario_integrado;

  let vacaciones_proporcional       = salario_diario * dias_vacacion_pago;
  let prima_vacacional              = vacaciones_proporcional / 100 * prima_vacacional_i;

  let dias_laborados_anio_corriente = getDiasTrabajadosAnioCorriente();
  let aguinaldo_proporcional        = ( dias_aguinaldo / 365.25 ) * salario_diario * dias_laborados_anio_corriente;

  let sumatoria = indemniza_3_meses + prima_antiguedad + aguinaldo_proporcional + vacaciones_adeudadas_prop + vacaciones_proporcional + proporcional_dias_t_adeudados;

  $( ID_REN_VOLUNTARIA ).hide();
  $( ID_DESPIDO_INJUST ).show();

  if ( $( ID_SELECT_20D ).is(":checked") ){
    sumatoria += indemniza_20_dpa;
    $( ID_RES_DIAS_P_A_LEY ).show();
  } else {
    $( ID_RES_DIAS_P_A_LEY ).hide();
  }

  $( ID_LABEL_TOTAL ).text( finiquitoFormatMoney( sumatoria ) );
  $( ID_LABEL_3S ).text( finiquitoFormatMoney( indemniza_3_meses ) );
  $( ID_LABEL_20DPAT ).text( finiquitoFormatMoney( indemniza_20_dpa ) );
  $( ID_LABEL_PRIMA_ANTIGUEDAD ).text( finiquitoFormatMoney( prima_antiguedad ) );
  $( ID_LABEL_DT_ADEUDA ).text( finiquitoFormatMoney( proporcional_dias_t_adeudados ) );
  $( ID_LABEL_VACA_D_P ).text( finiquitoFormatMoney( vacaciones_adeudadas_prop ) );
  $( ID_LABEL_VACA_PR ).text( finiquitoFormatMoney( prima_vacacional ) );
  $( ID_LABEL_VACA_P ).text( finiquitoFormatMoney( vacaciones_proporcional ) );
  $( ID_LABEL_AGUINALDO_PROP ).text( finiquitoFormatMoney( aguinaldo_proporcional ) );
}

function getDiasTrabajados(){
  let dIni = new Date( finiquitoFormatDate( $( ID_INPUT_INGRESO ).val() ) ).getTime() / 1000 / 60 / 60 / 24;
  let dFin = new Date( finiquitoFormatDate( $( ID_INPUT_EGRESO ).val() ) ).getTime() / 1000 / 60 / 60 / 24;
  return dFin - dIni;
}

function getDiasTrabajadosAnioCorriente(){
  let dIni = new Date( finiquitoFormatDate( $( ID_INPUT_INGRESO).val()  ) );

  let dFin    = new Date( finiquitoFormatDate( $( ID_INPUT_EGRESO ).val() ) ).getTime() / 1000 / 60 / 60 / 24;
  let anio_cc = new Date( finiquitoFormatDate( $( ID_INPUT_EGRESO ).val() ) ).getFullYear();

  console.log(anio_cc);

  if ( dIni.getFullYear() <= anio_cc ){
    dIni = new Date( anio_cc, 0, 1);
  }

  let res = dFin - ( dIni.getTime() / 1000 / 60 / 60 / 24 );

  if (res < 0){
    return 0;
  }

  console.log(res);
  return res;
}

function calculadoraRenunciaVoluntaria(){
  let salario_diario          = Number( $( ID_INPUT_SALA_DIA ).val() );
  let dias_trabajados_adeuda  = Number( $( ID_INPUT_D_N_PAY ).val() );
  let dias_vacacion_adeuda    = Number( $( ID_INPUT_D_VACA_D ).val() );
  let dias_vacacion_pago      = Number( $( ID_INPUT_D_VACA ).val() );
  let prima_vacacional_i      = Number( $( ID_INPUT_P_VACA ).val() );
  let dias_aguinaldo          = Number( $( ID_INPUT_D_AGUI ).val() );

  let aguinaldo_diario              = salario_diario * 30 / 365.25 / 2;
  let dias_trabajados               = getDiasTrabajados();
  let dias_laborados_anio_corriente = getDiasTrabajadosAnioCorriente();
  let aguinaldo_proporcional        = ( dias_aguinaldo / 365.25 ) * salario_diario * dias_laborados_anio_corriente;
  let vacaciones_proporcional       = salario_diario * dias_vacacion_pago;
  let prima_vacacional              = vacaciones_proporcional / 100 * prima_vacacional_i;

  let salario_real_c_tope = salario_diario;
  if ( salario_real_c_tope > ( getSalarioMinimoGral() * MULT_SALARIO_LIMITADO) ){
    salario_real_c_tope = getSalarioMinimoGral() * MULT_SALARIO_LIMITADO;
  }

  let antiguedad_anios = dias_trabajados / 365.25;
  let prima_antiguedad = 0;
  if ( antiguedad_anios >= 15 ){
    prima_antiguedad = 12 * salario_real_c_tope * antiguedad_anios;
  }

  let proporcional_dias_t_adeudados = dias_trabajados_adeuda * salario_diario;
  let vacaciones_adeudadas_prop     = dias_vacacion_adeuda * salario_diario;

  let sumatoria = prima_antiguedad + aguinaldo_proporcional + vacaciones_proporcional + prima_vacacional + proporcional_dias_t_adeudados + vacaciones_adeudadas_prop;

  $( ID_LABEL_TOTAL ).text( finiquitoFormatMoney( sumatoria ) );
  $( ID_LABEL_PRIMA_ANTIGUEDAD ).text( finiquitoFormatMoney( prima_antiguedad ) );
  $( ID_LABEL_AGUINALDO_PROP ).text( finiquitoFormatMoney( aguinaldo_proporcional ) );
  $( ID_LABEL_VACA_D_P ).text( finiquitoFormatMoney( vacaciones_adeudadas_prop ) );
  $( ID_LABEL_VACA_P ).text( finiquitoFormatMoney( vacaciones_proporcional ) );
  $( ID_LABEL_VACA_PR ).text( finiquitoFormatMoney( prima_vacacional ) );
  $( ID_LABEL_DT_ADEUDA ).text( finiquitoFormatMoney( proporcional_dias_t_adeudados ) );

  $( ID_DESPIDO_INJUST ).hide();
  $( ID_REN_VOLUNTARIA ).show();
}

function calcularFiniquito(){
  let validacion = validarFormulario();
  let motivo     = $( ID_INPUT_MOTIVO ).val();

  if ( !validacion.result ){
    showAlert( validacion.errors, 'Atención' );
    return false;
  }

  if ( motivo !== '' ){
    finiSelectMotFinOptions[ motivo ].calculadora();
    goToResult();
  } else {
    showAlert( 'Ha ocurrido un error, reintente más tarde.', 'Atención' );
  }
}

function finiquitoVolverInicio(){
  $('.nav-tabs a[href="#info-lab"]').tab('show');
}

function inicializar(){
  $( ID_BTN_CALCULAR ).click( ( e )=>{ calcularFiniquito(); } );
  $( ID_BTN_VOLVER ).click( ( e )=>{ finiquitoVolverInicio(); } );

  $( ID_INPUT_MOTIVO ).change( ( e )=> {
    if ( $( ID_INPUT_MOTIVO ).val() == 0 ){ //[MODIFICAR A FUTURO]
      $( ID_REN_VOLUNTARIA ).hide();
      $( ID_DESPIDO_INJUST ).show();
      $( ID_SELECT_20D ).val( true );
    } else {
      $( ID_REN_VOLUNTARIA ).show();
      $( ID_DESPIDO_INJUST ).hide();
    }
  } );

  //se calcula la minima fecha adminitad para egreso
  let fecha_minima = finiquitoGetFechaMinima();
  $( ID_MINIMA_FECHA_E ).text(fecha_minima.getDate() + '/' + (Number( fecha_minima.getMonth() ) + 1) + '/' + fecha_minima.getFullYear() );

  $( ID_INPUT_INGRESO ).datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', format: FORMATO_FECHA });
  $( ID_INPUT_EGRESO ).datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', format: FORMATO_FECHA });

  for ( let c=0; c < finiSelectMotFinOptions.length ; c++ ){
    $( ID_INPUT_MOTIVO ).append( '<option value="' + c + '">'+ finiSelectMotFinOptions[ c ].d +'</option>' );
  }

  for ( let c=0; c < SALARIO_MINIMO_GRAL.length; c++ ){
    $( ID_INPUT_ZONA_GEO ).append( '<option value="' + SALARIO_MINIMO_GRAL[ c ].m + '">'+ SALARIO_MINIMO_GRAL[ c ].l +'</option>' );
  }
  $( ID_INPUT_ZONA_GEO ).val( SALARIO_MINIMO_GRAL[ 0 ].m );

  $( ID_ROW_RESULTS ).hide();
  $( ID_ROW_NO_RESULTS ).show();
  $( ID_REN_VOLUNTARIA ).hide();
  $( ID_DESPIDO_INJUST ).show();

  //definición de valores por defecto
  $( ID_INPUT_D_AGUI ).val( PREDETERMINADO_DIAS_AGUINALDO );
  $( ID_INPUT_P_VACA ).val( PREDETERMINADO_PRIMA_VACACIONAL );
  $( ID_INPUT_ZONA_GEO ).val( PREDETERMINADO_SELECTOR_ZONA_GEO );
}

function finiquitoGetFechaMinima(){
  let hoy = new Date();
  return new Date( hoy.getFullYear(), hoy.getMonth()-CANT_MESES_MIN_DESVINCULACION, hoy.getDate() );
}

$( document ).ready( function() {
  inicializar();
} );
