/*
    Rutas Events
    Host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT } = require("../middlewares/validarJWT");
const { getEventos, crearEvento, setEvento, deletedEvento } = require("../controllers/events");
const { validarCampos } = require("../middlewares/validarCampos");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Validar JWT en todas la rutas
router.use( validarJWT );

router.get(
    '/',
    getEventos
)

router.post(
    '/',
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria' ).custom( isDate ),
        check( 'end', 'La fecha de finalizacion es obligatoria' ).custom( isDate ),
        validarCampos
    ],
    crearEvento
)

router.put(
    '/:id',
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria' ).custom( isDate ),
        check( 'end', 'La fecha de finalizacion es obligatoria' ).custom( isDate ),
        validarCampos
    ],
    setEvento
)

router.delete(
    '/:id',
    deletedEvento
)

module.exports = router