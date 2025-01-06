import DashboardIcon from "@mui/icons-material/Dashboard";
import EuroIcon from "@mui/icons-material/Euro";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import HomeIcon from "@mui/icons-material/Home";
import Cog from "mdi-material-ui/Cog";
import { AccountMultiple, ListBox, PackageVariant } from "mdi-material-ui";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from '@mui/icons-material/Paid';
const Navigation = () => {
  return [
    {
      path: "",
      icon: HomeIcon,
      title: "Accueil",
    },
    {
      icon: Cog,
      title: "Configuration",
      items: [
        {
          path: "configuration-Societe",

          title: "Configuration-Société",
          allowedRols :['ADMIN']

        },

        {
          path: "tva",

          title: "Gestion des TVA",
          allowedRols :['ADMIN']

        },
        {
          path: "gestion-des-utilisateurs",

          title: "Gestion des utilisateurs",
          allowedRols :['ADMIN']

        },
      ],
    },
    {
      icon: AccountMultiple,
      title: "Gestion compte tiers",
      items: [
        {
          path: "comptes-Clients",

          title: "Comptes Clients",
          allowedRols :['ADMIN',"COMMERCIALE"]

        },

        {
          title: "Comptes fournisseurs",

          path: "comptes-fournisseurs",
          allowedRols :['ADMIN',"COMMERCIALE"]

        },
      ],
    },
    
    {
      icon: ListBox,
      title: "Activités",
      items: [
        {
          path: "gestion-des-activités",

          title: "Gestion des activités",
          allowedRols :['ADMIN']

        },
      ],
    },
    {
      icon: PackageVariant,
      title: "Stock",
      items: [
        {
          path: "gestion-des-entrepots",

          title: "Gestion des entrepôts",
          allowedRols :['ADMIN','MAGASINIER']

        },

        {
          path: "categories-des-produits",
          title: "Gestion des Catégories",
          allowedRols :['ADMIN','MAGASINIER']

        },
        {
          path: "gestion-des-produits",
          title: "Gestion des produits",
          allowedRols :['ADMIN','MAGASINIER']

        },
        {
            path: 'list-bon-de-sortie-stock',
            title: 'Mouvement stock',
            allowedRols :['ADMIN',"MAGASINIER"]

        },
        {
          path: "produit-fini",

          title: "Produits fini",
          allowedRols :['ADMIN','COMMERCIALE']//,"MAGASINIER"

        }
        // {
        //     path: 'commande-interne',
        //     title: 'Commande Interne',
        // },
        // {
        //     path: 'livraison',
        //     title: 'Gestion de livraison',
        // }
      ],
    },
    {
      icon: ShoppingBasketIcon,
      title: "Achat",
      items: [
        {
          path: "commandes",

          title: "Commandes d’achats",
          allowedRols :['ADMIN','COMMERCIALE' ,"MAGASINIER"]

        },
        
      ],
    },
    {
      icon: StorefrontIcon,
      title: "Vente",
      items: [
       
        {
          path: "commande-vente",

          title: "Commande de vente",
          allowedRols :['ADMIN','COMMERCIALE','RESPONSABLE DE PRODUCTION']

        },
        // {
        //   path: "commandes-direct",
        //   title: "Commandes direct",
        // },
        
        {
          path: "devis",
          allowedRols :['ADMIN','COMMERCIALE'],
          title: "Devis",
        },
      ],
    },
    {
      icon: ReceiptLongIcon,
      title: "Factures",
      items: [
        {
          path: "factures-commande-vente",

          title: "Factures de vente",
          allowedRols :['ADMIN','COMPTABLE']

        },
        {
          path: "factures-commande-achat",

          title: "Factures d'achat",
          allowedRols :['ADMIN','COMPTABLE']

        },
      ],
    },
    {
      icon: PaidIcon,
      title: "Paiements",
      items: [
        {
          path: "paiement-commande-achat",

          title: "Paiements d'achat",
          allowedRols :['ADMIN','COMPTABLE']

        },
        {
          path: "paiements",

          title: "Paiements de vente",
          allowedRols :['ADMIN','COMPTABLE']

        }
      ],
    }
  ];
};

export default Navigation;
