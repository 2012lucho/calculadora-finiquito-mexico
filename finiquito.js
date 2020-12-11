
$( document ).ready( function() {
  $('#finiIngreso').datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', });
  $('#finiEgreso').datepicker({ uiLibrary: 'bootstrap4', locale: 'es-es', });

  let finiSelectMotFinOptions = [
    { v: 4, d: 'Despido injustificado' },
    { v: 12, d: 'Renuncia voluntaria' }
  ];


  for ( let c=0; c < finiSelectMotFinOptions.length ; c++ ){
    $( '#finiSelectMotFin' ).append( '<option value="' + finiSelectMotFinOptions[ c ].v + '">'+ finiSelectMotFinOptions[ c ].d +'</option>' );
  }
} );
