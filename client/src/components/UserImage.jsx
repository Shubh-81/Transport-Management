import { Box } from "@mui/material";
import { useState } from "react";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        src={`/assets/${image}`}
      />
    </Box>
  )
};

export default UserImage;
