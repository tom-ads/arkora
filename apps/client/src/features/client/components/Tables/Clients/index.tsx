import {
  Button,
  FormatDateTime,
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'
import { useGetClientsQuery } from '../../../api'

type ClientsTableProps = {
  onCreate: () => void
}

export const ClientsTable = ({ onCreate }: ClientsTableProps): JSX.Element => {
  const navigate = useNavigate()

  const { data: clients, isLoading } = useGetClientsQuery()

  return (
    <TableContainer
      className="min-h-[738px]"
      emptyState={{
        isEmpty: !clients?.length && !isLoading,
        icon: <UserIcon />,
        title: 'Clients',
        btnText: 'Create Client',
        onClick: onCreate,
        description:
          'Add a client to create projects and budgets used in tracking time and monitoring costs',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[350px]" first>
              NAME
            </TableHeading>
            <TableHeading className="w-[50px]">Created</TableHeading>
            <TableHeading className="w-[10px]" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableData>
                <span className="text-gray-80 font-medium">{client.name}</span>
              </TableData>

              <TableData>
                <FormatDateTime value={client.createdAt} format={DateTime.DATE_MED} />
              </TableData>

              <TableData>
                <Button variant="blank" onClick={() => navigate(`/clients/${client.id}`)}>
                  Manage
                </Button>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
