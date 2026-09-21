import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import {FiEdit2} from "react-icons/fi"
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useDeleteUsersMutation, useGetAllUsersQuery, useUpdateUsersMutation } from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam: boolean;
}

const AllUsers:FC<Props> = ({isTeam}) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive]= useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] = useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery({},{refetchOnMountOrArgChange: true});
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUsersMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if(deleteError){
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  },[updateError, isSuccess, deleteSuccess,deleteError]);

  const handleDelete= async()=>{
  const id= userId;
  await deleteUser(id);
}

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Coures", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
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
              setUserId(params.row.id)
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
    {
      field: "  ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
      return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <a href={`mailto:${params.row.email}`}>
        <AiOutlineMail className="dark:text-white text-black" size={20} />
      </a>
    </Box>
  );
},
    },
  ];
 
  const rows:any = [];

  if(isTeam){
    const newData= data && data.users.filter((item:any)=>item.role === "admin");
    newData && newData.forEach((item:any)=>{
        rows.push({
            id:     item._id,
            name:   item.name,
            email:  item.email,
            role:   item.role,
            courses:item.courses.length,
            created_at:format(item.createdAt)
        })
    })
  }else{
     data && data.users.forEach((item:any)=>{
        rows.push({
            id:item._id,
            name:item.name,
            email:item.email,
            role:item.role,
            courses:item.courses.length,
            created_at:format(item.createdAt)
        })
    })
  }
  

  return (
    <div className="mt-[120px]">
    {
        isLoading ?(
            <Loader/>
        ):(
          
     <div>
   <Box sx={{ m: "20px" }}>
    <div className="w-full flex justify-end">
      <div className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]` }
      onClick={()=> setActive(!active)}
      >
         Add New Member
      </div>
    </div>
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
        Are you sure you want to delete this user?
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
  )
}

export default AllUsers