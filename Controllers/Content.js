import { getEmbedding } from "../config/GetEmbeddings.js";
import { main } from "../config/Llama.js";
import { moreAboutCard } from "../config/prompts.js";
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
    await Content.create(newContent);
    const contentData = await Content.find({
        user: userId,
    }, {
        user:-0,
        embeddings :0 
    });


    return res.status(200).json({
        success: true,
        message: "Content created !",
        data: contentData,
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
        success: true,
        message: "Content Found",
        data: contentData,
       
    })

};

export const  tellMoreAboutCard = async (req,res)=>{
        const data = req.body.data ;
  
        
        const prompt = {
            brain : data ,
            preInfo : moreAboutCard,
            query : "tell me about my card"
        }
        const response = await main(prompt) ;

        return res.status(200).json({
            success : true ,
            data : response ,

        })

}   


export const getAllContent = async (req, res) => {
    
    const userId = req.user._id;
    // console.log(userId) 
    

    const contentData = await Content.find({
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
        success: true,
        message: "Content Found",
        data: contentData
    })

};


export const deleteContent = async (req,res)=>{
    const contentId = req.params._id ;
    const userId = req.user._id

    const content = await Content.deleteOne({_id : contentId, user : userId},{
        user : 0,
        embeddings : 0
    })
   


    return res.status(200).json({
        success : true ,
        message : "Content deleted Sucessfully" ,
        data : content
    })
}

export const updateContent = async (req,res)=>{
    const { title, content, tags } = req.body;
    const contentId = req.params._id ;
    const userId = req.user._id ;



    const contentData = await Content.findByIdAndUpdate({
        _id : contentId
    }, {
        $set : {
            title : title ,
            content : content ,
            tags :tags,
            user : userId 

        }
    }, {
        new : true,
        
        projection: { user: 0, embeddings: 0 }, // 
    },)
 
    return res.status(200).json({
        success: true ,
        message : "Updated Sucessfully",
        data : contentData
       
    })
}