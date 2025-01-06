import * as actionsTypes from "./actionsTypes";
import Url from "../constants/Url";
import axios from "axios";
import Cookies from "js-cookie";

// Product

export const createOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.post(`createOrder`, {
        // expectedDateReceipt: data.expectedDateReceipt,
        expectedDateReceipt: data.expectedDateReceipt,
        amountHt: data.amountHt,
        amountTtc: data.amountTtc,
        vendorId: data.vendorId,
        productData: data.productData,
        orderType: data.orderType,
      })
        .then((response) => {
          if (response.status === 200) {
            dispatch({ type: actionsTypes.EMPTY_ARRAY_PAYMENT });
            dispatch({
              type: actionsTypes.SET_ORDERID,
              payload: { orderId: response.data.orderId },
            });
            // data.getAllProduct()
            // data.afterSave()
            // data.onCloseModalAddProduct()
            data.handleClickVariant("Commande bien crée!", "success");
            //emptyStateArrayPayment()
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const EditOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.put(`updateProduct/?id=${data.id}`, {
        name: data.name,
        description: data.description,
        categorieIds: data.categories,
        unitId: data.unitId,
        piecesNumber: data.piecesNumber,
      })
        .then((response) => {
          if (response.status === 200) {
            data.getAllProduct();
            data.afterSave();
            data.onCloseModalAddProduct();
            data.handleClickVariant("Produit bien modifiée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

// export const getDetailsOrder = (data) => {
//   return async (dispatch) => {
//     try {
//       await Url.Url3.get(`getProductById/?id=${data.id}`)
//         .then((response) => {
//           const resData = response.data;

//           const categories = resData.categories;
//           let categoriesId = [];

//           const units = resData.units;
//           let unitsId = [];

//           for (let i = 0; i < categories.length; i++) {
//             const element = categories[i];

//             categoriesId.push(element.id);
//           }

//           for (let j = 0; j < units.length; j++) {
//             const element = units[j];
//             unitsId.push(element.id);
//           }
//           data.attributeProduct({
//             id: resData.id,
//             name: resData.name,
//             description: resData.description,
//             categories: categoriesId,
//             unitIds: unitsId,
//             piecesNumber: resData.piecesNumber,
//           });
//           data.listCategories(categoriesId);
//         })
//         .catch((error) => {});
//     } catch (error) {
//       console.error(error);
//     }
//   };
// };

export const searchOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`searchOrder`, {
        params: {
          vendorId: data.vendorId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          expectedDateReceipt: data.expectedDateReceipt,
          orderType: data.orderType,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_ORDER,
            payload: { arrayAllOrder: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchFactureOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`searchFactureOrder`, {
        params: {
          vendorId: data.vendorId,
          status: data.status,
          statusPayment: data.statusPayment,
          id: data.id,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_ORDER,
            payload: { arrayAllOrder: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllOrder = () => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`getAllOrders`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_ORDER,
            payload: { arrayAllOrder: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const sendOrderViaEmail = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`sendOrderViaEmail`, {
        params: {
          id: data.orderId,
        },
      })
        .then((res) => {
          data.handleClickVariant(
            `Votre commande "${res.data.orderId}" a été bien envoyé`,
            "success"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addFactureToOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.post(`addFactureToOrder`, data.formData, {
        params: {
          id: data.orderId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          data.handleClickVariant("facture envoyée", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createPayment = (formData, data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.post(`createPayment`, formData)
        .then((res) => {
          data.handleClickVariant("payment envoyée", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getAllPaymentByOrderId = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`getAllPaymentByOrderId`, {
        params: {
          id: data,
        },
      })
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_PAYMENT_BY_ORDERID,
            payload: { arrayPayment: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getOrderById = (data, setLoading) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`getOrderById`, {
        params: {
          id: data,
        },
      })
        .then((response) => {
          if (setLoading) {
            setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ORDER_BY_ID,
            payload: { order: response.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.put(`updateOrder?id=${data.orderId}`, {
        productData: data.productData,
      })
        .then((response) => {
          data.handleClickVariant("order Updated", "success");
          getTheOrder(dispatch, data.orderId);
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteProductFromOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.delete(
        `deleteProductFromOrder?orderId=${data.orderId}&productId=${data.productId}`
      )
        .then((response) => {
          data.handleClickVariant("Produit supprimé", "success");
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllPaymentOrder = (data, setLoading) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(`getAllPaymentOrder`, {
        params: {
          orderId: data.orderId,
          vendorId: data.vendorId,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type.join(","),
          orderType: data.orderType,
        },
      })
        .then((res) => {
          if (setLoading) {
            setLoading(false);
          }
          dispatch({
            type: actionsTypes.GET_ALL_PAYMENT_ORDER,
            payload: res.data,
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

const getTheOrder = async (dispatch, id) => {
  await Url.Url3.get(`getOrderById`, {
    params: {
      id: id,
    },
  })
    .then((response) => {
      dispatch({
        type: actionsTypes.GET_ORDER_BY_ID,
        payload: { order: response.data },
      });
    })
    .catch((err) => {});
};

export const deleteOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.delete(`deleteOrder?id=${data.id}`)
        .then((response) => {
          data.handleClickVariant("Commande supprimé", "success");
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deletePayment = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.delete(
        `deletePayment?id=${data.id}${
          data.orderId && `&orderId=${data.orderId}`
        }${data.sellOrderId && `&sellOrderId=${data.sellOrderId}`}`
      )
        .then((response) => {
          getTheOrder(dispatch, data.orderId);
          data.handleClickVariant("Paiement supprimé", "success");
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updatePayment = (formData, data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.post(`updatePayment?id=${data.id}`, formData)
        .then((res) => {
          data.handleClickVariant("payment modifee", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateProductInOrder = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url3.put(
        `updateProductInOrder?productId=${data.productId}&orderId=${data.orderId}`,
        data.attributeProductOrder
      )
        .then((res) => {
          data.handleClickVariant("produit modifee", "success");
          getTheOrder(dispatch, data.orderId);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addRecepetionToProductInOrder = (data, setLoadingBarCodes) => {
  return async (dispatch) => {
    try {
      await Url.Url3.put(`addRecepetionToProductInOrder`, {
        productOrderIds: data.productOrderIds,
        productPieces: data.productPieces,
        orderId: data.orderId,
      })
        .then((response) => {
          if (setLoadingBarCodes) {
            setLoadingBarCodes(false);
          }
          data.handleClickVariant("Quantité bien ajouté au stock", "success");
          dispatch({
            type: actionsTypes.CODABARS_IMAGES,
            payload: response.data,
          });
          getTheOrder(dispatch, data.orderId);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProductCodeAbars = (data, setLoadingBarCodes) => {
  return async (dispatch) => {
    try {
      await Url.Url3.get(
        `getProductCodeAbars?orderId=${data.orderId}&productId=${data.productId}`
      )
        .then((response) => {
          if (setLoadingBarCodes) {
            setLoadingBarCodes(false);
          }
          dispatch({
            type: actionsTypes.CODABARS_IMAGES,
            payload: response.data,
          });
          //getTheOrder(dispatch,data.orderId)
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const emptyStateDelivery = () => {
  return (dispatch) => {
    dispatch({ type: actionsTypes.EMPTY_STATE });
  };
};

export const emptyState = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: actionsTypes.EMPTY_STATE });
    }, 1000);
  };
};

export const emptyStateArrayPayment = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: actionsTypes.EMPTY_ARRAY_PAYMENT });
    }, 1000);
  };
};
