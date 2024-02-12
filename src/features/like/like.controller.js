import { LikeRepository } from "./like.repository.js";
export class LikeController{

    constructor(){
        this.LikeRepository = new LikeRepository();
    }

    async likeItem(req, res){
        try {
            const {id, type} = req.body;
            if(type != "Product" && type != "Category"){
                return res.status(400).send("Invalid");
            }else{

                if(type == "Product"){
                    await this.LikeRepository.likeProduct(req.userId, id);
                    return res.status(201).send("Liked");
                }else{
                    await this.LikeRepository.likeCategory(req.userId, id);
                    return res.status(201).send("Liked");
                }

            }

            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }
    }

    async getLikes(req,res) {

        try {

            const {id, type} = req.query;
        const like = await this.LikeRepository.getLikes(type,id);
        return res.status(200).send(like);
            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }

        
    }
}