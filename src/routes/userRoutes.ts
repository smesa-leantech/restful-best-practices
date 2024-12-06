import { Router } from 'express';
import { body, query } from 'express-validator';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del usuario
 *         user_name:
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del usuario
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     Link:
 *       type: object
 *       properties:
 *         href:
 *           type: string
 *           description: URL del recurso
 *         method:
 *           type: string
 *           enum: [GET, POST, PATCH, DELETE]
 *           description: Método HTTP permitido
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Tipo de error
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del error
 *         details:
 *           type: array
 *           items:
 *             type: object
 *           description: Detalles adicionales del error
 */

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene lista paginada de usuarios
 *     description: Retorna una lista de usuarios con soporte para paginación por cursor y campos selectivos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: ID del último usuario recuperado para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número máximo de registros a retornar
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Lista de campos a incluir, separados por coma (ej. "id,user_name,email")
 *     responses:
 *       200:
 *         description: Lista de usuarios recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       $ref: '#/components/schemas/Link'
 *                     next:
 *                       $ref: '#/components/schemas/Link'
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', 
  // Validación de los parámetros de consulta
  query('cursor').optional().isString(), // El parámetro 'cursor' es opcional y debe ser una cadena
  query('limit').optional().isInt({ min: 1, max: 100 }), // El parámetro 'limit' es opcional y debe ser un entero entre 1 y 100
  query('fields').optional().isString(), // El parámetro 'fields' es opcional y debe ser una cadena
  validateRequest, // Middleware para validar la solicitud
  userController.getUsers // Controlador que maneja la lógica para obtener los usuarios
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo registro de usuario con los datos proporcionados
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - birth_date
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Nombre de usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       $ref: '#/components/schemas/Link'
 *                     update:
 *                       $ref: '#/components/schemas/Link'
 *                     delete:
 *                       $ref: '#/components/schemas/Link'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',
  authenticate, // Middleware para autenticar la solicitud
  // Validación de los campos del cuerpo de la solicitud
  body('user_name').isString().trim().notEmpty(), // El campo 'user_name' debe ser una cadena no vacía
  body('email').isEmail().normalizeEmail(), // El campo 'email' debe ser un correo electrónico válido
  body('birth_date').isISO8601().toDate(), // El campo 'birth_date' debe ser una fecha en formato ISO8601
  validateRequest, // Middleware para validar la solicitud
  userController.createUser // Controlador que maneja la lógica para crear un nuevo usuario
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un usuario
 *     description: Actualiza uno o más campos de un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Nuevo nombre de usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       $ref: '#/components/schemas/Link'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id',
  authenticate, // Middleware para autenticar la solicitud
  // Validación de los campos del cuerpo de la solicitud
  body('user_name').optional().isString().trim(), // El campo 'user_name' es opcional y debe ser una cadena
  body('email').optional().isEmail().normalizeEmail(), // El campo 'email' es opcional y debe ser un correo electrónico válido
  validateRequest, // Middleware para validar la solicitud
  userController.updateUser // Controlador que maneja la lógica para actualizar un usuario existente
);

export { router as userRoutes };
