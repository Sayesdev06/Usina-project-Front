import React, { useEffect, useState } from "react";
useDispatch;
import CardTicket from "../../components/CardTicket";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

import { Grid, Typography, Paper } from "@mui/material";
import Loader from "../../components/loader";

const Home = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(actionCreator.getHomeStatistic(setLoading));
  }, []);

  const statistics = useSelector((state) => state.sellOrderReducer.statistics);

  // const openFile = (fileUrl)=>{
  //   window.open("http://127.0.0.1:8082"+fileUrl, '_blank');
  // }

  // const getFileName = (name)=>{
  //   let array = name.split('/')
  //   return array[array.length-1]
  // }

  const goToAddSellOrder = (sellOrderId, source) => {
    navigate("/add-commande-vente", { state: { source, sellOrderId } });
  };

  const goToOrderDetails = (id) => {
    navigate("/commande-details", {
      state: {
        orderId: id,
      },
    });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography sx={{ pb: 1, color: "#000", fontWeight: "600" }}>
            Statistiques de vos commandes :
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Link to="/commande-vente">
              <CardTicket
                ticket="pending"
                totalTickets={statistics.sellOrderCount}
                text="Commandes de vente"
                sellOrderByProductionStatus={
                  statistics.sellOrderByProductionStatus
                }
              />
            </Link>

            <Link to="/commandes">
              <CardTicket
                ticket="total"
                totalTickets={statistics.orderCount}
                text="Commandes d'achats"
                orderBystatusReception={statistics.orderBystatusReception}
              />
            </Link>

            <Link to="/commandes">
              <CardTicket
                ticket="close"
                totalTickets={statistics.devisCount}
                text="Devis"
                devisBystatus={statistics.devisBystatus}
              />
            </Link>

            {/* <CardTicket
          ticket="inProcess"
          totalTickets="130,000"
          text="Tickets en proceso"
        />
        <CardTicket
          ticket="close"
          totalTickets="10,000"
          text="Tickets cerrados"
        /> */}
          </div>

          <Grid container sx={{ mt: 5 }}>
            <div className="d-flex gap-3">
              <div className="flex-column">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Typography sx={{ color: "#000", fontWeight: "600" }}>
                    Dernières commandes client :
                  </Typography>
{/* 
                  <button
                    onClick={() =>
                      navigate("/add-commande-vente", {
                        state: { source: "add", sellOrderId: null },
                      })
                    }
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
                  >
                    + Ajouter
                  </button> */}
                </div>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <div className="flex-col align-items-center justify-content-center">
                    <TableContainer>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Id{" "}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Montant (TND)
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Date de creation{" "}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Status de production
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Status de paiement
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {statistics &&
                            statistics.lastSellOrders &&
                            statistics.lastSellOrders.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id}
                                  onClick={() =>
                                    goToAddSellOrder(row.id, "details")
                                  }
                                >
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    #{row.id}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.amountTtc.toFixed(2)}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {moment(row.createdAt).format(
                                      "DD/MM/YYYY"
                                    )}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.statusProduction}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.statusPayment}
                                  </TableCell>

                                  <TableCell
                                    sx={{ color: "#3a3541ad" }}
                                  ></TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* <div className="see-more">
                      <Link to="/commandes">Voir plus</Link>
                    </div> */}
                  </div>
                </Paper>
              </div>

              <div className="flex-column">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Typography sx={{ color: "#000", fontWeight: "600" }}>
                    Dernières commandes fournisseur :
                  </Typography>

                  {/* <button
                    onClick={() => navigate("/add-commande")}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
                  >
                    + Ajouter
                  </button> */}
                </div>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <div className="flex-col align-items-center justify-content-center">
                    <TableContainer>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Id{" "}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Montant (TND)
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Date de creation{" "}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Status
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#3a3541de",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              Status de paiement
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {statistics &&
                            statistics.lastOrders &&
                            statistics.lastOrders.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id}
                                  onClick={() => goToOrderDetails(row.id)}
                                >
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    #{row.id}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.amountTtc.toFixed(2)}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {moment(row.createdAt).format(
                                      "DD/MM/YYYY"
                                    )}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.status}{" "}
                                  </TableCell>
                                  <TableCell sx={{ color: "#3a3541ad" }}>
                                    {" "}
                                    {row.statusPayment}
                                  </TableCell>

                                  <TableCell
                                    sx={{ color: "#3a3541ad" }}
                                  ></TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* <div className="see-more">
                      <Link to="/commandes">Voir plus</Link>
                    </div> */}
                  </div>
                </Paper>
              </div>
            </div>
          </Grid>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getAllOfSampleDetails: (dataEdit) => dispatch(actionCreator.getAllOfSampleDetails(dataEdit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
