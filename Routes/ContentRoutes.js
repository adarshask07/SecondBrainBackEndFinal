import {Router} from 'express' ;
import { createContent, deleteContent, getAllContent, getContent, tellMoreAboutCard, updateContent } from '../Controllers/Content.js';
import { auth } from '../MIddlewares/Auth.js';
import { searchContent } from '../Controllers/User.js';


const router = Router() ;


router.post('/create', auth, createContent )
router.get('/get-all', auth, getAllContent)
router.get('/get-memory/:_id', auth, getContent)
router.post('/delete/:_id', auth, deleteContent)
router.post('/update/:_id', auth, updateContent)
router.post('/search', auth, searchContent)
router.post('/tell-about-card', auth, tellMoreAboutCard)




export default router ; 