import BudgetsIcon from '@material-ui/icons/AccountBalanceWalletRounded'
import ProjectsIcon from '@material-ui/icons/HomeWorkRounded'
import ClientsIcon from '@material-ui/icons/SupervisedUserCircleRounded'
import SuppliersIcon from '@material-ui/icons/StoreRounded'
import MaterialsIcon from '@material-ui/icons/LocalMallRounded'
import UnitsIcon from '@material-ui/icons/StraightenRounded'
import PropsIcon from '@material-ui/icons/ViewListRounded';

import Clients from '../pages/Clients'
import Suppliers from '../pages/Suppliers'
import Units from '../pages/Units'
import Materials from '../pages/Materials'
import Projects from '../pages/Projects'
import Budgets from '../pages/Budgets'
import Props from '../pages/Props'
import HistoryIcon from '@material-ui/icons/HistoryRounded';

const items = [
  [ {
      name: 'history',
      label: 'Recientes',
      icon: HistoryIcon,
      page: Budgets,
    },
    {
      name: 'budgets',
      label: 'Presupuestos',
      icon: BudgetsIcon,
      page: Budgets

    },
    {
      name: 'projects',
      label: 'Proyectos',
      icon: ProjectsIcon,
      page: Projects

    },
    {
      name: 'clients',
      label: 'Clientes',
      icon: ClientsIcon,
      page: Clients

    },
  ],
  [
    {
      name: 'materials',
      label: 'Materiales',
      icon: MaterialsIcon,
      page: Materials

    },
    {
      name: 'units',
      label: 'Unidades',
      icon: UnitsIcon,
      page: Units

    },
    {
      name: 'suppliers',
      label: 'Proveedores',
      icon: SuppliersIcon,
      page: Suppliers

    },
  ],
  [
    {
      name: 'materials',
      label: 'Proporciones',
      icon: PropsIcon,
      page: Props

    },

  ]

]

export default items
