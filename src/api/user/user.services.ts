import * as bcrypt from "bcrypt";
import { User } from "./user.interface";
import { UserORM } from "./user.entity";
import { FilterUserDTO } from "./user.dto";
import { NotFoundError } from "../../errors/not-found";
import { InstallationORM } from "../installation/installation.entity";
import { superAdmin } from "../../global";

export class UserService {
    async hashPAssword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        return hashedPassword; // Return password hashed
    }

    async add(user: User, credentials: {username: string, password: string}): Promise<UserORM>{
        const hashedPassword = await this.hashPAssword(credentials.password);
        const newUser = new UserORM(); // Create new user
        newUser.username = credentials.username;
        newUser.hashedPassword = hashedPassword!;
        newUser.accessLevel = user.accessLevel!;
        newUser.installationId = user.installationId!;
        newUser.lastAccess = new Date(Date.now());
        const created = await newUser.save();
        // Check if user was created
        if(!created){
            throw new NotFoundError()
        }
        const userCreated = await this.getUserByUsernameWithError(created.username); // Check if user was created
        return userCreated!;
    }

    async list(filter: FilterUserDTO): Promise<UserORM[] | []>{
        // Create query to find users filtered
        const users = UserORM
            .createQueryBuilder("users")
            .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id");
            if(filter.username) users.where("users.username LIKE :username", { username: `${filter.username}%` })
            if(filter.idInstallation) users.andWhere("users.installationId = :installationId", { installationId: filter.idInstallation })
        const result = await users.getMany()
        if(!users){
            return [];
        }
        return result;
    }

    async getUserByUsername(username: string): Promise<UserORM | null> {
        // Create query to select the user by username
        const user = await UserORM.createQueryBuilder("users")
            .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
            .where("users.username = :username", { username: username })
            .getOne()
        return user;
    }

    async getUserByUsernameWithError(username: string): Promise<UserORM> {
        // Create query to select the user by username
        const user = await UserORM.createQueryBuilder("users")
            .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
            .where("users.username = :username", { username: username })
            .getOne()
            // Check if the user found
        if(!user){
            throw new NotFoundError();
        }
        return user;
    }

    async getOneUser(): Promise<UserORM | null> {
        // Create query to get one user that is super admin
        const user = await UserORM.findOne({where: {accessLevel: superAdmin}});
        return user;
    }

    async delete(username: string): Promise<void>{
        // Create query to delete user by username
        const deleteUser = await UserORM.delete({username: username});
        // Check if user was deleted
        if(deleteUser.affected === 0){
            throw new NotFoundError();
        }
    }

    async update(username: string, user: any): Promise<void>{
        // Create query to update user
        const updated = await UserORM
        .createQueryBuilder()
        .update("users")
        .set(user)
        .where("username = :username", { username: username })
        .execute()
        // Check is user was updated
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new UserService();