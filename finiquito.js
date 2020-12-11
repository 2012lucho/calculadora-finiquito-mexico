
$( document ).ready( function() {
  $('#finiIngreso').datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', });
  $('#finiEgreso').datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', });

  let finiSelectMotFinOptions = [
    { v: 1, d: 'Agotamiento de la materia prima' },
    { v: 2, d: 'Cierre de la empresa por fuerza mayor' },
    { v: 3, d: 'Quiebra del patrón' },
    { v: 4, d: 'Despido injustificado por parte del patrón, negandose a aceptar la reinstalación del trabajador' },
    { v: 5, d: 'Despido injustificado por parte del patrón, y el trabajador no acepta la reinstalación' },
    { v: 6, d: 'Despido justificado' },
    { v: 7, d: 'Incapacidad del trabajador' },
    { v: 8, d: 'Incapacidad permanente' },
    { v: 9, d: 'Muerte natural' },
    { v: 10, d: 'Muerte derivada por riesgo de trabajo' },
    { v: 11, d: 'Muerte del patrón' },
    { v: 12, d: 'Renuncia voluntaria' },
    { v: 13, d: 'Terminación anticipada de contrato' },
    { v: 14, d: 'Terminación del contrato por obra o tiempo determinado' },
    { v: 15, d: 'Otra causa' }
  ];


  for ( let c=0; c < finiSelectMotFinOptions.length ; c++ ){
    $( '#finiSelectMotFin' ).append( '<option value="' + finiSelectMotFinOptions[ c ].v + '">'+ finiSelectMotFinOptions[ c ].d +'</option>' );
  }
} );
