import {createClient} from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()


const supabaseUrl = process.env.SUPABASE_URL!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

if(!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Supabase URL or Secret Key is not defined in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey)