import mongoose, {Document, Model, Schema} from "mongoose"

export interface INotification extends Document{
    title:String;
    message:string;
    status:string;
    userId:string;
    createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    title:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"unread"
    },
     userId: {
      type: String,
      required: true,
    },
},{timestamps:true});

const NotificationModel: Model<INotification>= mongoose.model("notification",notificationSchema);
export default NotificationModel;