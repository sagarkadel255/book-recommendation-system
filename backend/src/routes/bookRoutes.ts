import { Router } from 'express';
import {
  listBooks,
  getBook,
  getBookDetail,
  search,
  popular,
  trending,
  recommended,
  personalized,
  categories,
  genres,
  searchAuthors,
  booksByPublisher,
} from '../controllers/bookController';

const router = Router();

router.get('/search', search);
router.get('/popular', popular);
router.get('/trending', trending);
router.get('/recommended', recommended);
router.get('/personalized', personalized);
router.get('/categories', categories);
router.get('/genres', genres);
router.get('/authors', searchAuthors);
router.get('/detail', getBookDetail);
router.get('/publisher/:publisher', booksByPublisher);
router.get('/:isbn', getBook);
router.get('/', listBooks);

export default router;
