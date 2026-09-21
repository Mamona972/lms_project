import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import {FiEdit2} from "react-icons/fi"
import { useDeleteCoursesMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {}

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const {isLoading,data, refetch}=useGetAllCoursesQuery({}, {refetchOnMountOrArgChange: true});
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [deleteCourse,{isSuccess,error}]=useDeleteCoursesMutation({})

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: .5 },
    { field: "purchased", headerName: "Purchased", flex: .5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
               <Link href={`/admin/edit-course/${params.row.id}`}>
              <FiEdit2
                className="dark:text-white text-black"
                size={20}
              />
            </Link>
           </Box>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
             onClick={()=>{
              setOpen(!open);
              setCourseId(params.row.id)
            }}
            >
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];
 
  const rows:any=[];

  {
    data && data.courses.forEach((item:any)=>{
        rows.push({
            id:item._id,
            title:item.name,
            purchased:item.purchased,
            ratings:item.ratings,
            created_at:format(item.createdAt)
        })
    })
  }
  
useEffect(()=>{
  if(isSuccess){
    refetch();
    setOpen(false);
    toast.success("Course deleted sccessfully")
  }
  if(error){
    if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
  }
},[isSuccess,error])

const handleDelete= async()=>{
  const id= courseId;
  await deleteCourse(id);
}

  return (
    <div className="mt-[120px]">
    {
        isLoading ?(
            <Loader/>
        ):(
          <div>
            <Box sx={{ m: "20px" }}>
  <Box sx={{ m: "40px 0 0 0", height: "80vh" }}>
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      sx={{
        "--DataGrid-containerBackground": theme === "dark" ? "#3e4396" : "#A4A9FC",
        "& .MuiDataGrid-root": {
          border: "none",
          outline: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: theme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
          borderBottom: "none",
          color: theme === "dark" ? "#fff" : "#000",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: theme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
        },
        "& .MuiDataGrid-sortIcon": {
          color: theme === "dark" ? "#fff" : "#000",
        },
        "& .MuiDataGrid-row": {
          color: theme === "dark" ? "#fff" : "#000",
          borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: theme === "dark" ? "#2d325a !important" : "#e0e0e0 !important",
        },
        "& .MuiTablePagination-root": {
          color: theme === "dark" ? "#fff" : "#000",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
        },
        "& .MuiDataGrid-footerContainer": {
          color: theme === "dark" ? "#fff" : "#000",
          borderTop: "none",
          backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
        },
        "& .MuiCheckbox-root": {
          color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `#fff !important`,
        },
        "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: theme === "dark" ? "#2d325a !important" : "#e0e0e0 !important",
        },
        "& .MuiDataGrid-row.Mui-selected:hover": {
        backgroundColor: theme === "dark" ? "#3a4070 !important" : "#d5d5d5 !important",
        },
      }}
    />
  </Box>
</Box>

{open && (
  <Modal
    open={open}
    onClose={() => setOpen(!open)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 
      w-[90%] max-w-[400px] bg-[#0f1420] dark:bg-[#0f1420] 
      rounded-[16px] p-8 shadow-2xl outline-none"
    >
      <h1 className="text-white text-[20px] font-[700] font-Poppins text-center leading-[28px] mb-8">
        Are you sure you want to delete this course?
      </h1>
      <div className="flex w-full items-center justify-between gap-4">
        <button
          className="flex-1 h-[45px] rounded-full bg-[#3ecf8e] hover:bg-[#34b87c] 
          text-white font-[600] font-Poppins text-[15px] transition duration-200"
          onClick={() => setOpen(!open)}
        >
          Cancel
        </button>
        <button
          className="flex-1 h-[45px] rounded-full bg-[#f04452] hover:bg-[#d93a47] 
          text-white font-[600] font-Poppins text-[15px] transition duration-200"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </Box>
  </Modal>
)}
</div>
  )
}
</div>
  )}

export default AllCourses