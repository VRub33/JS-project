import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  useGetUsersQuery, 
  useBlockUserMutation, 
  useDeleteUserMutation, 
  useGetReviewsQuery, 
  useBlockReviewMutation, 
  useDeleteReviewMutation, 
  useLazyGetUsersQuery, 
  useLazyGetReviewsQuery 
  } from '../../store/api';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import './AdminPanel.scss'

// Компонент для перетаскивания колонок
const DraggableColumnHeader = ({ header, reorderColumn }) => {
  const { id } = header.column;
  
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN_DRAG',
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COLUMN_DRAG',
    drop: (draggedItem) => {
      if (draggedItem.id !== id) {
        reorderColumn(draggedItem.id, id);
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      colSpan={header.colSpan}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: header.getSize(),
        position: 'relative',
      }}
      onClick={header.column.getToggleSortingHandler()}
      className="user-select-none"
    >
      <div className="d-flex align-items-center justify-content-between">
        {flexRender(header.column.columnDef.header, header.getContext())}
        <span>
          {{
            asc: ' 🔼',
            desc: ' 🔽',
          }[header.column.getIsSorted()] ?? null}
        </span>
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
      />
    </th>
  );
};


const VirtualizedTableBody = ({ table, isLoading, hasMore, loadMore }) => {
  const { rows } = table.getRowModel();
  const tableContainerRef = React.useRef(null);
  const loaderRef = useInfiniteScroll(loadMore, isLoading, hasMore); // Используем хук для отслеживания прокрутки

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  });

  // Получаем текущие размеры колонок
  const columnSizes = table.getHeaderGroups()[0]?.headers.map(header => ({
    id: header.id,
    size: header.getSize(),
  })) || [];
  
  return (
    <div 
      ref={tableContainerRef}
      style={{ height: `100px`, overflow: 'auto' }}
      >
      <table style={{
          width: '100%',
          tableLayout: 'fixed',
          position: 'relative',
          borderSpacing: 0
        }}
      >
        <tbody style={{ position: 'relative', height: `${rowVirtualizer.getTotalSize()}px`}}>
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            return (
              <tr key={row.id}
                  style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map(cell => {
                const columnSize = columnSizes.find(c => c.id === cell.column.id)?.size || 150;
                return(
                  <td
                    key={cell.id}
                    style={{
                      width: `${columnSize}px`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxSizing: 'border-box'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                  );
                })}
              </tr>
            );
          })}
          {hasMore && (
            <tr ref={loaderRef}>
              <td colSpan={table.getAllColumns().length} style={{ 
                textAlign: 'center',
                padding: '20px',
              }}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <span></span>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AdminPanel = () => {
  const dispatch = useDispatch();
  
  const { data: usersList = [], loading: usersLoading, error: usersError } = useGetUsersQuery();
  const { data: reviews = [], loading: reviewsLoading, error: reviewsError } = useGetReviewsQuery();
  console.log('usersList:', usersList);
  console.log('reviews', reviews);

  const [fetchUsers] = useLazyGetUsersQuery();
  const [fetchReviews] = useLazyGetReviewsQuery();
  const [blockUser] = useBlockUserMutation();
  const [blockReview] = useBlockReviewMutation();
  
  const [deleteUser] = useDeleteUserMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Динамическая подгрузка
  const [usersPage, setUsersPage] = useState([]);
  const [reviewsPage, setReviewsPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  const loadMoreUsers = async () => {
    if (usersLoading || !hasMoreUsers) return;
    
    setIsLoading(true);
    
    try {
      const newUsers  = await fetchUsers(usersPage.length, 10);
      if (!Array.isArray(newUsers.data)) {
        console.error("Ошибка: fetchUsers должен вернуть массив, но вернул:", newUsers);
        setIsLoading(false);
        return;
      }
      setUsersPage(prevUsers => [...prevUsers, ...newUsers.data]);
      setIsLoading(false);

      if (newUsers.data.length < 10) {
        setHasMoreUsers(false);
      } 
    } catch (error) {
      setIsLoading(false); // Завершаем загрузку в случае ошибки
      console.error('Error loading users:', error);
    }
  };

  const loadMoreReviews = async () => {
    if (reviewsLoading || !hasMoreReviews) return;
    
    setIsLoading(true);
    try {
      const newReviews  = await fetchReviews(reviewsPage.length, 10);
      if (!Array.isArray(newReviews.data)) {
        console.error("Ошибка: fetchReviews должен вернуть массив, но вернул:", newReviews);
        setIsLoading(false);
        return;
      }
      setReviewsPage(prevReviews => [...prevReviews, ...newReviews.data]);
      setIsLoading(false);
      
      if (newReviews.data.length < 10) {
        setHasMoreUsers(false);
      } 
    } catch (error) {
      setIsLoading(false); // Завершаем загрузку в случае ошибки
      console.error('Error loading users:', error);
    }
  };

  // Состояние для порядка колонок
  const [usersColumnOrder, setUsersColumnOrder] = React.useState([]);
  const [reviewsColumnOrder, setReviewsColumnOrder] = React.useState([]);
  const [columnResizeMode] = React.useState('onChange');

  useEffect(() => {
    if (!usersList || !reviews){
      dispatch(fetchUsers());
      dispatch(fetchReviews());
    }
  }, [dispatch]);

  const handleBlockUser = async (userId) => {
    try{
      await blockUser(userId).unwrap();
    } catch (err) {
      console.error('Не удалось заблокировать пользователя:', err);
    }
  };

  const handleBlockReview = async (reviewId) => {
    try{
      await blockReview(reviewId).unwrap();
    } catch (err) {
      console.error('Не удалось заблокировать отзыв:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
    } catch (err) {
       console.error('Не удалось удалить пользователя:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
       await deleteReview(reviewId).unwrap();
     } catch (err) {
       console.error('Не удалось удалить отзыв:', err);
     }
  };

  const usersColumns = useMemo(() => [
    { 
      accessorKey: 'id', 
      header: 'ID',
      size: 130,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '130px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Имя',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 250,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '250px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'role', 
      header: 'Роль',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    {
      accessorKey: 'blocked',
      header: 'Статус',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue() ? 'Заблокирован' : 'Активен'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Действия',
      size: 300,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant={row.original.blocked ? 'success' : 'warning'}
            size="sm"
            onClick={() => handleBlockUser(row.original.id)}
            disabled={usersLoading}
          >
            {row.original.blocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteUser(row.original.id)}
            disabled={usersLoading}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ], [usersLoading]);

  const reviewsColumns = useMemo(() => [
    { 
      accessorKey: 'id', 
      header: 'ID',
      size: 130,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '130px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Имя',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 250,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '250px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'message', 
      header: 'Текст',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'date', 
      header: 'Дата',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Действия',
      size: 300,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant={row.original.block ? 'success' : 'warning'}
            size="sm"
            onClick={() => handleBlockReview(row.original.id)}
            disabled={reviewsLoading}
          >
            {row.original.block ? 'Разблокировать' : 'Заблокировать'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteReview(row.original.id)}
            disabled={reviewsLoading}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ], [reviewsLoading]);

  const reorderUsersColumn = (draggedColumnId, targetColumnId) => {
    const newColumnOrder = [...usersColumnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedColumnId);
    const targetIndex = newColumnOrder.indexOf(targetColumnId);
    
    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedColumnId);
    
    setUsersColumnOrder(newColumnOrder);
  };

  const reorderReviewsColumn = (draggedColumnId, targetColumnId) => {
    const newColumnOrder = [...reviewsColumnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedColumnId);
    const targetIndex = newColumnOrder.indexOf(targetColumnId);
    
    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedColumnId);
    
    setReviewsColumnOrder(newColumnOrder);
  };

  

  const usersTable = useReactTable({
    data: usersList || [],
    columns: usersColumns,
    state: {
      columnOrder: usersColumnOrder,
    },
    onColumnOrderChange: setUsersColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  });

  const reviewsTable = useReactTable({
    data: reviews || [],
    columns: reviewsColumns,
    state: {
      columnOrder: reviewsColumnOrder,
    },
    onColumnOrderChange: setReviewsColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  });

  // Инициализация порядка колонок после загрузки данных
  useEffect(() => {
    if (usersList.length > 0 && usersColumnOrder.length === 0) {
      setUsersColumnOrder(usersTable.getAllLeafColumns().map(column => column.id));
    }
  }, [usersList, usersColumnOrder]);

  useEffect(() => {
    if (reviews.length > 0 && reviewsColumnOrder.length === 0) {
      setReviewsColumnOrder(reviewsTable.getAllLeafColumns().map(column => column.id));
    }
  }, [reviews, reviewsColumnOrder]);

  const usersCellWidths = useMemo(() => {
    return usersTable.getHeaderGroups()[0]?.headers.map(header => header.getSize()) || [];
  }, [usersTable.getState().columnOrder, usersTable.getState().columnSizing]);

  const reviewsCellWidths = useMemo(() => {
    return reviewsTable.getHeaderGroups()[0]?.headers.map(header => header.getSize()) || [];
  }, [reviewsTable.getState().columnOrder, reviewsTable.getState().columnSizing]);

  if (usersLoading || reviewsLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <div>No reviews found</div>;
  }

  if (!usersList || usersList.length === 0) {
    return <div>No reviews found</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mt-4" >
        <h2>Панель администратора</h2>
        <Card className="mb-4">
          <Card.Header>
            <h3>Пользователи</h3>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
            <Table striped bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  {usersTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} style={{ display: 'flex' }}>
                      {headerGroup.headers.map((header, index) => (
                        <DraggableColumnHeader 
                          key={header.id} 
                          header={header} 
                          reorderColumn={reorderUsersColumn}
                          style={{ 
                            width: `${usersCellWidths[index]}px`,
                            flexShrink: 0
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </thead>
                </Table>
                <VirtualizedTableBody 
                  table={usersTable} 
                  hasMore={hasMoreUsers}
                  loadMore={loadMoreUsers}
                />
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h3>Отзывы</h3>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  {reviewsTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} style={{ display: 'flex' }}>
                      {headerGroup.headers.map((header, index) => (
                        <DraggableColumnHeader 
                          key={header.id} 
                          header={header} 
                          reorderColumn={reorderReviewsColumn}
                          style={{ 
                            width: `${reviewsCellWidths[index]}px`,
                            flexShrink: 0
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </thead>
                </Table>
                <VirtualizedTableBody 
                  table={reviewsTable}
                  hasMore={hasMoreReviews}
                  loadMore={loadMoreReviews}
                />
            </div>
          </Card.Body>
        </Card>
      </div>
    </DndProvider>
  );
};

export default AdminPanel;