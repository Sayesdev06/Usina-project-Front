import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from "js-cookie";


// setupCompany

export const createCompany = (data) => {

  return async (dispatch) => {
    try {


      await Url.Url1.post(`createCompany`,
        {
          name: data.name,
          address: data.address,
          city: data.city,
          country: data.country,
          email: data.email,
          phoneNumber: data.phoneNumber,
          tvaNumber: data.tvaNumber,
          registrationNumber: data.registrationNumber
        }
      )
        .then((response) => {
          if (response.status === 200) {
            data.getAllDetailsCompany()
            data.handleClickVariant("Société bien configuré!", "success")
          }
        })
        .catch(error => {
          console.log("firsterr", error)
        })

    }
    catch (error) {
      console.log("firsterrcvcv", error)
      console.error(error);
    }
  }
}

export const EditCompany = (data) => {

  return async (dispatch) => {
    try {


      await Url.Url1.put(`updateCompany/?id=${data.id}`,
        {
          name: data.name,
          address: data.address,
          city: data.city,
          country: data.country,
          email: data.email,
          phoneNumber: data.phoneNumber,
          tvaNumber: data.tvaNumber,
          registrationNumber: data.registrationNumber
        }
      )
        .then((response) => {

          if (response.status === 200) {
            data.getAllDetailsCompany()
  
            data.handleClickVariant("Société bien modifiée!", "success",)

          }
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }
}

export const getDetailsCompany = (data) => {

  return async (dispatch) => {
    try {


      await Url.Url1.get(`getCompany`,
      )
        .then((response) => {

          if (response.status === 200) {

            data.setHasCompany(true)
            data.attributeCompany(response.data)
          
          } else {
            data.setHasCompany(false)
            dispatch({
              type: actionsTypes.GET_DETAILS_COMPANY,
              payload: {
                message: response.data.message
              }
            })
            
          }
        })
        .catch(error => {

          dispatch({
            type: actionsTypes.GET_DETAILS_COMPANY,
            payload: {
              message: error.response.data.message
            }
          })
        })
        data.setLoading(false)
        
    }
    catch (error) {

      console.error(error);
    }
  }
}


// TVA

export const createTva = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url1.post(`createTva`, {
        name: data.name,
        percentage: data.percentage,
      }
      )
        .then((res) => {
          if (res.status === 200) {
            data.openModal(false)
            data.getALLTvas()
            data.afterSave()
            data.handleClickVariant("Tva bien Crée!", "success",)
            dispatch({
              type: actionsTypes.CREATE_TVA,
            })
          }

        }
        )
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("Le pourcentage doit être un nombre!", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const updateTva = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.put(`updateTva/?id=${data.id}`,
        data
      )
        .then((res) => {
          data.openModal(false)
          data.afterSave()
          data.getALLTvas()
          data.handleClickVariant("Tva bien modifiée!", "success",)
        }
        )
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("Le pourcentage doit être un nombre!", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const deleteTva = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.delete(`deleteTva?id=${data.id}`
      )
        .then((res) => {
          data.getALLTvas()
          data.handleClickVariant("Tva bien supprimée!", "success",)
        }
        )
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const getDetailsTva = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url1.post(`getTvaById`, data
      )
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_DETAILS_TVA,
          })
        }
        )
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }
};

export const getAllTva = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url1.get(`searchTva`, {
        params: {
          name: data.name,
          percentage: data.percentage
        },
      })
        .then((res) =>{
         
          dispatch({
            type: actionsTypes.GET_ALL_TVA,
            payload: { arrayAllTva: res.data }
          })
         if(data.setLoading){
          data.setLoading(false)
         }
            
          
      })
        .catch((err) => {

        });
    }
    catch (error) {

      console.error(error);
    }
  }

};


