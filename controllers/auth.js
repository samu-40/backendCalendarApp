const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/JWT');

const createUser = async ( req, resp = response ) => {

    const { email, password } = req.body;

    try {        
        
        let usuario = await Usuario.findOne({ email });
        
        if ( usuario ){
            
            return resp.status(400).json({
                
                ok: false,
                msg: 'Ya existe un usuario con este correo'
                
            });
            
        };

        usuario = new Usuario( req.body );

        // Encriptado de contrasena
        // const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync( password, 10 );
    
        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        resp.status(201).json({
    
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
    
        });

    } catch (err) {
        
        console.log(err);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }


};

const loginUser = async ( req, resp = response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        
        if ( !usuario ){
            
            return resp.status(400).json({
                
                ok: false,
                msg: 'No existe un usuario con ese email'
                
            });
            
        };

        // Confirmar passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if ( !validPassword ){

            return resp.status(400).json({
                ok: false,
                msg: 'Password invalido'
            })

        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        resp.json({

            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
    
        });
        
    } catch (err) {
        
        console.log(err);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }

};

const renewToken = async ( req, resp = response ) => {

    const { uid, name } = req

    const token = await generarJWT( uid, name )

    resp.json({

        ok: true,
        token

    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken
};