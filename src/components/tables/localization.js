export default (label) => ({
  toolbar: {
    searchTooltip: `Buscar ${label}`,
    searchPlaceholder: `Buscar ${label}`,
    nRowsSelected: 'Renglones seleccionados : {0}'
  },
  header: {
    actions: 'Acciones',
  },
  body: {
    addTooltip: `Nuevo ${label}`,
    deleteTooltip: 'Eliminar',
    editTooltip: 'Editar',
    emptyDataSourceMessage: 'No hay registros para mostrar',
    editRow: {
      deleteText: 'Esta seguro de eliminar este dato?',
      cancelTooltip: 'Cancelar',
      saveTooltip: 'Guardar',
    }
  },
  pagination: {
    firstTooltip: 'Primera pagina',
    previousTooltip: 'Pagina Anterior',
    nextTooltip: 'Pagina Siguiente',
    lastTooltip: 'Ultima pagina',
    labelDisplayedRows: '{from}-{to} de {count}'        }
})
