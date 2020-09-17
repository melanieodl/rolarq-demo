const toCurrency = num => new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(num)

export {toCurrency}
