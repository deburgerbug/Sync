import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js'

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
};

export const registerUser = async ({ name, email, password }) => {
    const existingUser = await userRepository.findUserByEmail(email)
    if (existingUser) {
        throw new AppError("Email already in use !", 409)
    };
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword
    });

    const token = generateToken(user.id);

    return {
        user: { id: user.id, name: user.name, email: user.email, },
        token,
    };
};

export const loginUser = async ({ email, password}) =>{
    const user = await userRepository.findUserByEmail(email);
    if(!user){
        throw new  AppError("Invalid email or password", 401)
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if(!isPasswordvalid){
        throw new AppError('Invalid email pr password', 401);
    }

    const token = generateToken(user.id)

    return{
        user: {id: user.id, name: user.name}, token,
    };
};



