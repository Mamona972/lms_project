import { styles } from "@/app/styles/style";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {refetchOnMountOrArgChange: true});
  const [editLayout, {isLoading, isSuccess, error}]= useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title);
      setSubtitle(data?.layout?.banner?.subtitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if(isSuccess){
        refetch();
        toast.success("Hero updated successfully");
        
    }
    if(error){
        if("data" in error){
            const errorData= error as any;
            toast.error(errorData?.data?.message)
            }
    }
  }, [data]);

  const handleUpdate =  (e:any) => {
   const file= e.target.files?.[0];
   if(file){
    const reader= new FileReader();
    reader.onload=(e:any)=>{
        if(reader.readyState === 2){
            setImage(e.target.result as string)
        }
    };
    reader.readAsDataURL(file);
   }
  };

  const handleEdit = async() => {
 await editLayout({
    type:"Banner",
    image,
    title,
    subtitle,
 })
  };

  const isChanged =
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subtitle !== subtitle ||
    data?.layout?.banner?.image?.url !== image;

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center gap-12 relative">

       {/* Image */}
<div className="w-full lg:w-[40%] flex justify-center lg:justify-end shrink-0">

  {/* YOUR BLUE CIRCLE - NO SECOND CIRCLE */}
  <div className="relative w-[320px] h-[320px] rounded-full hero_animation overflow-hidden">

    {image ? (
      <img
        src={image}
        width={400}
        height={400}
        alt="Hero Banner"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-white/50">
        No image
      </div>
    )}

    {/* Image upload */}
    <input
      type="file"
      id="banner"
      accept="image/*"
      onChange={handleUpdate}
      className="hidden"
    />

    {/* Camera button */}
    <label
      htmlFor="banner"
      className="absolute bottom-5 right-5 bg-black/70 hover:bg-black/90 rounded-full p-3 cursor-pointer z-10"
    >
      <AiOutlineCamera className="text-white text-[20px]" />
    </label>

  </div>
</div>

        {/* Text content */}
        <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-start text-center lg:text-left">
          <textarea
            className="dark:text-white text-black text-[28px] lg:text-[42px] font-[600] font-Josefin leading-[36px] lg:leading-[50px] w-full bg-transparent outline-none resize-none"
            placeholder="Improve Your Online Learning Experience Better Instantly"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={3}
          />

          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
            className="dark:text-[#edfff4a1] text-[#000000ac] font-Josefin font-[500] text-[16px] w-full lg:w-[85%] bg-transparent outline-none resize-none mt-4"
            rows={2}
          />

          <button
            disabled={!isChanged}
            className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] text-white mt-8 !rounded ${
              isChanged
                ? "!cursor-pointer bg-[#42d383]"
                : "!cursor-not-allowed bg-[#cccccc34]"
            }`}
            onClick={isChanged ? handleEdit : undefined}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
//Improve Your Online Learning Experience Better Instantly
//We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them.
export default EditHero;