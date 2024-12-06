import { Router } from 'express';
import { body, query } from 'express-validator';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';

/**
 * Router para el manejo de usuarios
 * Implementa varios puntos de las guías de Zalando:
 * - Punto 4: URLs amigables
 * - Punto 5: Estandarización de datos (validación)
 * - Punto 6: Seguridad (autenticación)
 * - Punto 7: Métodos HTTP correctos
 * - Punto 9: Paginación eficiente
 */
const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene lista de usuarios
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de registros por página
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Campos a incluir en la respuesta
 */
router.get('/', 
  query('cursor').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('fields').optional().isString(),
  validateRequest,
  userController.getUsers
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     security:
 *       - bearerAuth: []
 */
router.post('/',
  authenticate,
  body('user_name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('birth_date').isISO8601().toDate(),
  validateRequest,
  userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un usuario
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',
  authenticate,
  body('user_name').optional().isString().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  validateRequest,
  userController.updateUser
);

export { router as userRoutes };
