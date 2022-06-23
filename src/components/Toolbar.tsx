import React from "react";
import Typography from "@mui/material/Typography";
import { default as MUIToolbar } from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import UploadIcon from "@mui/icons-material/Upload";
import { DOWNLOAD_FILE_INPUT } from "../pages/graph/common/constants";
import { InputLabel } from "@mui/material";

export default function Toolbar({ handleOpen, open, getYAMLFile }: any) {
  return (
    <MUIToolbar>
      <Typography variant='h6' noWrap sx={{ flexGrow: 1 }} component='div'>
        Визуализация зависимостей в EMRM-API
      </Typography>
      <input
        type='file'
        id={DOWNLOAD_FILE_INPUT}
        multiple
        onChange={getYAMLFile}
        hidden
      />
      <InputLabel
        htmlFor={DOWNLOAD_FILE_INPUT}
        style={{
          position: "fixed",
          right: "84px",
          height: "24px",
          cursor: "pointer",
          color: "#000",
        }}
      >
        <UploadIcon />
      </InputLabel>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        edge='end'
        onClick={handleOpen}
        sx={{ ...(open && { display: "none" }) }}
        style={{ position: "fixed", right: "34px" }}
      >
        <MenuIcon />
      </IconButton>
    </MUIToolbar>
  );
}
