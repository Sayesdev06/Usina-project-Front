import * as actionsTypes from "./actionsTypes";
import Url from "../constants/Url";
import axios from "axios";
import Cookies from "js-cookie";

// Product

export const createProduct = (data) => {
  return async (dispatch) => {
    console.log(data);
    try {
      await Url.Url2.post(`createProduct`, {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        unitId: data.unitId,
        piecesNumber: data.piecesNumber,
      })
        .then((response) => {
          if (response.status === 200) {
            data.getAllProduct();
            data.afterSave();
            data.onCloseModalAddProduct();
            data.handleClickVariant("Produit bien crée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const EditProduct = (data) => {
  return async (dispatch) => {
    console.log("data", data);
    try {
      await Url.Url2.put(`updateProduct/?id=${data.id}`, {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
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

export const deleteProduct = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.delete(`deleteProduct?id=${data.id}`)
        .then((res) => {
          data.getAllProduct();
          data.handleClickVariant("Produit bien supprimé!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getDetailsProduct = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`getProductById/?id=${data.id}`)
        .then((response) => {
          const resData = response.data;

          data.attributeProduct({
            id: resData.id,
            name: resData.name,
            description: resData.description,
            categoryId: resData.category.id,
            unitId: resData.unit.id,
            piecesNumber: resData.piecesNumber,
          });
          // data.listCategories(categoriesId);
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchProduct = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`searchProduct`, {
        params: {
          name: data.name,
          categoryId: data.categoryId,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_PRODUCT,
            payload: { arrayAllProduct: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllUnits = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`getAllUnits`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_UNITS,
            payload: { arrayAllUnits: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

// Category

export const createCategory = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`createCategory`, {
        name: data.name,
        description: data.description,
        type: data.type,
      })
        .then((res) => {
          if (res.status === 200) {
            data.getAllCategories();
            data.afterSave();
            data.onCloseModalAddCategory();
            data.handleClickVariant("Catégories bien Crée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateCategory = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.put(`updateCategory/?id=${data.id}`, data)
        .then((res) => {
          data.onCloseModalAddCategory(false);
          data.afterSave();
          data.getAllCategories();
          data.handleClickVariant("Catégories bien modifiée!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteCategory = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.delete(`deleteCategory?id=${data.id}`)
        .then((res) => {
          data.getAllCategories();
          data.handleClickVariant("Catégories bien supprimée!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getDetailsTCategory = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`getCategoryById/?id=${data.id}`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_DETAILS_CATEGORY,
          });
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchCategory = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`searchCategory`, {
        params: {
          name: data.name,
          type: data.type,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_CATEGORY,
            payload: { arrayAllCatgories: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllCategorys = () => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`getAllCategorys`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_CATEGORY,
            payload: { arrayAllCatgories: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

// warehouse

export const createEnterpot = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`createWarehouse`, {
        name: data.name,
        address: data.address,
        city: data.city,
        street: data.street,
      })
        .then((res) => {
          if (res.status === 200) {
            data.getAllEnterpot();
            data.afterSave();
            data.onCloseModalAddEnterpot();
            data.handleClickVariant("Entrepôt bien Crée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateEnterpot = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.put(`updateWarehouse/?id=${data.id}`, {
        name: data.name,
        address: data.address,
        city: data.city,
        street: data.street,
      })
        .then((res) => {
          data.onCloseModalAddEnterpot(false);
          data.afterSave();
          data.getAllEnterpot();
          data.handleClickVariant("Entrepôt bien modifié!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteEnterpot = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.delete(`deleteWarehouse?id=${data.id}`)
        .then((res) => {
          data.getAllEnterpot();
          data.handleClickVariant("Entrepôt bien supprimé!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getDetailsTEnterpot = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`getWarehouseById/?id=${data.id}`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_DETAILS_CATEGORY,
          });
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchEnterpot = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`searchWarehouse`, {
        params: {
          name: data.name,
          city: data.city,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_WAREHOUSE,
            payload: { arrayAllWareHouse: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

// Category

export const createActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`createActivity`, {
        name: data.name,
        description: data.description,
      })
        .then((res) => {
          if (res.status === 200) {
            data.afterSave();
            data.handleClickVariant("Activité bien Crée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.put(`updateActivity/?id=${data.id}`, {
        name: data.name,
        description: data.description,
      })
        .then((res) => {
          data.afterSave();
          data.handleClickVariant("Activité bien modifiée!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.delete(`deleteActivity?id=${data.id}`)
        .then((res) => {
          data.getAllActivity();
          data.handleClickVariant("Activité bien supprimée!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getDetailsTActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.post(`getActivityById/?id=${data.id}`)
        .then((res) => {})
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`searchActivity`, {
        params: {
          name: data.name,
        },
      })
        .then((res) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_ACTIVITY,
            payload: { arrayAllActivity: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllActivity = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`getAllActivitys`)
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_ACTIVITY,
            payload: { arrayAllActivity: res.data },
          });
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllDetailsProduct = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.get(`getAllDetailsProduct/?id=${data.id}`)
        .then((response) => {
          if (data.setLoading) {
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_FULL_DETAILS_PRODUCT,
            payload: response.data,
          });
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateElement = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.put(`updateElement?id=${data.id}`, {
        value: data.value,
      })
        .then((response) => {
          if (response.status === 200) {
            // data.getAllProduct()
            // data.afterSave()
            // data.onCloseModalAddProduct()
            data.handleClickVariant("Element bien modifiée!", "success");
          }
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteElement = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url2.delete(`deleteElement?id=${data.id}`)
        .then((res) => {
          data.handleClickVariant("Element bien supprimé!", "success");
        })
        .catch((error) => {});
    } catch (error) {
      console.error(error);
    }
  };
};
