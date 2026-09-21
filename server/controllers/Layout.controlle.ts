import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import Cloudinary from "cloudinary";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exist`, 400));
      }
      if (type === "Banner") {
        const { image, title, subtitle } = req.body;
        console.log("🖼️ Image debug:", {
          type: typeof image,
          length: image?.length,
          startsWith: image?.substring(0, 30),
        });
        console.log("before cloud")
        const myCloud = await Cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        console.log("after cloud")
        const banner: any = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subtitle,
          },
        };
        await LayoutModel.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItem });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItem = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItem,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      console.log("❌ FULL ERROR:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

//Edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
if (type === "Banner") {
  const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

  const { image, title, subtitle } = req.body;

  const data = image.startsWith("https")
    ? bannerData
    : await Cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });

  const banner = {
    type: "Banner",
    image: {
      public_id: image.startsWith("https")
        ? bannerData.banner.image.public_id
        : data?.public_id,
      url: image.startsWith("https")
        ? bannerData.banner.image.url
        : data?.secure_url,
    },
    title,
    subtitle,
  };
        await LayoutModel.findByIdAndUpdate(bannerData.id, { banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItem,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItem = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItem,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

//get layout by type
export const getLayoutByTpye = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
