import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import multer from 'multer';
import UploadConfig from '../config/upload'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'
const usersRouter = Router();
const upload = multer(UploadConfig)


usersRouter.post('/', async (request, response) => {

  const { name, email, password } = request.body; //pegar dados do usuario

  const createUser = new CreateUserService();
  const user = await createUser.execute({
    name,
    email,
    password
  })
  delete user.password;
  return response.json(user)

});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {

  const updateUserAvatarService = new UpdateUserAvatarService();
  const user = await updateUserAvatarService.execute({
    user_id: request.user.id,
    avatarFilename: request.file.filename

  })
  delete user.password;
  return response.json(user)


})

export default usersRouter;
