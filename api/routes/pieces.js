const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');

const pieceController = require('../controllers/piece');

router.post('/createPiece',checkAuthsuperadmin, pieceController.piece_create_piece);
router.delete('/deletePiece',checkAuthsuperadmin, pieceController.piece_delete_piece);
router.delete('/deleteallPiece',checkAuthsuperadmin, pieceController.piece_deleteall_piece);
router.get('/getPiece',checkAuthsuperadmin, pieceController.piece_getall_piece);
module.exports= router;