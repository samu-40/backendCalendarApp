const { response, request } = require("express")

const Evento = require("../models/Evento")

const getEventos = async (req, resp = response) => {

    const eventos = await Evento.find().populate( 'user', 'name' )

    resp.json({
        ok: true,
        eventos
    })

}

const crearEvento = async (req, resp = response) => {

    const evento = new Evento( req.body )

    try {

        evento.user = req.uid

        const eventoSave = await evento.save()

        resp.json({
            ok: true,
            evento: eventoSave
        })
        
    } catch (err) {

        console.log(err)

        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const setEvento = async (req = request, resp = response) => {

    const eventId = req.params.id

    try {
        
        const evento = await Evento.findById( eventId )

        if ( !evento ) {

            resp.status(404).json({
                ok: false,
                msg: 'No hay algun evento por ese id'
            })

        }

        if ( evento.user.toString() !== req.uid ) {

            resp.status(401).json({
                ok: false,
                msg: 'No se puede editar eventos de otras personas'
            })

        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const updateEvent = await Evento.findByIdAndUpdate( eventId, nuevoEvento, { new : true } )

        resp.json({
            ok: true,
            evento: updateEvent
        })

    } catch (err) {

        console.log(err)
        
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const deletedEvento = async (req = request, resp = response) => {

    const { uid, params: { id } } = req;
    
    try {

        const evento = await Evento.findById( id )

        if ( !evento ) {

            resp.status(404).json({
                ok: false,
                msg: 'No existe un evento con este id'
            })

        }

        if ( evento.user.toString() !== uid ) {

            resp.status(401).json({
                ok: false,
                msg: 'No se puede borrar eventos de otras personas'
            })

        }

        const deletedEvent = await Evento.findByIdAndDelete( id )

        resp.json({
            ok: true,
            msg: 'Evento borrado correctamente',
            deletedEvent: deletedEvent
        })
        
    } catch (err) {
        
        console.log(err)
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

    resp.json({
        ok: true,
        msg: 'deletedEvento'
    })

}

module.exports = {
    getEventos,
    crearEvento,
    setEvento,
    deletedEvento
}