//user
export const createUser = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.post(`createUser`, {
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.login,
        password: data.password,
        poste: data.poste,
        // permissionIds: data.permissionIds,
      }
      )
        .then((res) => {

          if (res.status === 200) {
            data.openModalAddUser(false)
            data.getAllUsers()
            data.afterSave()
            data.handleClickVariant("Utilisateur bien crée!", "success",)
            dispatch({
              type: actionsTypes.CREATE_USER,
            })
          }


        }
        )
        .catch(error => {
          if (error.response.status === 404) {
            data.handleClickVariant("Le login existe déjà!", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};
export const updateUser = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.put(`updateUser/?id=${data.id}`,data
      )
        .then((res) => {
          if (res.status === 200) {

            data.afterSave()
            data.getAllUsers()
            data.handleClickVariant("Utilisateur bien modifée!", "success",)
            dispatch({
              type: actionsTypes.UPDATE_USER,
            })
          }
        })
        .catch(error => {
          if (error.response.status === 404) {
            data.handleClickVariant("Le login existe déjà!", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const deleteUser = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.delete(`deleteUser?id=${data.id}`
      )
        .then((res) => {

          data.getAllUsers()
          data.handleClickVariant("Utilisateur bien supprimée!", "success",)
        }
        )
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};
export const getDetailsUser = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.post(`getUserById`,
      data
      )
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_DETAILS_USER,
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};
export const getAllUsers = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.get(`searchUser`, { 
        params: {
          firstName: data.firstName,
          login: data.login,
          poste: data.poste,
          // permissionId: data.permissionId
        },
      }
      )
        .then((res) => {
          if(data.setLoading){
            data.setLoading(false)
          }
          
          const resData = res.data
          let arrayPostes = []
          for (let i = 0; i < resData.length; i++) {
            const element = resData[i];
            arrayPostes.push(element.poste)
          }
          dispatch({
            type: actionsTypes.GET_ALL_USER,
            payload: {
              arrayAllUsers: res.data,
              arrayAllPostes: arrayPostes
            }
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }


};


// CLIENT

export const createClient = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.post(`createClient`, { 
        fullname: data.fullname,
        type: data.type,
        tvaNumber: data.tvaNumber,
        registrationNumber: data.registrationNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        phoneNumber: data.phoneNumber,
        contactPhoneNumber: data.contactPhoneNumber,
        email: data.email,
        contactEmail: data.contactEmail,
        tvaId: data.tvaId
      }
      )
        .then((res) => {
          if (res.status === 200) {
            data.handleClickVariant("Clien bien crée!", "success",)

            data.onCloseModalAddTiers()
            data.afterSave()
            data.getALLList()

              dispatch({
            type: actionsTypes.CREATE_CLIENT,
          })
          }
        
        })
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("L'email doit être un email valide", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }
};

export const updateClient = (data) => {


  return async (dispatch) => {
    try {
      await Url.Url1.put(`updateClient/?id=${data.id}`, {
        fullname: data.fullname,
        type: data.type,
        tvaNumber: data.tvaNumber,
        registrationNumber: data.registrationNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        phoneNumber: data.phoneNumber,
        contactPhoneNumber: data.contactPhoneNumber,
        email: data.email,
        contactEmail: data.contactEmail
      }
      )
        .then((res) => {
          if (res.status === 200) {
            data.handleClickVariant("Client bien modifée!", "success",)
            data.onCloseModalAddTiers()
            data.afterSave()
            data.getALLList()
            dispatch({
              type: actionsTypes.UPDATE_CLIENT,
            })
          }


        })
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("L'email doit être un email valide", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const deleteClient = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.delete(`deleteClient?id=${data.id}`,
      )
        .then((res) => {
          data.getAllUsers()
          data.handleClickVariant("Client bien supprimée!", "success",)
        }
        )
        .catch(error => {
          if(error.response.status ===403){
            data.handleClickVariant("Vous ne pouvez pas supprimer ce client", "error")
          }
          
        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const getDetailsClient = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.post(`getClientById`, data
      )
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_DETAILS_CLIENT,
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }
};

export const getAllClient = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.get(`searchclient`, {
        params: {
          fullname: data.fullname,
          email: data.email,
          country: data.country,
          type: data.type
        },
      }
      )
        .then((res) => {
          if(data.setLoading){
            data.setLoading(false);
          }

          dispatch({
            type: actionsTypes.GET_ALL_CLIENT,
            payload: { arrayAllClient: res.data }
          })
        }
        )
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};




// PROVIDER

export const createProvider = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.post(`createVendor`, {
        fullname: data.fullname,
        type: data.type,
        tvaNumber: data.tvaNumber,
        registrationNumber: data.registrationNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        phoneNumber: data.phoneNumber,
        contactPhoneNumber: data.contactPhoneNumber,
        email: data.email,
        contactEmail: data.contactEmail,
        tvaId: data.tvaId
      }
      )
        .then((res) => {
          if (res.status === 200) {
            data.onCloseModalAddTiers()
            data.afterSave()
            data.handleClickVariant("Fournisseur bien crée!", "success",)

            data.getALLList()
 dispatch({
            type: actionsTypes.CREATE_PROVIDER,
          })
          }
         
        })
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("L'email doit être un email valide", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }
};

export const updateProvider = (data) => {
  return async (dispatch) => {
    try {
      await Url.Url1.put(`updateVendor/?id=${data.id}`,data
      )
        .then((res) => {

          if (res.status === 200) {
            data.handleClickVariant("Fournisseur bien modifée!", "success",)
            data.onCloseModalAddTiers()
            data.afterSave()
            data.getALLList()
            dispatch({
              type: actionsTypes.UPDATE_PROVIDER,
            })
          }


        }
        )
        .catch(error => {
          if (error.response.status === 400) {
            data.handleClickVariant("L'email doit être un email valide", "error",)

          }
        })

    }
    catch (error) {

      console.error(error);
    }
  }
};

export const deleteProvider = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.delete(`deleteVendor?id=${data.id}`
      )
        .then((res) => {

          data.getAllProvider()
          data.handleClickVariant("Fournisseur bien supprimée!", "success",)
        }
        )
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

export const getDetailsProvider = (data) => {
  axios
    .post(`${Url.Url1}/getVendorById`,data)
    .then((res) =>


      dispatch({
        type: actionsTypes.GET_DETAILS_PROVIDER,
      })
    )
    .catch((err) => {

    });
  return async (dispatch) => {
    try {
      await Url.Url1.post(`createVendor`, {
        fullname: data.fullname,
        type: data.type,
        tvaNumber: data.tvaNumber,
        registrationNumber: data.registrationNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        phoneNumber: data.phoneNumber,
        contactPhoneNumber: data.contactPhoneNumber,
        email: data.email,
        contactEmail: data.contactEmail
      }
      )
        .then((res) => {
          if (res.status === 200) {
            data.onCloseModalAddTiers()
            data.afterSave()

            data.getALLList()

          }
          dispatch({
            type: actionsTypes.CREATE_PROVIDER,
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }
};
export const getAllVendors = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.get(`getAllVendors`, {
      }
      )
        .then((res) => {
          dispatch({
            type: actionsTypes.GET_ALL_PROVIDER,
            payload: { arrayAllProvider: res.data }
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};
export const getAllProvider = (data) => {

  return async (dispatch) => {
    try {
      await Url.Url1.get(`searchVendor`, {
        
        params: {
          fullname: data.fullname,
          email: data.email,
          country: data.country,
          type: data.type,
        },
      }
      )
        .then((res) => {
          if(data.setLoading){
            data.setLoading(false);
          }
          dispatch({
            type: actionsTypes.GET_ALL_PROVIDER,
            payload: { arrayAllProvider: res.data }
          })
        })
        .catch(error => {

        })

    }
    catch (error) {

      console.error(error);
    }
  }

};

// 

// export const getAllPermession = (data) => {

//   return async (dispatch) => {
//     try {
//       await Url.Url1.get(`getAllPermission`
//       )
//         .then((res) => {
//           dispatch({
//             type: actionsTypes.GET_ALL_PERMISSION,
//             payload: res.data
//           })
//         })
//         .catch(error => {

//         })

//     }
//     catch (error) {

//       console.error(error);
//     }
//   }
// };