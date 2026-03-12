import React, { useState } from "react";
import {
    Popover,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectedIcon, ChevronDownIcon } from "../icons";
import DropCAM from "../icons/DropDown/DropCAM";
import { useMeetingAppContext } from "../MeetingAppContextDef";

// Styled components
const StyledPopoverButton = styled(Button)(({ theme, isOpen, isHovered, disabled }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "none",
    color: isOpen ? "#FFF" : "#B4B4B4",
    backgroundColor: isOpen ? "#000" : "transparent",
    border: isOpen ? "1px solid #E5E5E5" : "none",
    opacity: disabled ? 0.5 : 1,
    "&:hover": {
        backgroundColor: disabled ? "transparent" : "#000",
        border: disabled ? "none" : "1px solid #E5E5E5",
        color: disabled ? "#B4B4B4" : "#FFF",
    },
    "&:focus": {
        outline: "none",
    },
    "&.Mui-disabled": {
        color: "#B4B4B4",
    },
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
    "& .MuiPaper-root": {
        backgroundColor: "#2D2D2D",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        marginBottom: "8px",
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: "4px 16px 4px 8px",
    color: "#FFF",
}));

export default function DropDownCam({
    webcams,
    changeWebcam,
    selectedWebcam: selectedWebcamProp,
    setSelectedWebcam: setSelectedWebcamProp,
    isCameraPermissionAllowed,
}) {
    const ctx = useMeetingAppContext();

    const setSelectedWebcam = setSelectedWebcamProp ?? ctx?.setSelectedWebcam ?? (() => { });
    const selectedWebcam = selectedWebcamProp ?? ctx?.selectedWebcam ?? {};


    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box sx={{ width: "100%", cursor: isCameraPermissionAllowed === true ? "pointer" : "not-allowed" }}>
            <StyledPopoverButton
                onMouseEnter={() => isCameraPermissionAllowed === true ? setIsHovered(true) : null}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isCameraPermissionAllowed !== true}
                isOpen={open}
                isHovered={isHovered}
                onClick={isCameraPermissionAllowed === true ? handleClick : undefined}
                sx={{ pointerEvents: isCameraPermissionAllowed === true ? "auto" : "none" }}
            >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <DropCAM fillColor={isHovered || open ? "#FFF" : "#B4B4B4"} />
                    <Typography
                        sx={{
                            ml: 3.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                        }}
                    >
                        {isCameraPermissionAllowed === true
                            ? selectedWebcam?.label
                            : "Permission Needed"}
                    </Typography>
                    <ChevronDownIcon
                        style={{
                            marginLeft: "32px",
                            height: "20px",
                            width: "40px",
                            marginTop: "4px",
                            color: open ? "#FFF" : "#B4B4B4",
                        }}
                    />
                </Box>
            </StyledPopoverButton>

            <StyledPopover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        width: anchorEl ? anchorEl.offsetWidth : "auto",
                    },
                }}
            >
                <List sx={{ py: 0 }}>
                    {webcams.map((item, index) => {
                        return (
                            item?.kind === "videoinput" && (
                                <StyledListItem key={`webcams_${index}`} disablePadding>
                                    <Box
                                        sx={{
                                            width: "24px",
                                            mr: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {selectedWebcam?.label === item?.label && (
                                            <SelectedIcon style={{ height: "20px", width: "20px" }} />
                                        )}
                                    </Box>
                                    <ListItemButton
                                        onClick={() => {
                                            setSelectedWebcam((s) => ({
                                                ...s,
                                                id: item?.deviceId,
                                                label: item?.label,
                                            }));
                                            changeWebcam(item?.deviceId);
                                        }}
                                        sx={{ py: 0.5, px: 0 }}
                                    >
                                        <ListItemText
                                            primary={
                                                item?.label ? item?.label : `Webcam ${index + 1}`
                                            }
                                        />
                                    </ListItemButton>
                                </StyledListItem>
                            )
                        );
                    })}
                </List>
            </StyledPopover>
        </Box>
    );
}