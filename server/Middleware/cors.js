import cors from 'cors'

const corsOptions={
    origin:["https://share-sphere-common-sharing-point.vercel.app",
            "http://localhost:5173" ,
            "https://share-sphere-common-sharing-point-git-main-harshiis-projects.vercel.app",
            "https://share-sphere-common-sharing-point-cv5l1fqn3-harshiis-projects.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization","Cookie"],
    credentials:true
}

export default cors(corsOptions)