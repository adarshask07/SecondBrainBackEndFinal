import { getEmbedding } from "../config/GetEmbeddings.js";
import { Content } from "../Models/Content.model.js";

export const createContent = async (req,res) => {
    const { title, content, tags } = req.body;
    const userId = req.user._id

    const embeddings  = await getEmbedding(content) ;
    const newContent = {
        title: title,
        content: content,
        tags: tags,
        user : userId,
        embeddings : embeddings
    };
    const data = await Content.create(newContent);

    return res.status(200).json({
        sucess: true,
        message: "Content created !",
        data: data,
    });
};
export const getContent = async (req, res) => {
    const contentId = req.params._id;
    const userId = req.user._id;

    const contentData = await Content.findOne({
        _id: contentId,
        user: userId,
    },{
        user :0,
        embeddings : 0
    });

    if (!contentData) {

        return res.status(400).json({
            sucess: false,
            message: "No content found",
        });
    }

 
    

    return res.status(200).json({
        sucess: true,
        message: "Content Found",
        data: contentData
    })

};


export const getAllContent = async (req, res) => {
    
    const userId = req.user._id;

    const contentData = await Content.findOne({
        user: userId,
    }, {
        user:-0,
        embeddings :0 
    });

    if (!contentData) {

        return res.status(400).json({
            sucess: false,
            message: "No content found",
        });
    }

  

    return res.status(200).json({
        sucess: true,
        message: "Content Found",
        data: contentData
    })

};


export const deleteContent = async (req,res)=>{
    const contentId = req.params._id ;
    const userId = req.user._id

    const content = await Content.deleteOne({_id : contentId, user : userId})
  

    

    return res.status(200).json({
        sucess : true ,
        message : "Content deleted Sucessfully" ,
        content : content._id
    })
}

export const updateContent = async (req,res)=>{
    const { title, content, tags } = req.body;
    const contentId = req.params._id ;
    const userId = req.user._id ;



    const updatedContent = await Content.findByIdAndUpdate({
        _id : contentId
    }, {
        $set : {
            title : title ,
            content : content ,
            tags :tags,
            user : userId 

        }
    }, {
        new : true
    })

    return res.status(200).json({
        sucess: true ,
        message : "Updated Sucessfully",
        data : updatedContent
    })
}