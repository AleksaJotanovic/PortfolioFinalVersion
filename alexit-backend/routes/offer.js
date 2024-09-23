import express from 'express';
import { createOffer, deleteOffer, getAllOffers, getOfferById, updateOffer, uploadFeaturedImage } from '../controllers/offer.controller.js';
import { offersFeaturedUpload } from '../middlewares/multer-config.js';



const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/create', createOffer);
router.put('/update/:id', updateOffer);
router.delete('/delete/:id', deleteOffer);
router.post('/upload-featured', offersFeaturedUpload.single('file'), uploadFeaturedImage);


export default router;