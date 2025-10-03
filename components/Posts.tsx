'use client'

import * as React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Post } from '@prisma/client'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

async function getData(): Promise<Post[]> {
  const res = await fetch('/api/posts')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export const columns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Τίτλος',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'published',
    header: 'Κατάσταση',
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue('published') ? 'Δημοσιευμένο' : 'Πρόχειρο'}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Δημιουργήθηκε στις
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      const formatted = date.toLocaleDateString()
      return <div className="lowercase">{formatted}</div>
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ενημερώθηκε στις
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'))
      const formatted = date.toLocaleDateString()
      return <div className="lowercase">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="noShadow" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post.id)}
            >
              Αντιγραφή ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Προβολή</DropdownMenuItem>
            <DropdownMenuItem>Επεξεργασία</DropdownMenuItem>
            <DropdownMenuItem>Διαγραφή</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function Posts() {
  const [data, setData] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const posts = await getData()
        setData(posts)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        emptyStateMessage="Καμία εγγραφή στην βάση δεδομένων"
        filterColumn="title"
        filterPlaceholder="Φίλτρο τίτλων..."
      />
    </div>
  )
}
