import * as bcrypt from "bcrypt";
import { User } from "./user.interface";
import { UserORM } from "./user.entity";
import { FilterUserDTO } from "./user.dto";
import { NotFoundError } from "../../errors/not-found";
import { InstallationORM } from "../installation/installation.entity";
import { superAdmin } from "../../global";

export class UserService {
    async hashPAssword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    async add(user: User, credentials: {username: string, password: string}): Promise<UserORM>{
        const hashedPassword = await this.hashPAssword(credentials.password);
        const newUser = new UserORM();
        newUser.username = credentials.username;
        newUser.hashedPassword = hashedPassword!;
        newUser.accessLevel = user.accessLevel!;
        newUser.installationId = user.installationId!;
        newUser.lastAccess = new Date(Date.now());
        const created = await newUser.save();
        if(!created){
            throw new NotFoundError()
        }
        const userCreated = await this.getUserByUsernameWithError(created.username);
        return userCreated!;
    }

    async list(filter: FilterUserDTO): Promise<UserORM[] | []>{
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
        const user = await UserORM.createQueryBuilder("users")
            .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
            .where("users.username = :username", { username: username })
            .getOne()
        return user;
    }

    async getUserByUsernameWithError(username: string): Promise<UserORM> {
        const user = await UserORM.createQueryBuilder("users")
            .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
            .where("users.username = :username", { username: username })
            .getOne()
        if(!user){
            throw new NotFoundError();
        }
        return user;
    }

    async getOneUser(): Promise<UserORM | null> {
        const user = await UserORM.findOne({where: {accessLevel: superAdmin}});
        return user;
    }

    async delete(username: string): Promise<void>{
        const deleteUser = await UserORM.delete({username: username});
        if(deleteUser.affected === 0){
            throw new NotFoundError();
        }
    }

    async update(username: string, user: any): Promise<void>{
        const updated = await UserORM
        .createQueryBuilder()
        .update("users")
        .set(user)
        .where("username = :username", { username: username })
        .execute()
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new UserService();