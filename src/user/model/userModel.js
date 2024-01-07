
const { logError } = require('../../../util/logger');
const { getPaginatedData } = require("../../../util/db");
const path = require('path');
const userSchema = require('../../../model/userModel');
const getPool = require("../../../util/db");
const jwt = require('jsonwebtoken');

const { encryptPassword, getPasswordInfo, verifyPassword } = require("../../../util/password");
const { getToken } = require('../../../util/util');
const secretKey = process.env.JWT_SECRET_KEY;

const { sendEmail } = require('../../../util/util');





class User {


    static async addUser(name, email, password, image) {
        let conn = await getPool();
        // console.log(conn);


        try {

            let hashPassword = await encryptPassword(password, 15);


            const database = (await userSchema.create({ name: name, email: email, password: hashPassword, image: image }));

            return database;
        }
        catch (error) {

            logError(error, path.basename(__filename));

        }

    }
    static async existFind(data) {
        try {
            let conn = await getPool();


            let result = await userSchema.findOne(data)

            return result;


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
    static async userLogin(email) {
        try {
            let conn = await getPool();
            let result = await userSchema.findOne({ email: email });




            const data = {
                user: {
                    id: result._id
                }
            }





            let token = await jwt.sign(data, process.env.JWT_SECRET_KEY);

            return token;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
    static async userUpdate(id, data) {
        try {


            let conn = await getPool();
            let result = await userSchema.findByIdAndUpdate(id, { $set: data }, { new: true });
            console.log(result);
            return result;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }
    /*static async userUpdatePassword(id, password) {
        try {
            let conn = await getPool();

            let hashPassword = await encryptPassword(password, 15);


            let result = await userSchema.findByIdAndUpdate(id, { $set: { password: hashPassword } }, { new: true });
            console.log(result);

            return result;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;
        }

    }*/

    static async findById(id) {
        try {
            let conn = await getPool();
            return await userSchema.findById(id).select("-password");

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }


    static async userResetPassword(email) {

        try {
            let conn = await getPool();

            let token = getToken();
            console.log(token);

            let result = await userSchema.findOneAndUpdate({ email: email }, { $set: { tokens: token } }, { new: true }).select("-password");


            let resetEmail = await sendEmail(email, token)


            return true;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;
        }

    }
    static async resetPassword(tokens, password) {
        try {


            let conn = await getPool();
            console.log(tokens);


            let hashPassword = await encryptPassword(password, 15);

            let result = await userSchema.findOneAndUpdate({ tokens: tokens }, { $set: { password: hashPassword, tokens: "" } }, { new: true }).select("-password");

            return result;






        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }

}


module.exports = User;