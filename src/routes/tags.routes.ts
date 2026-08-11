import express from 'express'
import * as tagsController from '../controllers/tags.controller.ts'

const router = express.Router()

router.get('/', tagsController.getAllTags)
router.get('/:id', tagsController.getTagById)
router.post('/', tagsController.createTag)
router.patch('/:id', tagsController.updateTag)
router.delete('/:id', tagsController.deleteTag)

export default router