// `||` y no `??`: una build sin `--build-arg VITE_API_URL` hornea la cadena vacía,
// que también debe caer al valor por defecto de desarrollo.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
