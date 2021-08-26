/*
    Rutas Auth
    Host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

router.post( 
    '/new',
    [
        check('name', 'The name is require').not().isEmpty(),
        check('email', 'The email is require').isEmail(),
        check('password', 'The password must have 6 characters').isLength({ min: 6 }),
        validarCampos
    ],
    createUser
);

router.post( 
    '/',
    [
        check('email', 'The email is require').isEmail(),
        check('password', 'The password must have 6 characters').isLength({ min: 6 }),
        validarCampos
    ],
    loginUser
);

router.get( 
    '/renew',
    validarJWT,
    renewToken
);

module.exports = router;