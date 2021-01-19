function finiquitoIsValidDate( d ) {
  return d instanceof Date && !isNaN(d);
}

function finiquitoFormatDate( d ){
  d = String( d ).split('/');

  if ( d.length === 3 ){
      return d[1] + '/' + d[0] + '/' + d[2];
  }

  return '';
}

function validarFormularioErrorOut( error, inputs ){
  for ( let c=0; c< inputs.length; c++ ){
    $( inputs[ c ] ).addClass( CLASS_IS_INVALID );
  }
  return {
    result: false, errors: error
  };
}

function validateNumberField( campoId, campoName, descType, s='o', min=0, max=10000000 ){
  let aux = $( campoId ).val();
  if ( Number.isNaN( aux ) || aux === '' ){
    return validarFormularioErrorOut( 'Revise '+descType+' ingresad'+s+' en '+campoName+', solo se permiten valores númericos.', [campoId] );
  }

  if ( aux < min ){
    return validarFormularioErrorOut( 'Revise '+descType+' ingresad'+s+' en '+campoName+', el valor mínimo admitido es: '+min+'.', [campoId] );
  }

  if ( aux > max ){
    return validarFormularioErrorOut( 'Revise '+descType+' ingresad'+s+' en '+campoName+', el valor máximo admitido es: '+max+'.', [campoId] );
  }

  return { result: true };
}

function validarFormulario(){
  let aux;
  //reseteo clases de validacion
  $( '.form-control' ).removeClass( CLASS_IS_INVALID );

  //Comprobando fecha inicial
  aux = $( ID_INPUT_INGRESO ).val();
  if ( aux === '' ){
    return validarFormularioErrorOut( 'Revise la fecha de ingreso, no es válida.', [ID_INPUT_INGRESO] );
  }

  aux = new Date( finiquitoFormatDate( aux ) );
  if ( !finiquitoIsValidDate( aux ) ){
    return validarFormularioErrorOut( 'Revise la fecha de ingreso, no es válida.', [ID_INPUT_INGRESO] );
  }

  if ( aux.getFullYear() < INPUT_INGRESO_MINY ){
    return validarFormularioErrorOut( 'Revise la fecha de ingreso, no es válida.', [ID_INPUT_INGRESO] );
  }

  if ( aux.getTime() > new Date().getTime() ){
    return validarFormularioErrorOut( 'Revise la fecha de ingreso, no puede ser mayor al día de la fecha.', [ID_INPUT_INGRESO] );
  }

  //comprobando fecha final
  aux = $( ID_INPUT_EGRESO ).val();
  if ( aux === '' ){
    return validarFormularioErrorOut( 'Es necesario definir la fecha de renuncia/despido.', [ID_INPUT_EGRESO] );
  }

  aux = new Date( finiquitoFormatDate( aux ) );
  if ( !finiquitoIsValidDate( aux ) ){
    return validarFormularioErrorOut( 'Revise la fecha de renuncia/despido, no es válida.', [ID_INPUT_EGRESO] );
  }

  if ( aux.getTime() < finiquitoGetFechaMinima().getTime() ){
    return validarFormularioErrorOut( 'Revise la fecha de renuncia/despido, no es válida.', [ID_INPUT_EGRESO] );
  }

  if ( aux.getTime() > new Date().getTime() ){
    return validarFormularioErrorOut( 'Revise la fecha de renuncia/despido, no puede ser mayor al día de la fecha.', [ID_INPUT_EGRESO] );
  }

  //se comprueba que la fecha inical no sea mayor a la fecha final
  if ( aux.getTime() <  new Date( finiquitoFormatDate( $( ID_INPUT_INGRESO ).val() ) ).getTime() ){
    return validarFormularioErrorOut( 'Revise la fechas, la fecha de ingreso no puede ser mayor a la de renuncia/despido.', [ID_INPUT_EGRESO, ID_INPUT_INGRESO] );
  }

  //se comprueba el salario diario
  aux = validateNumberField( ID_INPUT_SALA_DIA, 'el salario diario', 'el monto', 'o', 1 );
  if ( !aux.result ){
    return aux;
  }

  //se comprueban los días laborales impagos
  if ( $( ID_INPUT_D_N_PAY ).val() != '' ){
    aux = validateNumberField( ID_INPUT_D_N_PAY, 'los días no pagos', 'la cantidad', 'a', 0 );
    if ( !aux.result ){
      return aux;
    }
  }

  //se comprueban los días de aguinaldo
  aux = validateNumberField( ID_INPUT_D_AGUI, 'los días de aguinaldo', 'la cantidad', 'a', 0 );
  if ( !aux.result ){
    return aux;
  }

  //se comprueban los días de vacaciones adeudados
  if ( $( ID_INPUT_D_VACA_D ).val() != '' ){
    aux = validateNumberField( ID_INPUT_D_VACA_D, 'los días de vacaciones adeudados del último periodo', 'la cantidad', 'a', 0 );
    if ( !aux.result ){
      return aux;
    }
  }

  //se comprueba la prima vacacional
  aux = validateNumberField( ID_INPUT_P_VACA, 'la prima vacacional', 'el porcentaje', 'o', 0, 100 );
  if ( !aux.result ){
    return aux;
  }

  //se comprueban los días de vacaciones
  aux = validateNumberField( ID_INPUT_D_VACA, 'los días de vacaciones', 'la cantidad', 'a', 0 );
  if ( !aux.result ){
    return aux;
  }

  return { result: true };
}

function finiquitoFormatMoney( e ){
  let formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
  });
  return formatter.format( e );
}
