import {Router,Request, Response} from 'express'
import {supabase } from '../supabase.js'

const router = Router()

router.post('/register', async (req: Request, res:Response)=>{
    const {email , password}=req.body
    if(!email || !password){
        res.status(400).json({error: 'Email and password are required'})
        return
    }

    if(password.length<6){
        res.status(400).json({error: 'Password must be at least 6 characters'})
        return
    }

    const {data, error} = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm:true
    })

    if(error){
        res.status(400).json({error:error.message})
        return
    }

    res.status(201).json({message: 'User created successfully',userId: data.user.id })
})


router.post('/login',async (req:Request , res: Response)=>{
    const {email , password} =req.body

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
    }

    const {data,error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if(error){
        res.status(401).json({error:'Invalid email or password'})
        return
    }

    res.json({
        message:'Login sucessfully',
        token: data.session.access_token,
        user: {
            id:data.user.id,
            email: data.user.email
        }
    })  
})

router.post('/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  const { error } = await supabase.auth.admin.signOut(token)

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json({ message: 'Logged out successfully' })
})

export default router