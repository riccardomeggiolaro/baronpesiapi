import { NotFoundError } from "../../errors/not-found";
import { FilterMaterialDTO, MaterialDTO, UpdateMaterialDTO } from "./material.dto";
import { MaterialORM } from "./material.entity";

export class MaterialService {
    async add(newMaterial: MaterialDTO): Promise<MaterialORM | null>{
        const material = new MaterialORM(); // Create new subject
        material.description = newMaterial.description;
        const created = await material.save(); // Save new subject
        // Check if the subject was created
        if(!created){
            throw new NotFoundError();
        }
        return created;
    }

    async list(filter: FilterMaterialDTO): Promise<MaterialORM[] | []>{
        const materials = MaterialORM
            .createQueryBuilder("materials")
            if(filter.description) materials.andWhere("materials.description LIKE :description", { description: `${filter.description}%` })
        const result = await materials.getMany()
        return result;
    }

    async delete(id: number): Promise<void>{
        const deleted = await MaterialORM.delete({id: id})
        if(deleted.affected === 0){
            throw new NotFoundError();
        }   
    }

    async getById(id: number): Promise<MaterialORM | null>{
        // Create query to get subject by id
        const material = await MaterialORM.findOneBy({id: id});
        return material;
    }

    async getByIdWithError(id: number): Promise<MaterialORM>{
        // Create query to get subject by id
        const material = await MaterialORM.findOneBy({id: id});
        // Check if subject was found 
        if(!material){
            throw new NotFoundError();
        }
        return material;
    }

    async getByDescription(description: string): Promise<MaterialORM | null>{
        const material = await MaterialORM.findOneBy({description: description});
        return material;
    }

    async update(id: number, material: UpdateMaterialDTO): Promise<void>{
        // Create query to update the subject by id and passing an object with parameters contains value to update
        const updated = MaterialORM
        .createQueryBuilder()
        .update("materials")
        .set(material)
        .where("id = :id", { id: id })
        const result = await updated.execute();
        // Check if subject was updated
        if(result.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new MaterialService();