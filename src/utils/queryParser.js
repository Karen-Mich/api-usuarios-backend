const { Op } = require('sequelize');

function parseQuery(query) {
  const { page = 1, limit = 10, sort, ...filters } = query;

  // Paginación
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const offset = (parsedPage - 1) * parsedLimit;

  // Ordenamiento
  let order = [['id', 'ASC']];
  
  if (sort) {
    const [field, direction = 'asc'] = sort.split(':');
    order = [[field, direction.toUpperCase()]];
  }

  const where = {};
  
  // Filtro por nombre 
  if (filters.nombre) {
    where.nombre = {
      [Op.like]: `%${filters.nombre}%`
    };
  }
  
  // Filtro por apellido 
  if (filters.apellido) {
    where.apellido = {
      [Op.like]: `%${filters.apellido}%`
    };
  }
  
  // Filtro por email
  if (filters.email) {
    where.email = {
      [Op.like]: `%${filters.email}%`
    };
  }
  
  // Filtro por rol 
  if (filters.rol) {
    where.rol = filters.rol;
  }

  return {
    limit: parsedLimit,
    offset,
    order,
    filters: where,  
    page: parsedPage
  };
}

module.exports = { parseQuery };