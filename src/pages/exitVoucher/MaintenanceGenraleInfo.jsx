import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Divider,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextareaAutosize,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";

function MaintenanceGenraleInfo(props) {
  const dispatch = useDispatch();

  const arrayAllUser = useSelector((state) => state.userServices.arrayAllUsers);

  useEffect(() => {
    const data = {
      firstName: "",
      login: "",
      poste: "",
      // permissionId: "",
    };
    dispatch(actionCreator.getAllUsers(data));
  }, []);

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082/static/file/" + fileUrl, "_blank");
  };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    //return array[array.length - 1];
    openFile(array[array.length - 1]);
  };

  const factureMaintenance = () => {
    const data = {
      id: props.maintenance.id,
      openFile,
    };
    dispatch(actionCreator.factureMaintenance(data));
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <Grid container sx={{ p: 4 }} spacing={4}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <Typography
              variant="body2"
              className="color-title-1"
              sx={{ fontWeight: 600, mb: 2, mr: 1 }}
            >
              Machine
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={props.maintenance.machine}
              disabled={props.source && props.source === "details"}
              onChange={(e) =>
                props.handleStateMaintenance("machine", e.target.value)
              }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <Typography
              variant="body2"
              className="color-title-1"
              sx={{ fontWeight: 600, mb: 2, mr: 1 }}
            >
              Utilisateur
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={props.maintenance.userId}
                onChange={(e) =>
                  props.handleStateMaintenance("userId", e.target.value)
                }
                disabled={props.source && props.source === "details"}
              >
                {arrayAllUser &&
                  arrayAllUser.map((user, key) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "start", gap: "15px" }}
          >
            <Typography
              variant="body2"
              className="color-title-1"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Probléme
            </Typography>
            <TextareaAutosize
              fullWidth
              minRows={5}
              value={props.maintenance.issue}
              disabled={props.source && props.source === "details"}
              className="text-area-style"
              onChange={(e) =>
                props.handleStateMaintenance("issue", e.target.value)
              }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "start", gap: "15px" }}
          >
            <Typography
              variant="body2"
              className="color-title-1"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Intervention
            </Typography>
            <TextareaAutosize
              fullWidth
              minRows={5}
              value={props.maintenance.intervention}
              disabled={props.source && props.source === "details"}
              className="text-area-style"
              onChange={(e) =>
                props.handleStateMaintenance("intervention", e.target.value)
              }
            />
          </Grid>
        </Grid>

        <div className="d-flex justify-content-end m-2">
          {props.maintenance.id && (
            <button
              //factureDeliveryOrder}
              onClick={() => factureMaintenance()}
              className="btn- bg-primary py-2 px-3 rounded-lg"
              style={{ color: "#000" }}
            >
              Bon de maintenance
            </button>
          )}
        </div>
      </Paper>

      <div className="d-flex justify-content-end my-5">
        <button
          className="btn- bg-primary py-2 px-3 rounded-lg"
          style={{ color: "#000" }}
          onClick={() => props.handleSelectedItem("Pièce de rechange")}
        >
          Suivant
        </button>
      </div>
    </>
  );
}

export default MaintenanceGenraleInfo;
